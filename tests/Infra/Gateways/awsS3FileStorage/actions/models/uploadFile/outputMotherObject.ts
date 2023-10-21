import { UploadFileModel } from './model';

export class UploadFileOutputMotherObject {
  static valid() {
    return new UploadFileModel().getObjectUrl();
  }

  static withRegion() {
    return new UploadFileModel().getObjectUrl(false);
  }
}
