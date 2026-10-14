---
layout: ../../../layouts/DocsLayout.astro
title: Introduction
description: What OpenChuspa is, what it does today and where to start.
---

# OpenChuspa

OpenChuspa is an open-source (Apache-2.0) object storage server compatible with the AWS S3 API, written in Go. It runs on a single node, stores data on local disk and works with the usual clients: AWS CLI, boto3, `@aws-sdk/client-s3`, `aws-sdk-go-v2` and curl.

The current version is **1.0.0**, the first stable one: the supported API, the configuration, the commands and the data format stay compatible across the whole 1.x series.

## What it offers

- **Single-node S3 API:** chuspas (buckets), objects with ranges and conditional writes, v1 and v2 listings, multipart, copies and bulk delete.
- **Secure by default:** it refuses to start without credentials or with a short secret, verifies every SigV4 signature and every checksum, ships native TLS and blocks brute force.
- **Data that survives a crash:** every write is atomic, the index can be rebuilt from the blobs and the content is verified against its SHA-256.
- **Operable:** Prometheus metrics, periodic content verification, daily index backup and automatic migration between versions.
- **Really tested:** every change goes through the official AWS SDKs, 222 `ceph/s3-tests` tests and, every night, an endurance test that kills the engine with `kill -9` while it writes.

## Scope

One node, one root credential and path-style addressing. Supported operations are listed in [S3 compatibility](/en/docs/compatibilidad/); any other returns `501 NotImplemented`, never a fake success.

## Where to start

1. [Installation](/en/docs/instalacion/): with Docker in five minutes, or with the binary.
2. [Clients and SDKs](/en/docs/clientes/): how to point your application at the engine.
3. [Operations and backup](/en/docs/operacion/) and [Monitoring](/en/docs/monitoreo/), before storing anything that matters.
4. [Security](/en/docs/seguridad/), before exposing it outside your machine.

## Terms

The project keeps names from Cali, Colombia:

| OpenChuspa | AWS S3 |
|---|---|
| Chuspa | Bucket |
| Chuchería | Object |
| Clave del Parchao | Access Key ID |
| La Secreta de la Cuadra | Secret Access Key |
| `chuspa://chuspa/key` | `s3://bucket/key` |

The code is at [github.com/OpenChuspa](https://github.com/OpenChuspa).
