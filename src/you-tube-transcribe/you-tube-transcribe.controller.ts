import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { YouTubeTranscribeService } from './you-tube-transcribe.service';
import { CreateYouTubeTranscribeDto } from './dto/create-you-tube-transcribe.dto';
import { UpdateYouTubeTranscribeDto } from './dto/update-you-tube-transcribe.dto';

@Controller('you-tube-transcribe')
export class YouTubeTranscribeController {
  constructor(private readonly youTubeTranscribeService: YouTubeTranscribeService) {}

  @Post()
  create(@Body() createYouTubeTranscribeDto: CreateYouTubeTranscribeDto) {
    return this.youTubeTranscribeService.create(createYouTubeTranscribeDto);
  }

  @Get()
  findAll() {
    return this.youTubeTranscribeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.youTubeTranscribeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateYouTubeTranscribeDto: UpdateYouTubeTranscribeDto) {
    return this.youTubeTranscribeService.update(+id, updateYouTubeTranscribeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.youTubeTranscribeService.remove(+id);
  }
}
