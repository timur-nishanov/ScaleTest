/**
 * Short service descriptions in English (the panel shown on tap).
 * Service names are brand names and are the same in both languages.
 */
import type { ServiceId } from './types'
import { deepTypoEn } from '@/lib/typo'

export const SERVICES_SHORT_EN: Record<ServiceId, string> = deepTypoEn({
  pg: 'industry-standard relational DB (OLTP)',
  mysql: 'relational DB (OLTP)',
  ch: 'columnar analytical DB',
  valkey: 'in-memory cache',
  storedoc: 'document DB',
  kafka: 'event streaming bus',
  greenplum: 'MPP storage for DWH',
  opensearch: 'full-text search and logs',
  airflow: 'pipeline orchestration',
  spark: 'distributed computing',
  ytsaurus: 'managed big data platform',
  ydb: 'managed distributed transactional DB',
  datalens: 'Gen-BI and dashboards',
  trino: 'distributed SQL across sources',
  data_transfer: 'data migration and replication',
  sharded_pg: 'horizontally scalable PostgreSQL',
  websql: 'SQL console for managed databases',
  datalens_platform: 'all-in-one analytics platform',
  object_storage: 'object data storage',
  ytsaurus_onprem: 'big data platform on-premises',
  ydb_onprem: 'distributed DB on-premises',
  datalens_onprem: 'Gen-BI and dashboards on-premises',
})

export const TAG_CLOUD_HASHTAG_EN = '#DataPlatform'
