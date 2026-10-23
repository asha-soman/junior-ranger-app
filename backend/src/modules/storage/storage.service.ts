import 'multer';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucketName: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private configService: ConfigService) {
    this.storage = new Storage();
    const bucketName = this.configService.get<string>('GCS_BUCKET_NAME');
    if (!bucketName) {
      throw new Error(
        'GCS_BUCKET_NAME is not defined in the environment variables',
      );
    }
    this.bucketName = bucketName;
  }

  async uploadFile(file: Express.Multer.File, user: any): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const blob = bucket.file(fileName);

      return new Promise((resolve, reject) => {
        const blobStream = blob.createWriteStream({
          resumable: false,
          contentType: file.mimetype,
          metadata: {
            metadata: {
              ownerId: user.id,
              ownerRole: user.role,
            },
          },
        });

        blobStream.on('error', (err) => {
          this.logger.error(`Failed to upload file: ${err.message}`);
          reject(new InternalServerErrorException('Failed to upload file'));
        });

        blobStream.on('finish', () => {
          resolve(`/storage/files/${fileName}`);
        });

        blobStream.end(file.buffer);
      });
    } catch (error) {
      this.logger.error('Error in uploadFile', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async streamFile(fileName: string, user: any, res: Response) {
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(fileName);
    const [exists] = await blob.exists();
    if (!exists) throw new NotFoundException('File not found');

    const [metadata] = await blob.getMetadata();
    const ownerId = metadata.metadata?.ownerId;
    const ownerRole = metadata.metadata?.ownerRole;

    const isOwner = ownerId === user.id;
    const isAdminOrRanger = user.role === 'admin' || user.role === 'ranger';
    const isPublicAsset = ownerRole === 'admin' || ownerRole === 'ranger';

    if (!isOwner && !isAdminOrRanger && !isPublicAsset) {
      throw new ForbiddenException('You do not have permission to view this file');
    }

    res.setHeader('Content-Type', metadata.contentType || 'application/octet-stream');
    blob.createReadStream().pipe(res);
  }

  async deleteFile(fileName: string, user: any) {
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(fileName);
    const [exists] = await blob.exists();
    if (!exists) throw new NotFoundException('File not found');

    const [metadata] = await blob.getMetadata();
    const ownerId = metadata.metadata?.ownerId;

    const isOwner = ownerId === user.id;
    const isAdminOrRanger = user.role === 'admin' || user.role === 'ranger';

    if (!isOwner && !isAdminOrRanger) {
      throw new ForbiddenException('You do not have permission to delete this file');
    }

    await blob.delete();
  }
}
