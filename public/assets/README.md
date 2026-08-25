# Ассеты

Сюда заливаются материалы от заказчика/дизайнера. Код уже смотрит в эти папки — после заливки ничего перекладывать не нужно.

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

Иллюстрации 640×640 из брендбука и композиции для:

- карточек задач (по `id` задачи: `task-logs.svg`, `task-etl.svg`, …),
- карточек режимов на экране «Как будем собирать бандл?» (`mode-build.svg`, `mode-ready.svg`),
- попапов результата (`result-correct.svg`, `result-wrong.svg`, `result-timeout.svg`, `result-coin.svg`),
- декоративных фигур заставки.

Имена согласуем при заливке — код подключит их точечно на этапе вёрстки.
