# Ассеты

Сюда заливаются материалы от заказчика/дизайнера. Код уже смотрит в эти папки — после заливки ничего перекладывать не нужно.

**Статус (25.08):** разложено из заливок заказчика — шрифты (ttf + сгенерированные woff2), иконки сервисов в двух наборах: `icons/<ключ>.svg` (монохром 64, теги) и `icons/tile/<ключ>.svg` (70 с подложкой #CAB8FF — палитра, слоты, чипы), UI-иконки `icons/ui/` (alarm, hand, plus, arrow — стрелка между слотами; chevron-* и dice-5 в `icons/`), фигуры заставки и иллюстрации карточек (`illustrations/`).
**Статус (27.08):** заказчик прислал полный набор иконок сервисов (19 tile-иконок 32×32 с подложкой #CAB8FF) и 19 kv-иллюстраций карточек. Разложено по ключам `src/data/services.ts`, дубликаты уже имевшихся файлов не заводились, исходники из корня репозитория удалены. Соответствия, где имя файла не совпадало с ключом: `Cloud Router` → `data_transfer`, `MPP` → `greenplum`, `PostgreSQL1` → `sharded_pg`, `data` → `data_proc`, `kv_postgre-sql` → `kv_pg`, `managed-kafka-kv` → `kv_kafka`, `managed-valkey-kv` → `kv_valkey`.

**Статус (28.08):** заказчик прислал иконки Object Storage (`Object Storage 1` → `tile/object_storage.svg` — 70 с подложкой, файл лида как есть, подложка у него голубая #94CFFF; `Object Storage 2` → `object_storage.svg` — монохром для тегов). Лид подтвердил: используем в таком виде, не перерисовываем.

**Чего ещё не хватает:**
- kv-иллюстрация Object Storage (`illustrations/kv_object_storage.svg`) — карточка «Lakehouse для аналитики и ML» пока показывает иллюстрацию DataLens (решение заказчика: без картинки карточка смотрелась дырой, Object Storage на превью не ставим).
- **DataLens Platform** — tile-версии не было, собрана из монохромной иконки (`icons/datalens_platform.svg` на стандартной подложке). Если есть исходная — заменим.

Не пригодились (в контенте лида таких задач нет, поэтому в репозиторий не клали): `MetaData Hub`, `kv_metadata-hub`, `kv_managed-mysql`, `kv_managed-spqr`, `kv_websql`, `data` и `kv_data-proc` (Data Processing).

## fonts/

Файлы шрифта бренда (woff2 приоритетно). После заливки прописать `@font-face` в `src/styles/tokens.css` (имя семейства уже зарезервировано: `--font-brand`).

## logo/

Логотип Yandex Cloud (svg). Используется на заставке (в макете — `YC-Logotype`, 671×95).

## icons/

Иконки сервисов, **svg, по одному файлу на сервис**, имена — ключи из `src/data/services.ts`:

```
pg.svg  mysql.svg  ch.svg  valkey.svg  storedoc.svg  kafka.svg  greenplum.svg
opensearch.svg  airflow.svg  spark.svg  ytsaurus.svg  ydb.svg  datalens.svg
trino.svg  data_transfer.svg  sharded_pg.svg  websql.svg  datalens_platform.svg
```

Два набора: `icons/<ключ>.svg` — монохром без подложки (теги заставки), `icons/tile/<ключ>.svg` — тот же глиф на подложке #CAB8FF (палитра, слоты, чипы). On-prem версии (YTsaurus/YDB/DataLens On-Premises) переиспользуют файлы managed-версий через поле `icon` — отдельных файлов не нужно.

Один и тот же файл используется в тегах заставки (64px), палитре (70px), слотах (84px), чипсах бандлов и попапах — заливать оригинал, масштаб задаёт код.

## illustrations/

Композиции из макетов (имена слоёв Figma → имена файлов):

- иллюстрации карточек задач (связка по ключевому сервису, ~330×220):
  `kv_kafka.svg`, `kv_airflow.svg`, `kv_valkey.svg`, `kv_datalens.svg`, `kv_ydb.svg`,
  `kv_ytsaurus.svg`, `kv_pg.svg`, `kv_spark.svg`, `kv_ch.svg`, `kv_storedoc.svg`
  (в Figma это `managed-kafka-kv`, `kv_managed-airflow` и т.п. — нормализуем к ключам сервисов);
- иллюстрации попапов результата (система иллюстраций YC, ~350×320):
  `popup-success.svg` (В точку / Отличный выбор), `popup-not-found.svg` (Почти / Почти угадал),
  `popup-access-denied.svg` (Мимо), `popup-unavailable.svg` (Время вышло);
- иконка баннеров монеты: `coin-circle.svg` (звезда в белом круге, 120×120);
- композиции карточек режимов «Собрать самому» / «Выбрать из готового» (`mode-build.svg`, `mode-ready.svg`);
- декоративные фигуры факт-блоков заставки (`fact-1.svg`, `fact-2.svg`, `fact-3.svg`).

Векторные слои можно выгрузить и напрямую из Figma (download_assets по node id из docs/DESIGN-NOTES.md) — если пришлёте только шрифты и логотип, остальное вытащим сами.
