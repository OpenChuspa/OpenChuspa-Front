---
layout: ../../../layouts/DocsLayout.astro
title: Monitoring
description: Prometheus metrics, logs and recommended alerts.
---

# Monitoring

## Metrics

With `CHUSPA_METRICS_ADDR=127.0.0.1:9100`, the engine publishes Prometheus metrics at `/metrics`, on a port separate from the API. Metrics carry no keys, chuspa names or secrets.

| Metric | Type | What it measures |
|---|---|---|
| `chuspa_requests_total{method,code}` | counter | Requests by method and HTTP status. |
| `chuspa_request_duration_seconds{method}` | histogram | Latency. |
| `chuspa_received_bytes_total`, `chuspa_sent_bytes_total` | counter | Volume. |
| `chuspa_disk_free_bytes` | gauge | Free space on the data disk. |
| `chuspa_scrub_damaged_objects` | gauge | Damaged objects in the last verification. |
| `chuspa_last_scrub_timestamp_seconds` | gauge | Last full verification (0: none since startup). |
| `chuspa_last_backup_timestamp_seconds` | gauge | Last index backup (0: none since startup). |
| `chuspa_maintenance_errors_total` | counter | Failures of maintenance, backup or verification. |
| `chuspa_auth_blocks_total` | counter | IPs blocked for brute force. |
| `chuspa_build_info{version}` | gauge | Deployed version. |

In Docker, publish the metrics port only towards your Prometheus:

```yaml
    environment:
      CHUSPA_METRICS_ADDR: ":9100"
    ports:
      - "127.0.0.1:9100:9100"
```

## Recommended alerts

```yaml
groups:
  - name: openchuspa
    rules:
      - alert: ChuspaDamagedData
        expr: chuspa_scrub_damaged_objects > 0
        labels: { severity: critical }
        annotations:
          summary: "Verification found damaged objects: check the log and restore from backup"
      - alert: ChuspaDiskAlmostFull
        expr: chuspa_disk_free_bytes < 5 * 1024 * 1024 * 1024
        for: 15m
        labels: { severity: warning }
      - alert: ChuspaInternalErrors
        expr: sum(rate(chuspa_requests_total{code=~"5.."}[5m])) / sum(rate(chuspa_requests_total[5m])) > 0.01
        for: 10m
        labels: { severity: warning }
      - alert: ChuspaMaintenanceFailing
        expr: increase(chuspa_maintenance_errors_total[1h]) > 0
        labels: { severity: warning }
      - alert: ChuspaNoIndexBackup
        expr: chuspa_last_backup_timestamp_seconds > 0 and time() - chuspa_last_backup_timestamp_seconds > 2 * 86400
        labels: { severity: warning }
      - alert: ChuspaBruteForce
        expr: increase(chuspa_auth_blocks_total[15m]) > 0
        labels: { severity: info }
```

## Health

`GET /-/health` returns `200 ok` without authentication. The Docker image uses it in its `HEALTHCHECK` through `chuspa healthcheck`, which needs neither a shell nor curl.

## Logs

One JSON line per request, with `request_id`, method, path, status, bytes, duration and origin. The same `request_id` goes in the `x-amz-request-id` response header, so a client error can be matched with its log line. Internal errors are logged with their details and answered as `InternalError`, exposing nothing to the client.
