export interface IUploadReportDTO {
  key: string
  contentType: string
  body: Uint8Array
}

export interface IReportStorage {
  upload(data: IUploadReportDTO): Promise<{ url: string }>
}

