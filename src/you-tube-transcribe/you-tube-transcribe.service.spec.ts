import { Test, TestingModule } from '@nestjs/testing';
import { YouTubeTranscribeService } from './you-tube-transcribe.service';

describe('YouTubeTranscribeService', () => {
  let service: YouTubeTranscribeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YouTubeTranscribeService],
    }).compile();

    service = module.get<YouTubeTranscribeService>(YouTubeTranscribeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
