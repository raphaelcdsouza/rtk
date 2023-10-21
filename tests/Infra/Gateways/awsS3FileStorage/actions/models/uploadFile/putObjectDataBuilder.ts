import { Readable } from 'stream';
import { UploadFileModel } from './model';

export class PutObjectDataBuilder {
  private readonly putObjectInput: {
    Bucket: string
    Key: string
    Body: string | Buffer | Readable
    ContentType?: string
  };

  private model = new UploadFileModel();

  private constructor() {
    this.putObjectInput = {
      Bucket: this.model.bucketName,
      Key: this.model.key,
      Body: this.model.stringFile,
    };
  }

  static aPutObjectInput() {
    return new PutObjectDataBuilder();
  }

  withContentType() {
    this.putObjectInput.ContentType = this.model.mimeType;
    return this;
  }

  withBuffer() {
    this.putObjectInput.Body = this.model.bufferFile;
    return this;
  }

  withStream() {
    this.putObjectInput.Body = this.model.streamFile;
    return this;
  }

  build() {
    return this.putObjectInput;
  }
}
