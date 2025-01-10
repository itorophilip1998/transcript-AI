import { Injectable } from '@nestjs/common';
import { CreateYouTubeTranscribeDto } from './dto/create-you-tube-transcribe.dto';
import { UpdateYouTubeTranscribeDto } from './dto/update-you-tube-transcribe.dto';

@Injectable()
export class YouTubeTranscribeService {
  create(createYouTubeTranscribeDto: CreateYouTubeTranscribeDto) {
    return 'This action adds a new youTubeTranscribe';
  }

  findAll() {
    return `This action returns all youTubeTranscribe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} youTubeTranscribe`;
  }

  update(id: number, updateYouTubeTranscribeDto: UpdateYouTubeTranscribeDto) {
    return `This action updates a #${id} youTubeTranscribe`;
  }

  remove(id: number) {
    return `This action removes a #${id} youTubeTranscribe`;
  }
}
