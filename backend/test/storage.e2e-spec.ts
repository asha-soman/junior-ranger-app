import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { Storage } from '@google-cloud/storage';
import { PassThrough } from 'stream';

jest.mock('@google-cloud/storage');

describe('StorageController (e2e)', () => {
  let app: INestApplication;
  let mockUser: any;
  let mockFile: any;

  beforeAll(async () => {
    // Setup GCP Storage mock
    mockFile = {
      exists: jest.fn().mockResolvedValue([true]),
      getMetadata: jest.fn().mockResolvedValue([{ metadata: { ownerId: 'user1', ownerRole: 'junior_ranger' } }]),
      createWriteStream: jest.fn().mockImplementation(() => {
        return new PassThrough();
      }),
      createReadStream: jest.fn().mockImplementation(() => {
        const stream = new PassThrough();
        stream.end('filecontent');
        return stream;
      }),
      delete: jest.fn(),
    };

    const mockBucket = {
      file: jest.fn().mockReturnValue(mockFile),
    };

    (Storage as unknown as jest.Mock).mockImplementation(() => ({
      bucket: jest.fn().mockReturnValue(mockBucket),
    }));

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: (context: any) => {
        if (!mockUser) return false;
        const req = context.switchToHttp().getRequest();
        req.user = mockUser;
        return true;
      },
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    mockUser = null; // Reset user
    jest.clearAllMocks();
  });

  describe('POST /storage/upload', () => {
    it('should upload a file and return the URL', async () => {
      mockUser = { id: 'user1', role: 'junior_ranger' };

      const response = await request(app.getHttpServer())
        .post('/storage/upload')
        .attach('file', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'base64'), { filename: 'test.png', contentType: 'image/png' });
        

      expect(response.status).toBe(201);
      
      expect(response.body).toEqual({
        imageUrl: expect.stringMatching(/^\/storage\/files\/\d+-test\.png$/)
      });
    });

    it('should reject unauthenticated upload', async () => {
      mockUser = null; // unauthenticated
      await request(app.getHttpServer())
        .post('/storage/upload')
        .attach('file', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'base64'), { filename: 'test.png', contentType: 'image/png' })
        .expect(403); // Since we mock JwtAuthGuard to return false, Nest returns 403
    });
  });

  describe('GET /storage/files/:fileName', () => {
    it('should stream the file for the owner', async () => {
      mockUser = { id: 'user1', role: 'junior_ranger' };
      mockFile.getMetadata.mockResolvedValueOnce([{ metadata: { ownerId: 'user1', ownerRole: 'junior_ranger' } }]);

      const response = await request(app.getHttpServer())
        .get('/storage/files/test.png')
        .expect(200);
        
      expect(response.body.toString()).toBe('filecontent');
    });

    it('should forbid non-owner junior ranger', async () => {
      mockUser = { id: 'user2', role: 'junior_ranger' };
      mockFile.getMetadata.mockResolvedValueOnce([{ metadata: { ownerId: 'user1', ownerRole: 'junior_ranger' } }]);

      await request(app.getHttpServer())
        .get('/storage/files/test.png')
        .expect(403);
    });

    it('should allow admin to view any file', async () => {
      mockUser = { id: 'admin1', role: 'admin' };
      mockFile.getMetadata.mockResolvedValueOnce([{ metadata: { ownerId: 'user1', ownerRole: 'junior_ranger' } }]);

      await request(app.getHttpServer())
        .get('/storage/files/test.png')
        .expect(200);
    });
  });

  describe('DELETE /storage/files/:fileName', () => {
    it('should delete the file for the owner', async () => {
      mockUser = { id: 'user1', role: 'junior_ranger' };
      mockFile.getMetadata.mockResolvedValueOnce([{ metadata: { ownerId: 'user1', ownerRole: 'junior_ranger' } }]);

      await request(app.getHttpServer())
        .delete('/storage/files/test.png')
        .expect(200);

      expect(mockFile.delete).toHaveBeenCalled();
    });

    it('should forbid non-owner junior ranger from deleting', async () => {
      mockUser = { id: 'user2', role: 'junior_ranger' };
      mockFile.getMetadata.mockResolvedValueOnce([{ metadata: { ownerId: 'user1', ownerRole: 'junior_ranger' } }]);

      await request(app.getHttpServer())
        .delete('/storage/files/test.png')
        .expect(403);

      expect(mockFile.delete).not.toHaveBeenCalled();
    });
  });
});
