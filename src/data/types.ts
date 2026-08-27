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
  | 'trino'
  | 'data_transfer'
  | 'sharded_pg'
  | 'websql'
  | 'datalens_platform'
  | 'object_storage'
  // on-prem варианты — отдельные позиции контента (тексты лида YC),
  // иконки переиспользуют managed-версии (поле icon в Service)
  | 'ytsaurus_onprem'
  | 'ydb_onprem'
  | 'datalens_onprem'

export interface Service {
  id: ServiceId
  /** Имя на плитке палитры/чипах (финальные тексты лида — полные бренд-имена). */
  name: string
  /** Имя в теге на заставке. */
  tagName: string
  /** Короткое описание для панели подсказки (по тапу). */
  short: string
  /** Файл иконки без расширения, если отличается от id (on-prem → managed). */
  icon?: string
}

export interface BuildTask {
  id: string
  /** Тег задачи — капс-лейбл на карточке («Интернет-магазин»). */
  type: string
  /** Название карточки/задачи. */
  title: string
  /** Описание на карточке выбора. */
  cardDesc: string
  /** Текст блока «Задание» на экране сборки (подсказка-цепочка от лида). */
  assignment: string
  /** Эталонная связка по слотам (порядок = слоты слева направо). */
  correct: ServiceId[]
  /** Палитра сервисов ИМЕННО этой задачи (по контент-доку лида). */
  palette: ServiceId[]
  /** Сервис-иллюстрация карточки (файл assets/illustrations/kv_<id>.svg). */
  kv: ServiceId
}

export type BundleTier = 'best' | 'partial' | 'wrong'

export interface ReadyBundle {
  /** Машинный идентификатор варианта (для аналитики). */
  id: string
  /**
   * Состав из наших сервисов — чипы на карточке. Пустой массив — вариант
   * описывает стороннюю технологию (например, «форк PostgreSQL»), чипов нет.
   */
  services: ServiceId[]
  tier: BundleTier
  /** Описание варианта (текст на карточке бандла). */
  desc: string
}

export interface ReadyTask {
  id: string
  type: string
  title: string
  cardDesc: string
  assignment: string
  /** Варианты; порядок отображения перемешивается при каждом открытии задачи. */
  bundles: ReadyBundle[]
  /** Сервис-иллюстрация карточки (файл assets/illustrations/kv_<id>.svg). */
  kv: ServiceId
}

export type Outcome = 'correct' | 'partial' | 'wrong' | 'timeout'
export type GameMode = 'build' | 'ready'
