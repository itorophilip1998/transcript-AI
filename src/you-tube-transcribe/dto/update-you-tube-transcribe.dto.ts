import { PartialType } from '@nestjs/mapped-types';
import { CreateYouTubeTranscribeDto } from './create-you-tube-transcribe.dto';

export class UpdateYouTubeTranscribeDto extends PartialType(CreateYouTubeTranscribeDto) {}
