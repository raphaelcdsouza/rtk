import { IUploadFile } from '../../../../../../../src/Infra/Interfaces/Gateways';
import { UploadFileModel } from './model';

export class UploadFileInputDataBuilder {
  private readonly uploadFileInput: IUploadFile.Input;

  private readonly model = new UploadFileModel();

  private constructor() {
    this.uploadFileInput = {
      file: this.model.stringFile,
      bucketName: this.model.bucketName,
      key: this.model.key,
    };
  }

  static aUploadFileInput() {
    return new UploadFileInputDataBuilder();
  }

  withMIMEType() {
    this.uploadFileInput.mimeType = this.model.mimeType;
    return this;
  }

  withBuffer() {
    this.uploadFileInput.file = this.model.bufferFile;
    return this;
  }

  withStream() {
    this.uploadFileInput.file = this.model.streamFile;
    return this;
  }

  build() {
    return this.uploadFileInput;
  }
}
