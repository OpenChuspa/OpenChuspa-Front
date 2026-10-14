---
layout: ../../../layouts/DocsLayout.astro
title: Installation
description: How to install OpenChuspa with Docker, Docker Compose or the binary.
---

# Installation

Docker is the recommended way. The image is distroless: no shell, no root, read-only filesystem and signed with cosign. It is published with its exact version on Docker Hub (`openchuspa/chuspa:0.3.0`) and at `ghcr.io/openchuspa/chuspa:0.3.0`. There is no `latest` tag, on purpose.

## Docker Compose (recommended)

The secret lives in a file, not in the YAML or in your shell history.

```bash
mkdir -p openchuspa/secrets && cd openchuspa
openssl rand -hex 24 > secrets/chuspa_root_password
chmod 600 secrets/chuspa_root_password
```

`docker-compose.yml`:

```yaml
services:
  chuspa:
    image: docker.io/openchuspa/chuspa:0.3.0
    ports:
      - "127.0.0.1:9000:9000"
    environment:
      CHUSPA_ROOT_USER: "my-key"
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
docker compose ps        # the status should reach "healthy"
```

The port is published on `127.0.0.1` only. To expose it, configure TLS first: see [Security](/en/docs/seguridad/).

## Docker, one line

To try it out:

```bash
export SECRET="$(openssl rand -hex 24)"
docker run -d --name chuspa -p 127.0.0.1:9000:9000 \
  -e CHUSPA_ROOT_USER=my-key -e CHUSPA_ROOT_PASSWORD="$SECRET" \
  -v chuspa_data:/data openchuspa/chuspa:0.3.0
```

## Binary

Every release publishes the `chuspa` (engine) and `ve` (CLI) binaries for Linux and macOS, amd64 and arm64, with a signed `SHA256SUMS` file. Download them from the [OpenChuspa-core](https://github.com/OpenChuspa/OpenChuspa-core/releases) releases page.

```bash
# Linux amd64; change the suffix for another platform
curl -LO https://github.com/OpenChuspa/OpenChuspa-core/releases/download/v0.3.0/chuspa_0.3.0_linux_amd64
curl -LO https://github.com/OpenChuspa/OpenChuspa-core/releases/download/v0.3.0/SHA256SUMS
sha256sum --check --ignore-missing SHA256SUMS
install -m 0755 chuspa_0.3.0_linux_amd64 /usr/local/bin/chuspa

export CHUSPA_ROOT_USER=my-key
export CHUSPA_ROOT_PASSWORD="$(openssl rand -hex 24)"
export CHUSPA_DATA_DIR=/var/lib/chuspa
chuspa serve
```

## From source

Requires Go 1.27.2 or later.

```bash
git clone https://github.com/OpenChuspa/OpenChuspa-core.git
cd OpenChuspa-core
go build -o chuspa ./cmd/chuspa
go build -o ve ./cmd/ve
```

## First use

With the same credentials as the server:

```bash
export AWS_ACCESS_KEY_ID=my-key
export AWS_SECRET_ACCESS_KEY="$SECRET"
export AWS_DEFAULT_REGION=cali-san-antonio-1
export AWS_ENDPOINT_URL=http://localhost:9000

aws s3 mb s3://feria-de-cali
aws s3 cp salsa.txt s3://feria-de-cali/test/
aws s3 ls s3://feria-de-cali/test/
```

## Verify the image

The signature is keyless: it is issued by the GitHub Actions release workflow. It requires cosign 3 or later; version 2 does not find the signature.

```bash
cosign verify docker.io/openchuspa/chuspa:0.3.0 \
  --certificate-identity-regexp '^https://github.com/OpenChuspa/OpenChuspa-core/\.github/workflows/release\.yml@refs/tags/v' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

## Upgrading

New versions migrate the data of previous ones on startup, and an old version refuses to open data written by a newer one. Even so, take a copy of the data folder with the server stopped before upgrading: see [Operations and backup](/en/docs/operacion/).
