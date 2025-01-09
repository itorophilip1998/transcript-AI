import { Injectable } from '@nestjs/common';
import { CreateTranscribeDto } from './dto/create-transcribe.dto';
import { UpdateTranscribeDto } from './dto/update-transcribe.dto';

@Injectable()
export class TranscribeService {
  create(createTranscribeDto: CreateTranscribeDto) {
    return 'This action adds a new transcribe';
  }

  findAll() {
    return `This action returns all transcribe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transcribe`;
  }

  update(id: number, updateTranscribeDto: UpdateTranscribeDto) {
    return `This action updates a #${id} transcribe`;
  }

  remove(id: number) {
    return `This action removes a #${id} transcribe`;
  }
}
