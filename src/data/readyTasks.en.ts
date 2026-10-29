/**
 * “Choose from ready-made” tasks, English text by task id (default language).
 * Bundle descriptions are keyed by bundle id inside each task: the same
 * bundle id can have different text in different tasks.
 * previewDesc: short wheel-card texts (≤150 characters), written for the
 * English version so the cards don’t end with an ellipsis.
 */
import type { ReadyTask } from './types'
import { deepTypoEn } from '@/lib/typo'

export interface ReadyTaskText
  extends Pick<ReadyTask, 'type' | 'title' | 'cardDesc' | 'previewDesc' | 'assignment'> {
  bundles: Record<string, string>
}

const ASSIGNMENT = 'Choose the bundle that solves the task best.'

const PLATFORM =
  'An all-in-one platform brings data preparation, analytics tools and visualization together in one environment. The team works with metrics, dashboards and analytics scenarios through a single interface and a shared access model.'

export const READY_TASKS_EN: Record<string, ReadyTaskText> = deepTypoEn({
  logs_sec: {
    type: 'Security logs',
    title: 'Choose a solution to process and visualize security logs',
    cardDesc:
      'The security team receives hundreds of thousands of events per second: access logs, network events and sign-in attempts. The stream has to be ingested without losses, deviations tracked, individual events found fast and incidents investigated with dashboards.',
    previewDesc:
      'Hundreds of thousands of security events per second. Ingest them without losses, spot deviations, find events fast and investigate with dashboards.',
    assignment: ASSIGNMENT,
    bundles: {
      'kafka-opensearch':
        'Kafka® ingests and buffers the event stream. OpenSearch indexes incoming logs and provides search by text, attributes and time ranges. Built-in OpenSearch dashboards let you visualize the data without a separate BI tool.',
      'kafka-ch-datalens':
        'Kafka® ingests the event stream from servers and security systems. ClickHouse® stores logs in a columnar format and calculates aggregates over large volumes of data. DataLens shows event trends, deviations and metrics on dashboards.',
      'dt-pg-datalens':
        'Data Transfer delivers changes from connected sources to PostgreSQL. PostgreSQL stores the data and lets you combine it in SQL queries, and DataLens uses prepared selections to build dashboards and widgets.',
    },
  },
  mkt: {
    type: 'Marketing metrics',
    title: 'Choose a solution for real-time marketing dashboards',
    cardDesc:
      'Marketing needs to see user behavior and the effect of ad campaigns with almost no delay. The solution must ingest an event stream, calculate metrics and update dashboards without assembling separate systems by hand. Data size is up to 100 TB.',
    previewDesc:
      'Marketing needs user behavior and campaign results almost in real time: ingest events, calculate metrics, update dashboards. Up to 100 TB of data.',
    assignment: ASSIGNMENT,
    bundles: {
      'datalens-platform': PLATFORM,
      'kafka-ch-datalens':
        'Managed Service for Apache Kafka® ingests the stream of clicks, views and conversions. Managed Service for ClickHouse® stores the events and calculates marketing metrics. DataLens connects to the analytics layer and shows campaign results on interactive dashboards.',
      'ytsaurus-datalens-onprem':
        'The platform combines distributed storage and compute over large volumes of data. In one environment you can keep the history of user events, run batch calculations and prepare datasets for further analytics with DataLens On-premises.',
    },
  },
  corebank: {
    type: 'Core financial systems',
    title: 'Choose a solution to modernize a core banking and processing system',
    cardDesc:
      'A bank is replacing a foreign DBMS. The new system must store over 10 TB, process more than 100 documents per second and scale automatically, horizontally and without limits. Data can’t leave the perimeter, and the system must keep running if a data center fails.',
    previewDesc:
      'A bank is replacing a foreign DBMS: 10+ TB, 100+ documents per second, unlimited scaling, data inside the perimeter, no stop if a data center fails.',
    assignment: ASSIGNMENT,
    bundles: {
      'ydb-onprem':
        'A distributed SQL DBMS deployed in the bank’s infrastructure. Data is spread across nodes automatically, and transactions can span several shards. Storage and compute scale without limits as separate layers and need no changes to application software. With a cluster across three data centers, the system keeps running if one site goes down.',
      'pg-fork':
        'A PostgreSQL fork from the Russian software registry. This relational DBMS stays compatible with the PostgreSQL ecosystem and tools. It is deployed in the bank’s infrastructure, supports the familiar SQL model and can be extended with replication, partitioning and external load balancing tools.',
      'inmemory-db':
        'An in-memory DBMS with a log and snapshots. The main working set of data is kept in RAM. To restore state, it uses an operation log and periodic snapshots. The architecture is built for fast operations and minimal data access latency.',
    },
  },
  hybrid: {
    type: 'Hybrid search',
    title: 'Choose a solution for search by meaning and exact details',
    cardDesc:
      'An AI assistant answers questions from a corporate document corpus. Queries mix numbers, names and meaning-based phrasing. Search must respect access rights, region and document status, and results must not contradict business data. The solution must be deployable on-premises or in the cloud.',
    previewDesc:
      'An AI assistant searches company documents by numbers, names and meaning, respecting access rights. It must run on-premises or in the cloud.',
    assignment: ASSIGNMENT,
    bundles: {
      'ydb-onprem':
        'Business data, texts and vector embeddings are stored in one distributed database. Full-text and vector search can be combined in one SQL query and narrowed with filters by record attributes.',
      'opensearch-pg':
        'OpenSearch indexes document texts and vector embeddings and supports full-text and vector search, filtering and ranking. PostgreSQL stores business data, statuses and access rules, and the app keeps the search index in sync with the main database.',
      'mpp-engine':
        'An MPP warehouse spreads analytical queries across compute nodes and processes large volumes of structured data. It is used for aggregations, data marts and corporate reporting.',
    },
  },
  closed: {
    type: 'Closed perimeter',
    title: 'Choose a data platform for a bank in a closed perimeter',
    cardDesc:
      'Data can’t leave the perimeter. Five teams run reporting, risk and anti-fraud calculations at the same time over 10 PB of history. The teams’ workloads have to be isolated, and compute resources allocated by quotas.',
    previewDesc:
      'Data can’t leave the perimeter. Five teams run reporting, risk and anti-fraud jobs on 10 PB of history, with isolated workloads and quotas.',
    assignment: ASSIGNMENT,
    bundles: {
      'ytsaurus-onprem':
        'The platform is deployed on the bank’s infrastructure and combines distributed storage with several compute engines. Teams work with a shared data layer, and resources are split between workloads with pools, quotas and access policies.',
      'datalens-platform': `${PLATFORM} But it’s cloud-only for now.`,
      'ydb-onprem':
        'A distributed SQL DBMS deployed inside the bank’s perimeter. Data is spread across nodes automatically, transactions stay consistent, and compute and disk resources scale as the load grows.',
    },
  },
  ml_layer: {
    type: 'Analytics and ML',
    title: 'Bring a logistics company’s analytics and ML into one layer',
    cardDesc:
      'Business data marts and features for delivery forecast models live in different systems. Data is duplicated, the volume is measured in petabytes, and a forecast and a report for the same day can show different results. The solution can run on-premises or in the cloud.',
    previewDesc:
      'Business data marts and ML features live in different systems. Petabytes of data are duplicated, and a forecast and a report for one day disagree.',
    assignment: ASSIGNMENT,
    bundles: {
      'ytsaurus-datalens-onprem':
        'YTsaurus stores the shared history and runs distributed data preparation for analytics and ML. DataLens connects to the prepared tables and builds business dashboards on the same data layer. Runs inside the client’s perimeter.',
      'lakehouse-datalens':
        'Object Storage forms a shared storage layer. Apache Spark™ runs transformations and prepares data for ML, Trino provides SQL access, ClickHouse® serves analytical data marts, and DataLens visualizes the calculated metrics. Runs in the cloud.',
      'sharded-pg':
        'Sharded PostgreSQL distributes data across several independent nodes by a given key. Each shard stores and processes its part of the data, and a coordinator routes queries and merges the results.',
    },
  },
})
