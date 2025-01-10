import { Module } from '@nestjs/common';
import { YouTubeTranscribeModule } from './you-tube-transcribe/you-tube-transcribe.module';

@Module({
  imports: [YouTubeTranscribeModule],
})
export class AppModule {}
