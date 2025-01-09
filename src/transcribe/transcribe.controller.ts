import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TranscribeService } from './transcribe.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; // Importing Express for correct typing

@Controller('transcribe')
export class TranscribeController {
  constructor(private readonly transcribeService: TranscribeService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file')) // Handle file upload
  async transcribe(
    @UploadedFile() file: Express.Multer.File, // Correctly typing the file object
    @Body() body: any,
  ) {
    if (file) {
      // Check MIME type to see if it's audio or video
      const mimeType = file.mimetype.split('/')[0];
      if (mimeType === 'video') {
        return this.transcribeService.processVideoFile(file); // Process video
      } else if (mimeType === 'audio') {
        return this.transcribeService.processAudioFile(file); // Process audio directly
      } else {
        throw new Error(
          'Unsupported file type. Please upload a video or audio file.',
        );
      }
    } else if (body.url) {
      // If URL is provided, process the video/audio URL
      return this.transcribeService.processMediaUrl(body.url);
    } else {
      throw new Error('No video file or URL provided.');
    }
  }
}
