/** Ключ сервиса — единый идентификатор для палитры, аналитики и имён файлов ассетов. */
export type ServiceId =
  | 'pg'
  | 'mysql'
  | 'ch'
  | 'valkey'
  | 'storedoc'
  | 'kafka'
  | 'greenplum'
  | 'opensearch'
  | 'airflow'
  | 'spark'
  | 'ytsaurus'
  | 'ydb'
  | 'datalens'
  // сервисы только для облака тегов на заставке (в палитре сборки их нет):
  | 'trino'
  | 'data_transfer'
  | 'sharded_pg'
  | 'websql'
  | 'datalens_platform'

export interface Service {
  id: ServiceId
  /** Короткое имя на плитке палитры (как в макете, например «Managed Greenplum»). */
  name: string
  /** Полное имя в теге на заставке (например «Yandex MPP Analytics Engine for PostgreSQL»). */
  tagName: string
  /** Короткое описание для панели подсказки (по тапу). */
  short: string
  /** Участвует ли в палитре режима сборки (13 сервисов в макете). */
  inPalette: boolean
}

export interface BuildTask {
  id: string
  /** Тип задачи — капс-лейбл на карточке («Логи / наблюдаемость»). */
  type: string
  /** Название карточки/задачи. */
  title: string
  /** Описание на карточке выбора. */
  cardDesc: string
  /** Текст блока «Задание» на экране сборки. */
  assignment: string
  /** Эталонная связка по слотам (порядок = слоты слева направо). */
  correct: ServiceId[]
  /** Сервис-иллюстрация карточки (файл assets/illustrations/kv_<id>.svg). */
  kv: ServiceId
}

export type BundleTier = 'best' | 'partial' | 'wrong'

export interface ReadyBundle {
  /** Название бандла («Бандл A» / «LakeHouse» / «DataLens Platform» …). */
  name: string
  services: ServiceId[]
  tier: BundleTier
  /** Описание, почему стек собран так (текст на карточке бандла). */
  desc: string
}

export interface ReadyTask {
  id: string
  type: string
  title: string
  cardDesc: string
  assignment: string
  bundles: ReadyBundle[]
  /** Сервис-иллюстрация карточки (файл assets/illustrations/kv_<id>.svg). */
  kv: ServiceId
}

export type Outcome = 'correct' | 'partial' | 'wrong' | 'timeout'
export type GameMode = 'build' | 'ready'
