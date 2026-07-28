import type {
  IReportStorage,
  IUploadReportDTO,
} from '@modules/links/providers/IReportStorage.js'

export class InMemoryReportStorage implements IReportStorage {
  uploads: IUploadReportDTO[] = []

  async upload(data: IUploadReportDTO) {
    this.uploads.push(data)
    return { url: `https://cdn.brev.ly/${data.key}` }
  }
}

