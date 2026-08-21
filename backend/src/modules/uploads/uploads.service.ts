import 'multer';
import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService implements OnModuleInit {
  private storage: Storage;
  private bucketName: string | undefined;
  private readonly logger = new Logger(UploadsService.name);

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('GCS_BUCKET_NAME');

    const projectId = this.configService.get<string>('GCP_PROJECT_ID');
    const clientEmail = this.configService.get<string>('GCP_CLIENT_EMAIL');
    const privateKey = this.configService.get<string>('GCP_PRIVATE_KEY')?.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
      this.logger.log('Initializing Google Cloud Storage with explicit credentials.');
      this.storage = new Storage({
        projectId,
        credentials: {
          client_email: clientEmail,
          private_key: privateKey,
        },
      });
    } else {
      this.logger.warn('GCP credentials missing in env. Falling back to Application Default Credentials.');
      this.storage = new Storage();
    }
  }

  async onModuleInit() {
    if (!this.bucketName) {
      this.logger.error('GCS_BUCKET_NAME is not defined in environment variables.');
      return;
    }

    // The service account has roles/storage.objectAdmin, which allows uploading files
    // but does NOT have permissions to read bucket metadata (storage.buckets.get).
    // Therefore, we skip the bucket.exists() check to avoid permission errors on startup.
    this.logger.log(`GCS initialized. Bucket target: ${this.bucketName}`);
  }

  async testUploadConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.bucketName) {
      return { success: false, message: 'Bucket not configured.' };
    }

    const testFilename = `test-connection-${Date.now()}.txt`;
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(testFilename);

    try {
      // Test 2: Attempt a write operation to verify permissions
      await blob.save('This is a test file to verify upload permissions.', {
        contentType: 'text/plain',
        resumable: false,
      });

      // Cleanup test file
      await blob.delete();

      return { success: true, message: 'Test upload and delete succeeded.' };
    } catch (error) {
      this.logger.error(`Test upload failed: ${error.message}`);
      return { success: false, message: `Test upload failed: ${error.message}` };
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('Storage bucket is not configured.');
    }

    try {
      const bucket = this.storage.bucket(this.bucketName);
      
      const fileExtension = file.originalname.split('.').pop() || 'png';
      const filename = `${uuidv4()}.${fileExtension}`;
      const blob = bucket.file(filename);

      const stream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });

      return new Promise((resolve, reject) => {
        stream.on('error', (err) => {
          this.logger.error(err);
          reject(new InternalServerErrorException('Failed to upload image to cloud storage.'));
        });

        stream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${filename}`;
          resolve(publicUrl);
        });

        stream.end(file.buffer);
      });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while preparing the image upload.');
    }
  }
}
