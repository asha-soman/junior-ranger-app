import 'multer';
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { Response } from 'express';

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: any,
  ) {
    const url = await this.storageService.uploadFile(file, req.user);
    return { imageUrl: url };
  }

  @Get('files/:fileName')
  async getFile(
    @Param('fileName') fileName: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    await this.storageService.streamFile(fileName, req.user, res);
  }

  @Delete('files/:fileName')
  async deleteFile(
    @Param('fileName') fileName: string,
    @Req() req: any,
  ) {
    await this.storageService.deleteFile(fileName, req.user);
    return { success: true };
  }
}
