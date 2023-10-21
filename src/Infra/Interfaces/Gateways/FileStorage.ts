import { Readable } from 'stream';

export interface IRetrieveFile {
  retrieveFile: (params: IRetrieveFile.Input) => Promise<IRetrieveFile.Input['type'] extends 'buffer' ? Buffer : ReadableStream>
}

export namespace IRetrieveFile {
  export type Input = {
    key: string
    bucketName: string
    type: 'buffer' | 'stream'
  }
}

export interface IUploadFile {
  uploadFile: (params: IUploadFile.Input) => Promise<string>
}

export namespace IUploadFile {
  export type Input = {
    key: string
    file: string | Buffer | Readable
    bucketName: string
    mimeType?: string
  }
}
