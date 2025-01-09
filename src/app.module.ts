import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranscribeModule } from './transcribe/transcribe.module';

@Module({
  imports: [TranscribeModule], 
})
export class AppModule {}
