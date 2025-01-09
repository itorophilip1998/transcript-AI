import { PartialType } from '@nestjs/mapped-types';
import { CreateTranscribeDto } from './create-transcribe.dto';

export class UpdateTranscribeDto extends PartialType(CreateTranscribeDto) {}
