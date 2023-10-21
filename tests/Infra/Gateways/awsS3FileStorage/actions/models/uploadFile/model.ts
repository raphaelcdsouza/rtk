import { Readable } from 'stream';

export class UploadFileModel {
  stringFile: string;

  bufferFile: Buffer;

  streamFile: Readable;

  key: string;

  bucketName: string;

  mimeType: string;

  region: string;

  constructor() {
    this.stringFile = 'any_string_file';
    this.bufferFile = Buffer.from('any_buffer_file');
    this.streamFile = new Readable();
    this.key = 'any_key';
    this.bucketName = 'any_bucket_name';
    this.mimeType = 'any_mime_type';
    this.region = 'any_region';
  }

  getObjectUrl(defaultRegion = true) {
    const region = defaultRegion ? 'us-west-2' : this.region;

    return `https://${this.bucketName}.s3.${region}.amazonaws.com/${this.key}`;
  }
}
