import { Test, TestingModule } from '@nestjs/testing';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { Response } from 'express';

describe('StorageController', () => {
  let controller: StorageController;
  let service: StorageService;

  beforeEach(async () => {
    const mockStorageService = {
      uploadFile: jest.fn(),
      streamFile: jest.fn(),
      deleteFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    controller = module.get<StorageController>(StorageController);
    service = module.get<StorageService>(StorageService);
  });

  describe('uploadFile', () => {
    it('should upload a file and return the URL', async () => {
      const mockFile = {} as Express.Multer.File;
      const mockUser = { id: 'user1', role: 'junior_ranger' };
      const mockReq = { user: mockUser };
      
      jest.spyOn(service, 'uploadFile').mockResolvedValue('/storage/files/test.png');
      
      const result = await controller.uploadFile(mockFile, mockReq);
      
      expect(result).toEqual({ imageUrl: '/storage/files/test.png' });
      expect(service.uploadFile).toHaveBeenCalledWith(mockFile, mockUser);
    });
  });

  describe('getFile', () => {
    it('should stream the file', async () => {
      const mockUser = { id: 'user1', role: 'junior_ranger' };
      const mockReq = { user: mockUser };
      const mockRes = {} as Response;
      
      await controller.getFile('test.png', mockReq, mockRes);
      
      expect(service.streamFile).toHaveBeenCalledWith('test.png', mockUser, mockRes);
    });
  });

  describe('deleteFile', () => {
    it('should delete the file and return success', async () => {
      const mockUser = { id: 'user1', role: 'junior_ranger' };
      const mockReq = { user: mockUser };
      
      const result = await controller.deleteFile('test.png', mockReq);
      
      expect(result).toEqual({ success: true });
      expect(service.deleteFile).toHaveBeenCalledWith('test.png', mockUser);
    });
  });
});
