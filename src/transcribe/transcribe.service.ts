import { Injectable } from '@nestjs/common';
import * as fluentFfmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import { SpeechClient, protos } from '@google-cloud/speech'; // Correct import
import * as axios from 'axios';
import * as tmp from 'tmp';

@Injectable()
export class TranscribeService {
  private readonly speechClient: SpeechClient;

  constructor() {
    // Initialize the Google Cloud Speech client
    this.speechClient = new SpeechClient();
  }

  // Process video file upload: Extract audio from video and transcribe it
  async processVideoFile(file: Express.Multer.File) {
    const audioFilePath = await this.extractAudioFromVideo(file);
    return this.transcribeAudio(audioFilePath);
  }

  // Process audio file upload and transcribe it directly
  async processAudioFile(file: Express.Multer.File) {
    const audioFilePath = file.path;
    return this.transcribeAudio(audioFilePath);
  }

  // Process video or audio URL (Download and transcribe)
  async processMediaUrl(url: string) {
    const mediaBuffer = await this.downloadMedia(url);
    const tmpMediaFile = tmp.fileSync({ postfix: '.mp4' });
    fs.writeFileSync(tmpMediaFile.name, mediaBuffer);

    // Check if the media is a video or audio based on the file extension
    const mimeType = await this.detectMediaType(tmpMediaFile.name);
    if (mimeType === 'video') {
      const audioFilePath = await this.extractAudioFromVideo(tmpMediaFile);
      return this.transcribeAudio(audioFilePath);
    } else if (mimeType === 'audio') {
      return this.transcribeAudio(tmpMediaFile.name);
    } else {
      throw new Error('Unsupported media type');
    }
  }

  // Function to download media (audio/video) from a URL
  private async downloadMedia(url: string): Promise<Buffer> {
    const response = await axios.default.get(url, {
      responseType: 'arraybuffer',
    });
    return Buffer.from(response.data);
  }

  // Detect whether the file is audio or video based on its extension
  private async detectMediaType(filePath: string): Promise<'audio' | 'video'> {
    const fileExtension = path.extname(filePath).toLowerCase();
    if (
      fileExtension === '.mp3' ||
      fileExtension === '.wav' ||
      fileExtension === '.flac'
    ) {
      return 'audio';
    } else if (
      fileExtension === '.mp4' ||
      fileExtension === '.mov' ||
      fileExtension === '.avi'
    ) {
      return 'video';
    } else {
      throw new Error('Unsupported file type');
    }
  }

  // Extract audio from video using ffmpeg
  private async extractAudioFromVideo(
    file: Express.Multer.File | tmp.FileResult,
  ) {
    return new Promise<string>((resolve, reject) => {
      const audioFilePath = tmp.tmpNameSync({ postfix: '.flac' });

      fluentFfmpeg(file.path)
        .audioCodec('flac')
        .toFormat('flac')
        .save(audioFilePath)
        .on('end', () => resolve(audioFilePath))
        .on('error', (err) => reject(err));
    });
  }

  // Transcribe audio using Google Cloud Speech-to-Text API
  private async transcribeAudio(audioFilePath: string) {
    const file = fs.readFileSync(audioFilePath);
    const audioBytes = file.toString('base64');

    const audio = { content: audioBytes };

    const config = {
      encoding: protos.google.cloud.speech.v1.enums.AudioEncoding.FLAC, // Correct usage
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };

    const request = {
      audio: audio,
      config: config,
    };

    try {
      const [operation] = await this.speechClient.longRunningRecognize(request);
      const [response] = await operation.promise();

      const transcript = response.results
        .map((result) => result.alternatives[0].transcript)
        .join('\n');

      // Clean up the temporary audio file
      fs.unlinkSync(audioFilePath);

      return { transcript };
    } catch (err) {
      console.error('Error during transcription: ', err);
      throw new Error('Error during transcription');
    }
  }
}
