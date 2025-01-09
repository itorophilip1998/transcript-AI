import { Injectable } from '@nestjs/common';
import * as fluentFfmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import { SpeechClient, protos } from '@google-cloud/speech';
import * as axios from 'axios';
import * as tmp from 'tmp';

@Injectable()
export class TranscribeService {
  private readonly speechClient: SpeechClient;

  constructor() {
    this.speechClient = new SpeechClient();
  }

  // Main function to process media files (either URL or uploaded file)
  async processMedia(input: string | Express.Multer.File) {
    if (typeof input === 'string') {
      console.log('Processing media from URL:', input);
      // URL input
      return this.processMediaUrl(input);
    } else {
      // File input
      console.log('Processing media from file:', input);
      return this.processFile(input);
    }
  }

  // Process video files and extract audio
  private async processFile(file: Express.Multer.File) {
    const mimeType = await this.detectMediaType(file.path);
    if (mimeType === 'video') {
      const audioFilePath = await this.extractAudioFromVideo(file);
      return this.transcribeAudio(audioFilePath);
    } else if (mimeType === 'audio') {
      return this.transcribeAudio(file.path);
    } else {
      throw new Error('Unsupported media type');
    }
  }

  // Process media files from a URL
  async processMediaUrl(url: string) {
    const mediaBuffer = await this.downloadMedia(url);

    // Create a temporary file for the downloaded media
    const tmpMediaFile = tmp.fileSync({ postfix: '.mp4' });
    fs.writeFileSync(tmpMediaFile.name, mediaBuffer); // Save the downloaded content to the temp file

    console.log(`Processing media from URL : ${url}`);

    const mimeType = await this.detectMediaType(tmpMediaFile.name);
    console.log(`Detected mimeType : ${mimeType}`);

    if (mimeType === 'video') {
      const audioFilePath = await this.extractAudioFromVideo(tmpMediaFile);
      console.log(`Audio file saved to: ${audioFilePath}`);
      return this.transcribeAudio(audioFilePath); // Process extracted audio
    } else if (mimeType === 'audio') {
      console.log(`Audio file path: ${tmpMediaFile.name}`);
      return this.transcribeAudio(tmpMediaFile.name); // Process audio directly
    } else {
      console.log(`Unsupported media type`);
      throw new Error('Unsupported media type');
    }
  }

  // Download media file from a URL
  private async downloadMedia(url: string): Promise<Buffer> {
    const response = await axios.default.get(url, {
      responseType: 'arraybuffer',
    });
    return Buffer.from(response.data);
  }

  // Detect whether the file is audio or video based on extension
  private async detectMediaType(filePath: string): Promise<'audio' | 'video'> {
    const fileExtension = path.extname(filePath).toLowerCase();
    if (['.mp3', '.wav', '.flac'].includes(fileExtension)) {
      return 'audio';
    } else if (['.mp4', '.mov', '.avi'].includes(fileExtension)) {
      return 'video';
    } else {
      throw new Error('Unsupported file type');
    }
  }

  // Extract audio from video file
  private async extractAudioFromVideo(
    file: Express.Multer.File | tmp.FileResult,
  ) {
    return new Promise<string>((resolve, reject) => {
      const audioFilePath = tmp.tmpNameSync({
        postfix: '.flac',
        dir: tmp.dirSync().name, // Using system temp directory for audio output
      });

      console.log(
        `Extracting audio from video file: ${file.name || file.path}`,
      );
      console.log(`Saving extracted audio to: ${audioFilePath}`);

      fluentFfmpeg(file.name || file.path) // Use file.name or file.path
        .audioCodec('flac')
        .toFormat('flac')
        .save(audioFilePath)
        .on('end', () => {
          console.log(`Audio extraction completed: ${audioFilePath}`);
          resolve(audioFilePath); // Return the path to the extracted audio
        })
        .on('error', (err) => {
          console.error(`Error during audio extraction: ${err.message}`);
          reject(err);
        });
    });
  }

  // Transcribe audio using Google Cloud Speech-to-Text API
  private async transcribeAudio(audioFilePath: string) {
    const audioBytes = await this.readFileAsBase64(audioFilePath);

    const audio = { content: audioBytes };
    const config = {
      encoding:
        protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.FLAC,
      sampleRateHertz: await this.getSampleRate(audioFilePath),
      languageCode: 'en-US',
    };

    const request = { audio: audio, config: config };

    try {
      const [operation] = await this.speechClient.longRunningRecognize(request);
      const [response] = await operation.promise();

      const transcript = response.results
        .map((result) => result.alternatives[0].transcript)
        .join('\n');

      // Clean up temporary audio file after transcription
      if (fs.existsSync(audioFilePath)) {
        fs.unlinkSync(audioFilePath);
        console.log(`Temporary file deleted: ${audioFilePath}`);
      }

      return { transcript };
    } catch (err) {
      console.error('Error during transcription: ', err);
      throw new Error('Error during transcription');
    }
  }

  // Helper function to read file as base64
  private async readFileAsBase64(filePath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const buffer = [];
      const stream = fs.createReadStream(filePath);

      stream.on('data', (chunk) => buffer.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(buffer).toString('base64')));
      stream.on('error', reject);
    });
  }

  // Helper function to get the sample rate of an audio file
  private async getSampleRate(filePath: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      fluentFfmpeg(filePath).ffprobe((err, metadata) => {
        if (err) {
          reject(err);
        } else {
          const sampleRate = metadata.streams[0]?.sample_rate || 16000; // Default to 16000 if not found
          resolve(sampleRate);
        }
      });
    });
  }
}
