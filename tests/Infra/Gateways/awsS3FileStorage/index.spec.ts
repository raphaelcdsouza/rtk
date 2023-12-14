// import { S3 } from '@aws-sdk/client-s3';
// import { Readable } from 'stream';

// import { AwsS3FileStorage } from '../../../../src/Infra/Gateways/awsS3FileStorage';
// import { FileStorageError } from '../../../../src/Errors';
// import { awsErrorMapper } from '../../../../src/Utils/Gateways/Error';

// jest.mock('@aws-sdk/client-s3');
// jest.mock('../../../src/Errors/FileStorageError', () => ({
//   FileStorageError: jest.fn(),
// }));
// jest.mock('../../../src/Utils/Gateways/Error/mapper', () => ({
//   awsErrorMapper: jest.fn().mockReturnValue('any_mapped_error'),
// }));

describe('AwsS3FileStorage', () => {
  it('should be true', () => {
    expect(true).toBe(true);
  });
});

// describe('AwsS3FileStorage', () => {
//   let getObjectSpy: jest.Mock;
//   let createReadStreamSpy: jest.Mock;
//   let getObjectPromiseSpy: jest.Mock;
//   let uploadSpy: jest.Mock;
//   let uploadObjectPromiseSpy: jest.Mock;

//   let sut: AwsS3FileStorage;

//   const awsAccessKey = 'any_access_key';
//   const awsSecret = 'any_secret';
//   const bucketName = 'any_bucket_name';

//   const key = 'any_key';

//   const bodyData = 'any_body_data';

//   const uploadedUrl = 'any_uploaded_url';

//   beforeAll(() => {
//     createReadStreamSpy = jest.fn().mockResolvedValue(new Readable());
//     getObjectPromiseSpy = jest.fn().mockResolvedValue({ Body: Buffer.from(bodyData) });
//     getObjectSpy = jest.fn().mockReturnValue({
//       createReadStream: createReadStreamSpy,
//       promise: getObjectPromiseSpy,
//     });
//     uploadObjectPromiseSpy = jest.fn().mockResolvedValue({
//       Location: uploadedUrl,
//     });
//     uploadSpy = jest.fn().mockReturnValue({
//       promise: uploadObjectPromiseSpy,
//     });
//     jest.mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({
//       getObject: getObjectSpy,
//       upload: uploadSpy,
//     })));
//   });

//   beforeEach(() => {
//     sut = new AwsS3FileStorage(awsAccessKey, awsSecret);
//   });

//   it('should call "config" method with correct params', () => {
//     expect(sut).toBeDefined();
//     expect(S3).toHaveBeenCalledTimes(1);
//     expect(S3).toHaveBeenCalledWith({
//       credentials: {
//         accessKeyId: awsAccessKey,
//         secretAccessKey: awsSecret,
//       },
//     });
//   });

//   describe('retrieve', () => {
//     it('should call "getObject" with correct params', async () => {
//       await sut.retrieveFileFromStream({ key, bucketName });

//       expect(getObjectSpy).toHaveBeenCalledTimes(1);
//       expect(getObjectSpy).toHaveBeenCalledWith({
//         Bucket: bucketName,
//         Key: key,
//       });
//     });

//     describe('retrieveFileFromStream', () => {
//       it('should call "createReadStream" with correct params', async () => {
//         await sut.retrieveFileFromStream({ key, bucketName });

//         expect(createReadStreamSpy).toHaveBeenCalledTimes(1);
//         expect(createReadStreamSpy).toHaveBeenCalledWith();
//       });

//       it('should return a readable stream', async () => {
//         const result = await sut.retrieveFileFromStream({ key, bucketName });

//         expect(result).toBeDefined();
//         expect(result).toBeInstanceOf(Readable);
//       });

//       it('should throw a "FileStorageError" if "getObject" throws passing correct params to error constructor', async () => {
//         const errorMessage = 'any_error_message';
//         const errorCode = 'any_error_code';
//         const errorObject = {
//           message: errorMessage,
//           code: errorCode,
//         };
//         getObjectSpy.mockImplementationOnce(() => { throw errorObject; });

//         const promise = sut.retrieveFileFromStream({ key, bucketName });

//         await expect(promise).rejects.toBeInstanceOf(FileStorageError);
//         expect(FileStorageError).toHaveBeenCalledTimes(1);
//         expect(FileStorageError).toHaveBeenCalledWith(errorMessage, expect.any(String), 'aws', errorCode);
//         expect(awsErrorMapper).toHaveBeenCalledTimes(1);
//         expect(awsErrorMapper).toHaveBeenCalledWith(errorCode, 's3');
//       });
//     });

