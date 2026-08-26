# Ассеты

Сюда заливаются материалы от заказчика/дизайнера. Код уже смотрит в эти папки — после заливки ничего перекладывать не нужно.

**Статус (25.08):** разложено из заливок заказчика — шрифты (ttf + сгенерированные woff2), иконки сервисов в двух наборах: `icons/<ключ>.svg` (монохром 64, теги) и `icons/tile/<ключ>.svg` (70 с подложкой #CAB8FF — палитра, слоты, чипы), UI-иконки `icons/ui/` (alarm, hand, plus, arrow — стрелка между слотами; chevron-* и dice-5 в `icons/`), фигуры заставки и иллюстрации карточек (`illustrations/`).
**Не хватает:** иллюстрация попапа «Почти» / «Почти угадал» (`popup-not-found.svg`, в макете ~396×320 — папка с восклицательным знаком). Остальные попапы (26.08: success/failure/timeout → `popup-success/-access-denied/-unavailable`) и монета `coin-circle` разложены; логотип, kv-иллюстрации, композиции режимов, шевроны, кубик — на месте.

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
