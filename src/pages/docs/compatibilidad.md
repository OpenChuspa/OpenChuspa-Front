---
layout: ../../layouts/DocsLayout.astro
title: Compatibilidad con S3
description: Qué operaciones de S3 soporta OpenChuspa y cuánto pasa de ceph/s3-tests.
---

# Compatibilidad con S3

Esta página solo lista lo que se prueba en cada cambio. Lo que no aparece aquí no se promete.

## Operaciones

| Operación | Estado |
|---|---|
| ListBuckets, CreateBucket, HeadBucket, GetBucketLocation, DeleteBucket | Soportada |
| PutObject, GetObject (con `Range` y condiciones), HeadObject, DeleteObject, DeleteObjects | Soportada |
| Escrituras condicionales (`If-None-Match: *`, `If-Match`) en PutObject y CompleteMultipartUpload | Soportada |
| CopyObject y UploadPartCopy | Soportada |
| ListObjectsV2 y ListObjects (prefijo, delimitador, paginación, `encoding-type=url`) | Soportada |
| CreateMultipartUpload, UploadPart, CompleteMultipartUpload, AbortMultipartUpload, ListParts, ListMultipartUploads | Soportada |
| SigV4 por header; cuerpos `aws-chunked` firmados y sin firmar, con trailers | Soportada |
| Checksums CRC32, CRC32C, CRC64NVME, SHA-1 y SHA-256 | Soportada |
| ListObjectVersions | Solo la vista de una chuspa sin versionado |
| GetObjectTagging | Responde vacío: todavía no se pueden poner tags |
| URLs prefirmadas, versionado, ACL, políticas, tags, CORS, lifecycle, object lock, cifrado | `501 NotImplemented` |

El direccionamiento es por ruta (`/chuspa/key`). Los nombres de chuspa van de 3 a 63 caracteres entre minúsculas, dígitos y guiones, sin puntos.

## Clientes probados

En cada cambio, contra el binario real y en su configuración por defecto: AWS CLI v2, boto3, `@aws-sdk/client-s3`, `aws-sdk-go-v2` y curl. Las pruebas cubren archivos de 100 MB en partes, rangos, listados de más de 1000 objetos, copias grandes, borrado masivo, keys con caracteres raros y la CLI `ve`.

## ceph/s3-tests

Suite de conformidad [`ceph/s3-tests`](https://github.com/ceph/s3-tests), archivo `test_s3.py`:

| | Pruebas |
|---|---|
| Total en el archivo | 838 |
| Omitidas por la propia suite | 94 |
| Ejecutadas | 744 |
| **Pasan** | **222** |

Las 222 corren en cada cambio y no pueden dejar de pasar. Las que fallan corresponden a funciones fuera del alcance actual: ACL y acceso anónimo, versionado, políticas, cifrado, lifecycle, subidas por formulario, URLs prefirmadas, tags, CORS, object lock, una segunda identidad y comportamientos propios de Ceph.

Diferencias deliberadas:

- Crear una chuspa que ya existe responde `BucketAlreadyOwnedByYou` (409).
- Los nombres de chuspa con puntos se rechazan mientras no exista el estilo de host virtual.

## Roadmap

| Fase | Qué trae |
|---|---|
| 2 | URLs prefirmadas, host virtual, varios usuarios y políticas, tags |
| 3 | Versionado, lifecycle, cifrado en reposo, replicación y clúster |
