/**
 * “Build it yourself” tasks, English text by task id (default language).
 * Only text fields: answers, palettes and illustrations stay in buildTasks.ts.
 * Translated from the product lead’s final content doc (Final, 10.09).
 */
import type { BuildTask } from './types'
import { deepTypoEn } from '@/lib/typo'

export type BuildTaskText = Pick<
  BuildTask,
  'type' | 'title' | 'cardDesc' | 'previewDesc' | 'assignment'
>

const REMEMBER =
  'Remember: any work with data starts with moving it from the core systems into Yandex Cloud.'

export const BUILD_TASKS_EN: Record<string, BuildTaskText> = deepTypoEn({
  shop: {
    type: 'E-commerce',
    title: 'Fast online store',
    cardDesc:
      'The store keeps products, prices, stock, users and orders. The entities are closely linked, and checkout has to be transactional. Popular product pages and user sessions are read far more often than they change. At peak load the store slows down. How can you fix it?',
    previewDesc:
      'The store keeps products, stock, users and orders. Checkout must be transactional, and frequently read data must stay fast under peak load.',
    assignment: 'Build the architecture: in-memory cache → relational database.',
  },
  map: {
    type: 'Heat map and analytics',
    title: 'Store coverage map',
    cardDesc: `A retailer wants to visualize data on its stores, delivery zones and blank spots. The data includes store locations and delivery zone borders. It has to be combined with demographics and logistics data, with filters by region, heat maps and point clusters. The data already sits in several DBMSs inside the retailer’s perimeter, and analytics must not affect the source database. The source data is under 1 TB. ${REMEMBER}`,
    previewDesc:
      'A retailer needs to move up to 1 TB from different DBMSs, combine locations, demographics and logistics, and show a map without loading the sources.',
    assignment: 'Build the architecture: source → data delivery → relational database → Gen-BI.',
  },
  oee: {
    type: 'Business efficiency',
    title: 'Production efficiency monitoring',
    cardDesc:
      'Two hundred machines constantly stream temperature, vibration and RPM. The plant needs to calculate availability, performance and quality, spot deviations fast and catch early signs of downtime. The scenario doesn’t assume any third-party or specialized equipment monitoring services.',
    previewDesc:
      '200 machines stream temperature, vibration and RPM. Efficiency must be calculated and downtime risks spotted without dedicated monitoring tools.',
    assignment: 'Build the architecture: event stream → analytical DB → Gen-BI and dashboards.',
  },
  forecast: {
    type: 'Forecasting and optimization',
    title: 'Demand and inventory forecast',
    cardDesc: `A retail chain wants to estimate future demand based on seasonality, weather and promotions. Analytics should help adjust orders and flag the risk of shortages, overstock and cash gaps early. The operational data already sits in MS SQL, and analytics must not affect the source database. ${REMEMBER}`,
    previewDesc:
      'A retail chain forecasts demand by season, weather and promos to avoid shortages and overstock. MS SQL data must be analyzed without loading the source.',
    assignment: 'Build the architecture: data delivery → historical analytics and demand estimates.',
  },
  profile: {
    type: 'Customer analytics',
    title: 'Unified 360° customer profile',
    cardDesc: `A bank wants to bring together transactions, support requests, in-app views and credit history. Based on a single profile, it needs to segment customers, calculate LTV and prepare personalized offers. The data already sits in several Oracle clusters, and the analytics layer must not affect customer transactions. ${REMEMBER}`,
    previewDesc:
      'A bank merges data from Oracle clusters into a 360° profile to calculate LTV, segment customers and prepare offers without affecting transactions.',
    assignment: 'Build the architecture: data collection → single profile + analytics.',
  },
  bank: {
    type: 'Modernization',
    title: 'Modernizing a bank’s payment system',
    cardDesc:
      'By 2030 the bank has to modernize its existing infrastructure without losing performance or fault tolerance. When choosing a DBMS for its banking system, the bank needs on-premises deployment and the ability to scale without limits on stored data or throughput.',
    previewDesc:
      'A bank is modernizing its payment system by 2030. The new DBMS must run on-premises, survive failures and scale without limits.',
    assignment: 'Pick the service: a distributed OLTP database on-premises.',
  },
  cash: {
    type: 'Streaming data',
    title: 'Unified store of checkout events',
    cardDesc:
      'Checkouts in 900 stores send receipts to the corporate Kafka®, which other systems already use. The stream has to be stored reliably in a shared data platform, so analysts can calculate revenue for any period. For guaranteed delivery of messages from the corporate Kafka®, we recommend using a data transfer.',
    previewDesc:
      'Checkouts in 900 stores send receipts to the corporate Kafka®. Events must be reliably delivered to a shared warehouse to calculate revenue for any period.',
    assignment: 'Build the architecture: event delivery → unified big data store.',
  },
  fin: {
    type: 'Financial monitoring',
    title: 'Financial metrics at a glance',
    cardDesc: `The CFO needs regularly updated dashboards on revenue, cost of sales and EBITDA. The data comes from ERP, banking systems and CRM. After loading, the metrics must be calculated by a single agreed model, down to individual transactions. ${REMEMBER}`,
    previewDesc:
      'The CFO needs regularly updated dashboards on revenue, costs and EBITDA. Data from ERP, banks and CRM has to be merged into a single model.',
    assignment: 'Build the architecture: delivery → end-to-end analytics.',
  },
  ml: {
    type: 'ML and analytics',
    title: 'Training ML models on historical data',
    cardDesc:
      'The company has accumulated petabytes of operational data. It needs to train its own ML models on this history and build analytical reports, while keeping storage and compute costs reasonable.',
    previewDesc:
      'The company has accumulated petabytes of data. It needs to train its own ML models and build reports at a reasonable cost of storage and compute.',
    assignment: 'Pick the service: distributed storage and compute for analytics and ML at petabyte scale.',
  },
  dwh: {
    type: 'Corporate data warehouse',
    title: 'Unified DWH for management reporting',
    cardDesc: `Sales, finance and supply data lives in ERP, CRM systems and operational databases. Because of different calculation rules, departments get different numbers. The data has to be brought to one agreed model and published as verified data marts. Reports must build fast. ${REMEMBER}`,
    previewDesc:
      'ERP, CRM and operational databases calculate data by different rules. It all has to be merged into a single DWH with verified data marts and fast reports.',
    assignment: 'Build the architecture: data loading → DWH core → fast data marts → Gen-BI.',
  },
  lakehouse: {
    type: 'Data centralization',
    title: 'Lakehouse for analytics and ML',
    cardDesc:
      'The company stores logs, transactions, images and supplier data. The volume grows fast, and future tasks are unknown. Data engineers need to process raw data, the ML team needs to prepare features, and the business needs fast data marts.',
    previewDesc:
      'The company stores growing volumes of logs, transactions, images and supplier data. It needs a shared environment for processing, ML features and fast data marts.',
    assignment: 'Build the architecture: object storage → processing → fast data marts → Gen-BI.',
  },
  refbook: {
    type: 'Scalable reference data',
    title: 'A directory of billions of records',
    cardDesc:
      'The service stores billions of small records about products, sellers and access rights in Oracle Exadata. The app needs point reads and range queries, and analysts need reports on the same data. Keep in mind that the data stays in the source database, while queries and reports can run in Yandex Cloud services.',
    previewDesc:
      'Billions of records stay in Oracle Exadata. The app needs point and range queries, and analysts need reports built with Yandex Cloud services.',
    assignment: 'Build the architecture: federated SQL access to the source database → Gen-BI.',
  },
})
