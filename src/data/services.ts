import type { Service, ServiceId } from './types'
import { deepTypo } from '@/lib/typo'

/**
 * Сервисы платформы данных.
 *
 * Имена (name/tagName) взяты из макетов Figma:
 * - палитра экрана сборки: фрейм 2334:4377 «Собрать самому. Задача. Дефолт» — 13 плиток;
 * - облако тегов заставки: фрейм 2334:3600 «tags» — 18 тегов + «#Платформа данных».
 * Короткие описания (short) — из согласованного прототипа; заменить финальными
 * текстами Yandex Cloud, когда придут. TODO(design-sync)
 */
export const SERVICES: Record<ServiceId, Service> = deepTypo({
  pg: {
    id: 'pg',
    name: 'Managed PostgreSQL',
    tagName: 'Managed Service for PostgreSQL',
    short: 'реляционная БД (OLTP)',
    inPalette: true,
  },
  mysql: {
    id: 'mysql',
    name: 'Managed MySQL',
    tagName: 'Managed Service for MySQL®',
    short: 'реляционная БД (OLTP)',
    inPalette: true,
  },
  ch: {
    id: 'ch',
    name: 'Managed ClickHouse',
    tagName: 'Managed Service for ClickHouse®',
    short: 'колоночная аналитическая БД',
    inPalette: true,
  },
  valkey: {
    id: 'valkey',
    name: 'Managed Valkey',
    tagName: 'Managed Service for Valkey™',
    short: 'in-memory кэш',
    inPalette: true,
  },
  storedoc: {
    id: 'storedoc',
    name: 'Yandex StoreDoc',
    tagName: 'Yandex StoreDoc',
    short: 'документная БД',
    inPalette: true,
  },
  kafka: {
    id: 'kafka',
    name: 'Managed Kafka',
    tagName: 'Managed Service for Apache Kafka®',
    short: 'шина потоковых событий',
    inPalette: true,
  },
  greenplum: {
    id: 'greenplum',
    name: 'Managed Greenplum',
    tagName: 'Yandex MPP Analytics Engine for PostgreSQL',
    short: 'MPP-хранилище (DWH)',
    inPalette: true,
  },
  opensearch: {
    id: 'opensearch',
    name: 'Managed OpenSearch',
    tagName: 'Managed Service for OpenSearch',
    short: 'полнотекстовый поиск и логи',
    inPalette: true,
  },
  airflow: {
    id: 'airflow',
    name: 'Managed Airflow',
    tagName: 'Yandex Managed Service for Apache Airflow®',
    short: 'оркестрация пайплайнов',
    inPalette: true,
  },
  spark: {
    id: 'spark',
    name: 'Managed Spark',
    tagName: 'Managed Service for Apache Spark™',
    short: 'распределённые вычисления',
    inPalette: true,
  },
  ytsaurus: {
    id: 'ytsaurus',
    name: 'YTsaurus',
    tagName: 'Managed Service for YTsaurus',
    short: 'хранилище больших данных',
    inPalette: true,
  },
  ydb: {
    id: 'ydb',
    name: 'YDB',
    tagName: 'Managed Service for YDB',
    short: 'распределённая транзакционная БД',
    inPalette: true,
  },
  datalens: {
    id: 'datalens',
    name: 'DataLens',
    tagName: 'DataLens',
    short: 'BI и дашборды',
    inPalette: true,
  },
  // ---- только облако тегов на заставке ----
  trino: {
    id: 'trino',
    name: 'Managed Trino',
    tagName: 'Yandex Managed Service for Trino',
    short: 'распределённый SQL-движок',
    inPalette: false,
  },
  data_transfer: {
    id: 'data_transfer',
    name: 'Data Transfer',
    tagName: 'Data Transfer',
    short: 'миграция и репликация данных',
    inPalette: false,
  },
  sharded_pg: {
    id: 'sharded_pg',
    name: 'Managed Sharded PostgreSQL',
    tagName: 'Managed Service for Sharded PostgreSQL',
    short: 'шардированный PostgreSQL',
    inPalette: false,
  },
  websql: {
    id: 'websql',
    name: 'Yandex WebSQL',
    tagName: 'Yandex WebSQL',
    short: 'SQL-запросы из браузера',
    inPalette: false,
  },
  datalens_platform: {
    id: 'datalens_platform',
    name: 'DataLens Platform',
    tagName: 'DataLens Platform',
    short: 'BI-платформа',
    inPalette: false,
  },
})

/** Палитра экрана сборки — 13 сервисов в порядке макета (фрейм 2334:4377). */
export const PALETTE_ORDER: ServiceId[] = [
  'pg',
  'mysql',
  'ch',
  'valkey',
  'storedoc',
  'kafka',
  'greenplum',
  'opensearch',
  'airflow',
  'spark',
  'ytsaurus',
  'ydb',
  'datalens',
]

/** Облако тегов заставки — порядок макета (фрейм 2334:3600), первым идёт «#Платформа данных». */
export const TAG_CLOUD_ORDER: ServiceId[] = [
  'pg',
  'ch',
  'trino',
  'mysql',
  'valkey',
  'spark',
  'storedoc',
  'opensearch',
  'kafka',
  'data_transfer',
  'greenplum',
  'airflow',
  'ydb',
  'sharded_pg',
  'ytsaurus',
  'websql',
  'datalens',
  'datalens_platform',
]

export const TAG_CLOUD_HASHTAG = '#Платформа данных'
