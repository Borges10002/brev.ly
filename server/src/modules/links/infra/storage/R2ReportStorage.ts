import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { injectable } from 'tsyringe'
import { env } from '@config/env.js'
import type {
  IReportStorage,
  IUploadReportDTO,
} from '@modules/links/providers/IReportStorage.js'

@injectable()
export class R2ReportStorage implements IReportStorage {
  private readonly client = new S3Client({
    region: 'auto',
    endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
      secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
    },
  })

  async upload(data: IUploadReportDTO) {
    await this.client.send(new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET,
      Key: data.key,
      Body: data.body,
      ContentType: data.contentType,
    }))

    return { url: `${env.CLOUDFLARE_PUBLIC_URL}/${data.key}` }
  }
}
