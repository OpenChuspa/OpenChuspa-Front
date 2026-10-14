---
layout: ../../layouts/DocsLayout.astro
title: Instalación
description: Cómo instalar OpenChuspa con Docker, con Docker Compose o con el binario.
---

# Instalación

La forma recomendada es Docker. La imagen es distroless: sin shell, sin root, con el sistema de archivos de solo lectura y firmada con cosign. Se publica con la versión exacta en Docker Hub (`openchuspa/chuspa:1.0.0`) y en `ghcr.io/openchuspa/chuspa:1.0.0`. No existe el tag `latest`, a propósito.

## Docker Compose (recomendado)

El secreto vive en un archivo, no en el YAML ni en el historial de la terminal.

```bash
mkdir -p openchuspa/secrets && cd openchuspa
openssl rand -hex 24 > secrets/chuspa_root_password
chmod 600 secrets/chuspa_root_password
```

`docker-compose.yml`:

```yaml
services:
  chuspa:
    image: docker.io/openchuspa/chuspa:1.0.0
    ports:
      - "127.0.0.1:9000:9000"
    environment:
      CHUSPA_ROOT_USER: "mi-llave"
      CHUSPA_ROOT_PASSWORD_FILE: /run/secrets/chuspa_root_password
      CHUSPA_REGION: "cali-san-antonio-1"
    secrets:
      - chuspa_root_password
    volumes:
      - chuspa_data:/data
    read_only: true
    cap_drop: ["ALL"]
    security_opt: ["no-new-privileges:true"]
    restart: unless-stopped

secrets:
  chuspa_root_password:
    file: ./secrets/chuspa_root_password

volumes:
  chuspa_data:
```

```bash
docker compose up -d
docker compose ps        # el estado debe llegar a "healthy"
```

El puerto queda publicado solo en `127.0.0.1`. Para exponerlo, primero configurá TLS: ver [Seguridad](/docs/seguridad/).

## Docker, en una línea

Para probar:

```bash
export SECRETO="$(openssl rand -hex 24)"
docker run -d --name chuspa -p 127.0.0.1:9000:9000 \
  -e CHUSPA_ROOT_USER=mi-llave -e CHUSPA_ROOT_PASSWORD="$SECRETO" \
  -v chuspa_data:/data openchuspa/chuspa:1.0.0
```

## Binario

Cada release publica los binarios de `chuspa` (el motor) y `ve` (la CLI) para Linux y macOS, en amd64 y arm64, con un archivo `SHA256SUMS` firmado. Se descargan desde la página de releases de [OpenChuspa-core](https://github.com/OpenChuspa/OpenChuspa-core/releases).

```bash
# Linux amd64; para otra plataforma cambiá el sufijo
curl -LO https://github.com/OpenChuspa/OpenChuspa-core/releases/download/v1.0.0/chuspa_1.0.0_linux_amd64
curl -LO https://github.com/OpenChuspa/OpenChuspa-core/releases/download/v1.0.0/SHA256SUMS
sha256sum --check --ignore-missing SHA256SUMS
install -m 0755 chuspa_1.0.0_linux_amd64 /usr/local/bin/chuspa

export CHUSPA_ROOT_USER=mi-llave
export CHUSPA_ROOT_PASSWORD="$(openssl rand -hex 24)"
export CHUSPA_DATA_DIR=/var/lib/chuspa
chuspa serve
```

## Desde el código

Requiere Go 1.27.2 o superior.

```bash
git clone https://github.com/OpenChuspa/OpenChuspa-core.git
cd OpenChuspa-core
go build -o chuspa ./cmd/chuspa
go build -o ve ./cmd/ve
```

## Primer uso

Con las mismas credenciales del servidor:

```bash
export AWS_ACCESS_KEY_ID=mi-llave
export AWS_SECRET_ACCESS_KEY="$SECRETO"
export AWS_DEFAULT_REGION=cali-san-antonio-1
export AWS_ENDPOINT_URL=http://localhost:9000

aws s3 mb s3://feria-de-cali
aws s3 cp salsa.txt s3://feria-de-cali/test/
aws s3 ls s3://feria-de-cali/test/
```

## Verificar la imagen

La firma es sin llaves: la emite el workflow de release de GitHub Actions. Requiere cosign 3 o superior; las versiones 2 no encuentran la firma.

```bash
cosign verify docker.io/openchuspa/chuspa:1.0.0 \
  --certificate-identity-regexp '^https://github.com/OpenChuspa/OpenChuspa-core/\.github/workflows/release\.yml@refs/tags/v' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

## Actualizar

Las versiones nuevas migran solas los datos de las anteriores al arrancar, y una versión vieja se niega a abrir datos de una más nueva. Aun así, antes de actualizar conviene una copia de la carpeta de datos con el servidor detenido: ver [Operación y respaldo](/docs/operacion/).
