import type { Service, ServiceId } from './types'
import { deepTypo } from '@/lib/typo'

/**
 * Сервисы Платформы данных. Имена и описания — финальный контент-док
 * продуктового лида YC (26.08, «Актуальные тексты интерфейса_FINAL»).
 *
 * on-prem позиции — отдельные сущности контента, но иконки переиспользуют
 * managed-версии (поле icon). storedoc/websql в новом контенте не участвуют,
 * оставлены для совместимости ассетов.
 */
export const SERVICES: Record<ServiceId, Service> = deepTypo({
  pg: {
    id: 'pg',
    name: 'Managed Service for PostgreSQL',
    tagName: 'Managed Service for PostgreSQL',
    short: 'индустриальный стандарт, реляционная БД (OLTP)',
  },
  mysql: {
    id: 'mysql',
    name: 'Managed Service for MySQL®',
    tagName: 'Managed Service for MySQL®',
    short: 'реляционная БД (OLTP)',
  },
  ch: {
    id: 'ch',
    name: 'Managed Service for ClickHouse®',
    tagName: 'Managed Service for ClickHouse®',
    short: 'колоночная аналитическая БД',
  },
  valkey: {
    id: 'valkey',
    name: 'Managed Service for Valkey™',
    tagName: 'Managed Service for Valkey™',
    short: 'in-memory кеш',
  },
  storedoc: {
    id: 'storedoc',
    name: 'Yandex StoreDoc',
    tagName: 'Yandex StoreDoc',
    short: 'документная БД',
  },
  kafka: {
    id: 'kafka',
    name: 'Managed Service for Apache Kafka®',
    tagName: 'Managed Service for Apache Kafka®',
    short: 'шина потоковых событий',
  },
  greenplum: {
    id: 'greenplum',
    name: 'Yandex MPP Analytics Engine for PostgreSQL',
    tagName: 'Yandex MPP Analytics Engine for PostgreSQL',
    short: 'MPP-хранилище для DWH',
  },
  opensearch: {
    id: 'opensearch',
    name: 'Managed Service for OpenSearch',
    tagName: 'Managed Service for OpenSearch',
    short: 'полнотекстовый поиск и логи',
  },
  airflow: {
    id: 'airflow',
    name: 'Yandex Managed Service for Apache Airflow®',
    tagName: 'Yandex Managed Service for Apache Airflow®',
    short: 'оркестрация пайплайнов',
  },
  spark: {
    id: 'spark',
    name: 'Managed Service for Apache Spark™',
    tagName: 'Managed Service for Apache Spark™',
    short: 'распределённые вычисления',
  },
  ytsaurus: {
    id: 'ytsaurus',
    name: 'Managed Service for YTsaurus',
    tagName: 'Managed Service for YTsaurus',
    short: 'управляемая платформа больших данных',
  },
  ydb: {
    id: 'ydb',
    name: 'Managed Service for YDB',
    tagName: 'Managed Service for YDB',
    short: 'управляемая распределённая транзакционная БД',
  },
  datalens: {
    id: 'datalens',
    name: 'Yandex DataLens',
    tagName: 'Yandex DataLens',
    short: 'Gen-BI и дашборды',
  },
  trino: {
    id: 'trino',
    name: 'Yandex Managed Service for Trino',
    tagName: 'Yandex Managed Service for Trino',
    short: 'распределённый SQL по разным источникам',
  },
  data_transfer: {
    id: 'data_transfer',
    name: 'Data Transfer',
    tagName: 'Data Transfer',
    short: 'перенос и репликация данных',
  },
  sharded_pg: {
    id: 'sharded_pg',
    name: 'Managed Service for Sharded PostgreSQL',
    tagName: 'Managed Service for Sharded PostgreSQL',
    short: 'горизонтально масштабируемый PostgreSQL',
  },
  websql: {
    id: 'websql',
    name: 'WebSQL',
    tagName: 'WebSQL',
    short: 'SQL-консоль для управляемых баз',
  },
  datalens_platform: {
    id: 'datalens_platform',
    name: 'Yandex DataLens Platform',
    tagName: 'Yandex DataLens Platform',
    short: 'комплексная платформа для аналитики',
  },
  object_storage: {
    id: 'object_storage',
    name: 'Object Storage',
    tagName: 'Object Storage',
    short: 'объектное хранение данных',
    // TODO(ассеты): иконку Object Storage заказчик ещё не прислал —
    // временно показываем глиф Data Processing, чтобы плитка не была пустой
    icon: 'data_proc',
  },
  ytsaurus_onprem: {
    id: 'ytsaurus_onprem',
    name: 'YTsaurus On-Premises',
    tagName: 'YTsaurus On-Premises',
    short: 'платформа больших данных в своём контуре',
    icon: 'ytsaurus',
  },
  ydb_onprem: {
    id: 'ydb_onprem',
    name: 'YDB On-Premises',
    tagName: 'YDB On-Premises',
    short: 'распределённая БД в своём контуре',
    icon: 'ydb',
  },
  datalens_onprem: {
    id: 'datalens_onprem',
    name: 'Yandex DataLens On-Premises',
    tagName: 'Yandex DataLens On-Premises',
    short: 'Gen-BI и дашборды в своём контуре',
    icon: 'datalens',
  },
} satisfies Record<ServiceId, Service>)

/** Все ключи сервисов (для предзагрузки и аналитики). */
export const ALL_SERVICE_IDS = Object.keys(SERVICES) as ServiceId[]

/**
 * Видимые теги на заставке — список и порядок из контент-дока лида (16 шт).
 */
export const TAG_CLOUD_ORDER: ServiceId[] = [
  'pg',
  'mysql',
  'ch',
  'valkey',
  'kafka',
  'greenplum',
  'opensearch',
  'spark',
  'trino',
  'datalens',
  'datalens_platform',
  'data_transfer',
  'object_storage',
  'ytsaurus',
  'ytsaurus_onprem',
  'ydb_onprem',
]

export const TAG_CLOUD_HASHTAG = '#Платформа данных'
