import { UploadFileInputDataBuilder } from './inputDataBuilder';

export class UploadFileInputMotherObject {
  static valid() {
    return UploadFileInputDataBuilder.aUploadFileInput().build();
  }

  static withMIMEType() {
    return UploadFileInputDataBuilder.aUploadFileInput().withMIMEType().build();
  }

  static withBuffer() {
    return UploadFileInputDataBuilder.aUploadFileInput().withBuffer().build();
  }

  static withStream() {
    return UploadFileInputDataBuilder.aUploadFileInput().withStream().build();
  }
}
