import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { Response } from 'express';

jest.mock('@google-cloud/storage');

describe('StorageService', () => {
  let service: StorageService;
  let mockStorage: any;
  let mockBucket: any;
  let mockFile: any;

  beforeEach(async () => {
    mockFile = {
      exists: jest.fn().mockResolvedValue([true]),
      getMetadata: jest.fn().mockResolvedValue([{}]),
      createWriteStream: jest.fn(),
      createReadStream: jest.fn(),
      delete: jest.fn(),
    };

    mockBucket = {
      file: jest.fn().mockReturnValue(mockFile),
    };

    mockStorage = {
      bucket: jest.fn().mockReturnValue(mockBucket),
    };

    (Storage as unknown as jest.Mock).mockImplementation(() => mockStorage);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-bucket'),
          },
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('streamFile', () => {
    it('should throw NotFoundException if file does not exist', async () => {
      mockFile.exists.mockResolvedValueOnce([false]);
      
      const mockRes = {} as Response;
      
      await expect(service.streamFile('test.png', { id: 'user1', role: 'junior_ranger' }, mockRes))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner and not admin/ranger', async () => {
      mockFile.getMetadata.mockResolvedValueOnce([{ metadata: { ownerId: 'user2', ownerRole: 'junior_ranger' } }]);
      
      const mockRes = {} as Response;
      
      await expect(service.streamFile('test.png', { id: 'user1', role: 'junior_ranger' }, mockRes))
        .rejects.toThrow(ForbiddenException);
    });

    it('should allow owner to stream file', async () => {
      mockFile.getMetadata.mockResolvedValueOnce([{ metadata: { ownerId: 'user1', ownerRole: 'junior_ranger' } }]);
      
      const mockRes = {
        setHeader: jest.fn(),
      } as unknown as Response;

      const mockPipe = jest.fn();
      mockFile.createReadStream.mockReturnValue({ pipe: mockPipe });
      
      await service.streamFile('test.png', { id: 'user1', role: 'junior_ranger' }, mockRes);
      expect(mockRes.setHeader).toHaveBeenCalled();
      expect(mockPipe).toHaveBeenCalledWith(mockRes);
    });

    it('should allow admin to stream any file', async () => {
      mockFile.getMetadata.mockResolvedValueOnce([{ metadata: { ownerId: 'user2', ownerRole: 'junior_ranger' } }]);
      
      const mockRes = { setHeader: jest.fn() } as unknown as Response;
      mockFile.createReadStream.mockReturnValue({ pipe: jest.fn() });
      
      await service.streamFile('test.png', { id: 'admin1', role: 'admin' }, mockRes);
      expect(mockRes.setHeader).toHaveBeenCalled();
    });

    it('should allow any authenticated user to stream public assets uploaded by admin/ranger', async () => {
      mockFile.getMetadata.mockResolvedValueOnce([{ metadata: { ownerId: 'admin1', ownerRole: 'admin' } }]);
      
      const mockRes = { setHeader: jest.fn() } as unknown as Response;
      mockFile.createReadStream.mockReturnValue({ pipe: jest.fn() });
      
      await service.streamFile('test.png', { id: 'user1', role: 'junior_ranger' }, mockRes);
      expect(mockRes.setHeader).toHaveBeenCalled();
    });
  });

  describe('deleteFile', () => {
    it('should throw NotFoundException if file does not exist', async () => {
      mockFile.exists.mockResolvedValueOnce([false]);
      await expect(service.deleteFile('test.png', { id: 'user1', role: 'junior_ranger' }))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner and not admin/ranger', async () => {
      mockFile.getMetadata.mockResolvedValueOnce([{ metadata: { ownerId: 'user2', ownerRole: 'junior_ranger' } }]);
      await expect(service.deleteFile('test.png', { id: 'user1', role: 'junior_ranger' }))
        .rejects.toThrow(ForbiddenException);
    });

    it('should allow owner to delete file', async () => {
      mockFile.getMetadata.mockResolvedValueOnce([{ metadata: { ownerId: 'user1', ownerRole: 'junior_ranger' } }]);
      await service.deleteFile('test.png', { id: 'user1', role: 'junior_ranger' });
      expect(mockFile.delete).toHaveBeenCalled();
    });

    it('should allow admin to delete any file', async () => {
      mockFile.getMetadata.mockResolvedValueOnce([{ metadata: { ownerId: 'user2', ownerRole: 'junior_ranger' } }]);
      await service.deleteFile('test.png', { id: 'admin1', role: 'admin' });
      expect(mockFile.delete).toHaveBeenCalled();
    });
  });
});
