import { Module } from '@nestjs/common';
import { YouTubeTranscribeService } from './you-tube-transcribe.service';
import { YouTubeTranscribeController } from './you-tube-transcribe.controller';

@Module({
  controllers: [YouTubeTranscribeController],
  providers: [YouTubeTranscribeService],
})
export class YouTubeTranscribeModule {}
