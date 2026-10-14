---
layout: ../../../layouts/DocsLayout.astro
title: ve CLI
description: The OpenChuspa CLI with chuspa:// addresses.
---

# ve CLI

`ve` turns short commands into S3 calls. It works with OpenChuspa and with any S3-compatible service. It ships with every release, next to the engine (see [Installation](/en/docs/instalacion/)). The command names are Spanish slang from Cali: *mira* (look), *crea* (create), *subi* (upload), *baja* (download), *borra* (delete), *sincroniza* (sync).

## Configuration

```bash
export AWS_ACCESS_KEY_ID=my-key
export AWS_SECRET_ACCESS_KEY="$SECRET"
export VE_ENDPOINT=http://localhost:9000      # default
export VE_REGION=cali-san-antonio-1           # or AWS_REGION; this is the default
```

If the endpoint uses HTTP outside loopback, `ve` warns that content travels unencrypted.

## Commands

| `ve` | AWS CLI equivalent |
|---|---|
| `ve mira chuspa://` | `aws s3 ls` |
| `ve mira chuspa://chuspa/prefix/ [-r]` | `aws s3 ls [--recursive]` |
| `ve crea chuspa://chuspa` | `aws s3 mb` |
| `ve subi <file>... [a] chuspa://chuspa/key` | `aws s3 cp` |
| `ve baja chuspa://chuspa/key [destination]` | `aws s3 cp` |
| `ve borra chuspa://chuspa/key` | `aws s3 rm` |
| `ve borra chuspa://chuspa/prefix -r` | `aws s3 rm --recursive` |
| `ve borra chuspa://chuspa [-r]` | `aws s3 rb [--force]` |
| `ve sincroniza <folder> chuspa://...` (and back) | `aws s3 sync`, without deleting at the destination |
| `ve version`, `ve ayuda` | |

`s3://` addresses are accepted too. The optional `a` means "to".

## Examples

```bash
ve crea chuspa://feria-de-cali
ve subi ./song.mp3 a chuspa://feria-de-cali/music/
ve mira chuspa://feria-de-cali/music/
ve baja chuspa://feria-de-cali/music/song.mp3 .
ve sincroniza ./photos chuspa://feria-de-cali/photos/
ve borra chuspa://feria-de-cali -r
```

## Behavior

- **`subi`:** if the destination ends in `/`, the key is that prefix plus the file name. From 64 MiB the file is uploaded in parts; if something fails, the upload is aborted on the server.
- **`baja`:** writes to a temporary file first and renames it at the end, so an interrupted download never leaves a half-written file.
- **`sincroniza`:** copies what is missing or changed, comparing size and date like `aws s3 sync`, and never deletes at the destination. When downloading, keys that would escape the folder, like `../../etc/passwd`, are skipped with a warning.
- **Errors:** they say what to do, for example that the chuspa does not exist, that it is not empty, that the credentials were rejected or that the engine does not answer at the endpoint. Messages are in Spanish.
