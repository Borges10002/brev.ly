import 'reflect-metadata'
import { container } from 'tsyringe'
import { LinksRepository } from '@modules/links/infra/drizzle/LinksRepository.js'
import { R2ReportStorage } from '@modules/links/infra/storage/R2ReportStorage.js'
import type { IReportStorage } from '@modules/links/providers/IReportStorage.js'
import type { ILinksRepository } from '@modules/links/repositories/ILinksRepository.js'

container.registerSingleton<ILinksRepository>('LinksRepository', LinksRepository)
container.registerSingleton<IReportStorage>('ReportStorage', R2ReportStorage)
