---
layout: ../../layouts/DocsLayout.astro
title: Introducción
description: Qué es OpenChuspa, qué hace hoy y por dónde empezar.
---

# OpenChuspa

OpenChuspa es un servidor de almacenamiento de objetos compatible con la API de AWS S3, escrito en Go y de código abierto (Apache-2.0). Corre en un solo nodo, guarda los datos en disco local y funciona con los clientes de siempre: AWS CLI, boto3, `@aws-sdk/client-s3`, `aws-sdk-go-v2` y curl.

La versión actual es la **1.0.0**, la primera estable: la API soportada, la configuración, los comandos y el formato de los datos se mantienen compatibles en toda la serie 1.x.

## Qué ofrece

- **API S3 de un nodo:** chuspas (buckets), objetos con rangos y escrituras condicionales, listados v1 y v2, multipart, copias y borrado masivo.
- **Seguro por defecto:** no arranca sin credenciales ni con un secreto corto, verifica cada firma SigV4 y cada checksum, trae TLS nativo y bloquea la fuerza bruta.
- **Datos que no se pierden por una caída:** cada escritura es atómica, el índice se puede reconstruir desde los blobs y el contenido se verifica contra su SHA-256.
- **Operable:** métricas de Prometheus, verificación periódica del contenido, copia diaria del índice y migración automática entre versiones.
- **Probado de verdad:** cada cambio pasa por los SDK oficiales de AWS, 222 pruebas de `ceph/s3-tests` y, cada noche, una prueba de resistencia que mata el motor con `kill -9` mientras escribe.

## Alcance

Un nodo, una credencial raíz y direccionamiento por ruta. Las operaciones soportadas están en [Compatibilidad con S3](/docs/compatibilidad/); cualquier otra responde `501 NotImplemented`, nunca un éxito falso.

## Por dónde empezar

1. [Instalación](/docs/instalacion/): con Docker en cinco minutos, o con el binario.
2. [Clientes y SDK](/docs/clientes/): cómo apuntar tu aplicación al motor.
3. [Operación y respaldo](/docs/operacion/) y [Monitoreo](/docs/monitoreo/), antes de guardar algo que importe.
4. [Seguridad](/docs/seguridad/), antes de exponerlo fuera de tu máquina.

## Términos

| OpenChuspa | AWS S3 |
|---|---|
| Chuspa | Bucket |
| Chuchería | Objeto |
| Clave del Parchao | Access Key ID |
| La Secreta de la Cuadra | Secret Access Key |
| `chuspa://chuspa/key` | `s3://bucket/key` |

El código está en [github.com/OpenChuspa](https://github.com/OpenChuspa).
