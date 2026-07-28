import { randomUUID } from 'node:crypto'
import { inject, injectable } from 'tsyringe'
import type { IReportStorage } from '@modules/links/providers/IReportStorage.js'
import type { ILinksRepository } from '@modules/links/repositories/ILinksRepository.js'

const escapeCsv = (value: string | number) =>
  `"${String(value).replaceAll('"', '""')}"`

@injectable()
export class ExportLinksUseCase {
  constructor(
    @inject('LinksRepository')
    private readonly linksRepository: ILinksRepository,
    @inject('ReportStorage')
    private readonly reportStorage: IReportStorage,
  ) {}

  async execute() {
    const links = await this.linksRepository.list()
    const rows = [
      ['URL original', 'URL encurtada', 'Contagem de acessos', 'Data de criação'],
      ...links.map((link) => [
        link.originalUrl,
        link.shortUrl,
        link.accessCount,
        link.createdAt.toISOString(),
      ]),
    ]
    const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n')

    return this.reportStorage.upload({
      key: `exports/${randomUUID()}.csv`,
      contentType: 'text/csv; charset=utf-8',
      body: new TextEncoder().encode(`\uFEFF${csv}`),
    })
  }
}
