import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TranscribeService } from './transcribe.service';
import { CreateTranscribeDto } from './dto/create-transcribe.dto';
import { UpdateTranscribeDto } from './dto/update-transcribe.dto';

@Controller('transcribe')
export class TranscribeController {
  constructor(private readonly transcribeService: TranscribeService) {}

  @Post()
  create(@Body() createTranscribeDto: CreateTranscribeDto) {
    return this.transcribeService.create(createTranscribeDto);
  }

  @Get()
  findAll() {
    return this.transcribeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transcribeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTranscribeDto: UpdateTranscribeDto) {
    return this.transcribeService.update(+id, updateTranscribeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transcribeService.remove(+id);
  }
}
