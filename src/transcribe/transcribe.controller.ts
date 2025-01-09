import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
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
    try {
      if (file) {
        // Pass the file directly to the service for processing
        return this.transcribeService.processMedia(file);
      } else if (body.url) {
        // If URL is provided, process the video/audio URL
        return this.transcribeService.processMedia(body.url);
      } else {
        // Throw an exception if neither file nor URL is provided
        throw new BadRequestException('No video file or URL provided.');
      }
    } catch (error) {
      console.error('Error during transcription process:', error);
      throw new BadRequestException(error.message || 'Transcription failed.');
    }
  }
}
