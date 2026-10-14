---
layout: ../../layouts/DocsLayout.astro
title: Monitoreo
description: Métricas de Prometheus, logs y alertas recomendadas.
---

# Monitoreo

## Métricas

Con `CHUSPA_METRICS_ADDR=127.0.0.1:9100`, el motor publica en `/metrics`, en el formato de Prometheus, en un puerto aparte de la API. Las métricas no llevan keys, nombres de chuspa ni secretos.

| Métrica | Tipo | Qué mide |
|---|---|---|
| `chuspa_requests_total{method,code}` | counter | Peticiones por método y código HTTP. |
| `chuspa_request_duration_seconds{method}` | histogram | Latencia. |
| `chuspa_received_bytes_total`, `chuspa_sent_bytes_total` | counter | Volumen. |
| `chuspa_disk_free_bytes` | gauge | Espacio libre en el disco de los datos. |
| `chuspa_scrub_damaged_objects` | gauge | Objetos dañados en la última verificación. |
| `chuspa_last_scrub_timestamp_seconds` | gauge | Última verificación completa (0: ninguna desde el arranque). |
| `chuspa_last_backup_timestamp_seconds` | gauge | Última copia del índice (0: ninguna desde el arranque). |
| `chuspa_maintenance_errors_total` | counter | Fallos del mantenimiento, de la copia o de la verificación. |
| `chuspa_auth_blocks_total` | counter | IPs bloqueadas por fuerza bruta. |
| `chuspa_build_info{version}` | gauge | Versión desplegada. |

En Docker, publicá el puerto de métricas solo hacia tu Prometheus:

```yaml
    environment:
      CHUSPA_METRICS_ADDR: ":9100"
    ports:
      - "127.0.0.1:9100:9100"
```

## Alertas recomendadas

```yaml
groups:
  - name: openchuspa
    rules:
      - alert: ChuspaDatosDanados
        expr: chuspa_scrub_damaged_objects > 0
        labels: { severity: critical }
        annotations:
          summary: "La verificación encontró objetos dañados: revisar el log y restaurar desde el respaldo"
      - alert: ChuspaDiscoCasiLleno
        expr: chuspa_disk_free_bytes < 5 * 1024 * 1024 * 1024
        for: 15m
        labels: { severity: warning }
      - alert: ChuspaErroresInternos
        expr: sum(rate(chuspa_requests_total{code=~"5.."}[5m])) / sum(rate(chuspa_requests_total[5m])) > 0.01
        for: 10m
        labels: { severity: warning }
      - alert: ChuspaMantenimientoFallando
        expr: increase(chuspa_maintenance_errors_total[1h]) > 0
        labels: { severity: warning }
      - alert: ChuspaSinCopiaDelIndice
        expr: chuspa_last_backup_timestamp_seconds > 0 and time() - chuspa_last_backup_timestamp_seconds > 2 * 86400
        labels: { severity: warning }
      - alert: ChuspaFuerzaBruta
        expr: increase(chuspa_auth_blocks_total[15m]) > 0
        labels: { severity: info }
```

## Salud

`GET /-/health` responde `200 ok` sin autenticación. La imagen de Docker lo usa en su `HEALTHCHECK` con `chuspa healthcheck`, que no necesita shell ni curl.

## Logs

Una línea JSON por petición, con `request_id`, método, ruta, código, bytes, duración y origen. El mismo `request_id` va en el header `x-amz-request-id` de la respuesta, para cruzar un error de un cliente con su línea en el log. Los errores internos se registran con su detalle y se responden como `InternalError`, sin exponer nada al cliente.