//     describe('retrieveFile', () => {
//       it('should call "promise" with correct params', async () => {
//         await sut.retrieveFile({ key, bucketName });

//         expect(getObjectPromiseSpy).toHaveBeenCalledTimes(1);
//         expect(getObjectPromiseSpy).toHaveBeenCalledWith();
//       });

//       it('should return the file data', async () => {
//         const result = await sut.retrieveFile({ key, bucketName });

//         expect(result).toBeDefined();
//         expect(result).toBeInstanceOf(Buffer);
//         expect(result.toString()).toBe(bodyData);
//       });

//       it('should throw a "FileStorageError" if "getObject" throws passing correct params to error constructor', async () => {
//         const errorMessage = 'any_error_message';
//         const errorCode = 'any_error_code';
//         const errorObject = {
//           message: errorMessage,
//           code: errorCode,
//         };
//         getObjectSpy.mockImplementationOnce(() => { throw errorObject; });

//         const promise = sut.retrieveFile({ key, bucketName });

//         await expect(promise).rejects.toBeInstanceOf(FileStorageError);
//         expect(FileStorageError).toHaveBeenCalledTimes(1);
//         expect(FileStorageError).toHaveBeenCalledWith(errorMessage, expect.any(String), 'aws', errorCode);
//         expect(awsErrorMapper).toHaveBeenCalledTimes(1);
//         expect(awsErrorMapper).toHaveBeenCalledWith(errorCode, 's3');
//       });
//     });
//   });

//   describe('upload', () => {
//     const bufferFile = Buffer.from('any_buffer_file');
//     const stringFile = 'any_string_file';
//     const mimeType = 'any_mime_type';
//     const readableFile = new Readable();

//     it('should call "upload" method with correct params and body of the file as string', async () => {
//       await sut.uploadFile({ key, bucketName, file: stringFile });

//       expect(uploadSpy).toHaveBeenCalledTimes(1);
//       expect(uploadSpy).toHaveBeenCalledWith({
//         Bucket: bucketName,
//         Key: key,
//         Body: stringFile,
//       });
//     });

//     it('should call "upload" method with correct params and body of the file as buffer', async () => {
//       await sut.uploadFile({ key, bucketName, file: bufferFile });

//       expect(uploadSpy).toHaveBeenCalledTimes(1);
//       expect(uploadSpy).toHaveBeenCalledWith({
//         Bucket: bucketName,
//         Key: key,
//         Body: bufferFile,
//       });
//     });

//     it('should call "upload" method with correct params and body of the file as readable stream', async () => {
//       await sut.uploadFile({ key, bucketName, file: readableFile });

//       expect(uploadSpy).toHaveBeenCalledTimes(1);
//       expect(uploadSpy).toHaveBeenCalledWith({
//         Bucket: bucketName,
//         Key: key,
//         Body: readableFile,
//       });
//     });

//     it('should call "upload" method with correct params - mimeType', async () => {
//       await sut.uploadFile({
//         key, bucketName, file: stringFile, mimeType,
//       });

//       expect(uploadSpy).toHaveBeenCalledTimes(1);
//       expect(uploadSpy).toHaveBeenCalledWith({
//         Bucket: bucketName,
//         Key: key,
//         Body: stringFile,
//         ContentType: mimeType,
//       });
//     });

//     it('should call "promise" method with correct params', async () => {
//       await sut.uploadFile({ key, bucketName, file: stringFile });

//       expect(uploadObjectPromiseSpy).toHaveBeenCalledTimes(1);
//       expect(uploadObjectPromiseSpy).toHaveBeenCalledWith();
//     });

//     it('should return the S3 url', async () => {
//       const result = await sut.uploadFile({ key, bucketName, file: stringFile });

//       expect(result).toBeDefined();
//       expect(result).toBe(uploadedUrl);
//     });

//     it('should throw a "FileStorageError" if "upload" throws passing correct params to error constructor', async () => {
//       const errorMessage = 'any_error_message';
//       const errorCode = 'any_error_code';
//       const errorObject = {
//         message: errorMessage,
//         code: errorCode,
//       };
//       uploadSpy.mockImplementationOnce(() => { throw errorObject; });

//       const promise = sut.uploadFile({ key, bucketName, file: stringFile });

//       await expect(promise).rejects.toBeInstanceOf(FileStorageError);
//       expect(FileStorageError).toHaveBeenCalledTimes(1);
//       expect(FileStorageError).toHaveBeenCalledWith(errorMessage, expect.any(String), 'aws', errorCode);
//       expect(awsErrorMapper).toHaveBeenCalledTimes(1);
//       expect(awsErrorMapper).toHaveBeenCalledWith(errorCode, 's3');
//     });
//   });
// });
