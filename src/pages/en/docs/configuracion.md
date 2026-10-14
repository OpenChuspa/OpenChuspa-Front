---
layout: ../../../layouts/DocsLayout.astro
title: Configuration
description: Every environment variable of the engine and its default value.
---

# Configuration

The engine is configured only with environment variables. The rule is to fail closed: with an incomplete or insecure configuration, the server does not start and explains why.

## Variables

| Variable | Default | Description |
|---|---|---|
| `CHUSPA_ADDR` | `127.0.0.1:9000` | Listen address. It is `:9000` in the Docker image. |
| `CHUSPA_DATA_DIR` | `/data` | Data root folder. |
| `CHUSPA_ROOT_USER` | required | Access key: 3 to 128 letters, digits, `-` or `_`. |
| `CHUSPA_ROOT_PASSWORD` | required | Secret key, at least 32 characters. |
| `CHUSPA_ROOT_PASSWORD_FILE` | empty | Path to a file with the secret; alternative to the previous one. |
| `CHUSPA_ROOT_PASSWORD_PREVIOUS` (or `_FILE`) | empty | Previous secret, accepted along with the current one during a rotation. |
| `CHUSPA_REGION` | `cali-san-antonio-1` | Region the server reports and requires in the signature. |
| `CHUSPA_TLS_CERT_FILE` / `CHUSPA_TLS_KEY_FILE` | empty | PEM certificate and key for native TLS (1.2 or later). Reloaded when they change on disk. |
| `CHUSPA_AUTH_MAX_FAILURES` | `20` | Failed authentications per minute that block an IP for 5 minutes. `0` disables it. |
| `CHUSPA_MIN_FREE_MB` | `1024` | Minimum free disk space, in MiB. Below it, writes return `507 InsufficientStorage`. `0` disables it. |
| `CHUSPA_SCRUB_INTERVAL` | `168h` | How often all content is re-read against its SHA-256. `0` disables it. |
| `CHUSPA_MULTIPART_EXPIRY` | `168h` | Age at which an incomplete multipart upload is aborted. `0` disables it. |
| `CHUSPA_METRICS_ADDR` | empty | Address for Prometheus metrics, separate from the API (for example `127.0.0.1:9100`). |
| `CHUSPA_ALLOW_ANONYMOUS` | `false` | No authentication. Only accepted when listening on loopback, for local tests. |
| `CHUSPA_LOG_FORMAT` | `json` | `json` or `text`. |

## What prevents startup

- `CHUSPA_ROOT_USER` or the secret is missing, or the secret has fewer than 32 characters.
- Both `CHUSPA_ROOT_PASSWORD` and `CHUSPA_ROOT_PASSWORD_FILE` are set.
- `CHUSPA_ALLOW_ANONYMOUS=true` while listening outside loopback.
- The example credentials from the documentation while listening outside loopback.
- Only one of the two TLS variables, or a certificate that does not load.
- The data was written by a newer version of the engine.

## Fixed limits

| Limit | Value |
|---|---|
| Size of a `PutObject` or a part | 5 GiB |
| Minimum size of a part that is not the last | 5 MiB |
| Key length | 1024 bytes |
| Headers per request | 64 KiB |
| Concurrent connections | 1000 |
| Clock skew accepted in the signature | 15 minutes |

## Logging

Logs go to standard output, one line per request with method, path, status, bytes and duration. They never record headers or the query string, which is where `Authorization` and signatures travel.
