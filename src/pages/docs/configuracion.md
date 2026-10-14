---
layout: ../../layouts/DocsLayout.astro
title: Configuración
description: Todas las variables de entorno del motor y sus valores por defecto.
---

# Configuración

El motor se configura solo con variables de entorno. La regla es fallar cerrado: ante una configuración incompleta o insegura, el servidor no arranca y explica por qué.

## Variables

| Variable | Por defecto | Descripción |
|---|---|---|
| `CHUSPA_ADDR` | `127.0.0.1:9000` | Dirección de escucha. En la imagen de Docker es `:9000`. |
| `CHUSPA_DATA_DIR` | `/data` | Carpeta raíz de los datos. |
| `CHUSPA_ROOT_USER` | obligatoria | Access key: de 3 a 128 letras, dígitos, `-` o `_`. |
| `CHUSPA_ROOT_PASSWORD` | obligatoria | Secret key, mínimo 32 caracteres. |
| `CHUSPA_ROOT_PASSWORD_FILE` | vacía | Ruta a un archivo con el secreto; alternativa a la anterior. |
| `CHUSPA_ROOT_PASSWORD_PREVIOUS` (o `_FILE`) | vacía | Secreto anterior, aceptado además del actual mientras se rota. |
| `CHUSPA_REGION` | `cali-san-antonio-1` | Región que reporta el servidor y que exige en la firma. |
| `CHUSPA_TLS_CERT_FILE` / `CHUSPA_TLS_KEY_FILE` | vacías | Certificado y llave PEM para TLS nativo (1.2 o superior). Se releen al cambiar en disco. |
| `CHUSPA_AUTH_MAX_FAILURES` | `20` | Autenticaciones fallidas por minuto que bloquean una IP durante 5 minutos. `0` lo desactiva. |
| `CHUSPA_MIN_FREE_MB` | `1024` | Espacio libre mínimo en disco, en MiB. Por debajo, las escrituras responden `507 InsufficientStorage`. `0` lo desactiva. |
| `CHUSPA_SCRUB_INTERVAL` | `168h` | Cada cuánto se relee todo el contenido contra su SHA-256. `0` lo desactiva. |
| `CHUSPA_MULTIPART_EXPIRY` | `168h` | Edad a la que una subida multipart sin completar se aborta sola. `0` la desactiva. |
| `CHUSPA_METRICS_ADDR` | vacía | Dirección para las métricas de Prometheus, aparte de la API (por ejemplo `127.0.0.1:9100`). |
| `CHUSPA_ALLOW_ANONYMOUS` | `false` | Sin autenticación. Solo se acepta escuchando en loopback, para pruebas locales. |
| `CHUSPA_LOG_FORMAT` | `json` | `json` o `text`. |

## Qué impide el arranque

- Faltan `CHUSPA_ROOT_USER` o el secreto, o el secreto tiene menos de 32 caracteres.
- Se definen a la vez `CHUSPA_ROOT_PASSWORD` y `CHUSPA_ROOT_PASSWORD_FILE`.
- `CHUSPA_ALLOW_ANONYMOUS=true` escuchando fuera de loopback.
- Las credenciales de ejemplo de la documentación escuchando fuera de loopback.
- Solo una de las dos variables de TLS, o un certificado que no carga.
- Los datos los escribió una versión más nueva del motor.

## Límites fijos

| Límite | Valor |
|---|---|
| Tamaño de un `PutObject` o de una parte | 5 GiB |
| Tamaño mínimo de una parte que no es la última | 5 MiB |
| Largo de una key | 1024 bytes |
| Headers por petición | 64 KiB |
| Conexiones simultáneas | 1000 |
| Desfase de reloj aceptado en la firma | 15 minutos |

## Registro

Los logs van a la salida estándar, una línea por petición con método, ruta, código, bytes y duración. Nunca registran headers ni la query, que es donde viajan `Authorization` y las firmas.
