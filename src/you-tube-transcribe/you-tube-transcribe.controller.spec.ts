import { Test, TestingModule } from '@nestjs/testing';
import { YouTubeTranscribeController } from './you-tube-transcribe.controller';
import { YouTubeTranscribeService } from './you-tube-transcribe.service';

describe('YouTubeTranscribeController', () => {
  let controller: YouTubeTranscribeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YouTubeTranscribeController],
      providers: [YouTubeTranscribeService],
    }).compile();

    controller = module.get<YouTubeTranscribeController>(YouTubeTranscribeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
