import { PutObjectDataBuilder } from './putObjectDataBuilder';

export class PutObjectMotherObject {
  static valid() {
    return PutObjectDataBuilder.aPutObjectInput().build();
  }

  static withContentType() {
    return PutObjectDataBuilder.aPutObjectInput().withContentType().build();
  }

  static withBuffer() {
    return PutObjectDataBuilder.aPutObjectInput().withBuffer().build();
  }

  static withStream() {
    return PutObjectDataBuilder.aPutObjectInput().withStream().build();
  }
}
