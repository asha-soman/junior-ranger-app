import 'multer';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';

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

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const blob = bucket.file(fileName);

      return new Promise((resolve, reject) => {
        const blobStream = blob.createWriteStream({
          resumable: false,
          contentType: file.mimetype,
        });

        blobStream.on('error', (err) => {
          this.logger.error(`Failed to upload file: ${err.message}`);
          reject(new InternalServerErrorException('Failed to upload file'));
        });

        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
          resolve(publicUrl);
        });

        blobStream.end(file.buffer);
      });
    } catch (error) {
      this.logger.error('Error in uploadFile', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }
}
