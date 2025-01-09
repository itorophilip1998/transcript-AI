import { Module } from '@nestjs/common';
import { TranscribeModule } from './transcribe/transcribe.module';

@Module({
  imports: [TranscribeModule],
})
export class AppModule {}
