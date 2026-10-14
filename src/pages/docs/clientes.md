---
layout: ../../layouts/DocsLayout.astro
title: Clientes y SDK
description: Cómo conectar AWS CLI, boto3, el SDK de JavaScript, el de Go y curl a OpenChuspa.
---

# Clientes y SDK

Cualquier cliente de S3 sirve si se le indican tres cosas:

1. **El endpoint del motor**, por ejemplo `http://localhost:9000`.
2. **La región configurada:** `cali-san-antonio-1` por defecto. La firma la exige.
3. **Direccionamiento por ruta** (`/chuspa/key`). El estilo de host virtual no está soportado.

Estos clientes se prueban en cada cambio, en su configuración por defecto: AWS CLI v2, boto3, `@aws-sdk/client-s3` y `aws-sdk-go-v2`.

## AWS CLI

```bash
export AWS_ACCESS_KEY_ID=mi-llave
export AWS_SECRET_ACCESS_KEY="$SECRETO"
export AWS_DEFAULT_REGION=cali-san-antonio-1
export AWS_ENDPOINT_URL=http://localhost:9000

aws s3 mb s3://feria-de-cali
aws s3 cp ./archivo.pdf s3://feria-de-cali/docs/
aws s3 sync ./fotos s3://feria-de-cali/fotos/
aws s3 ls s3://feria-de-cali --recursive
```

## Python (boto3)

```python
import boto3

s3 = boto3.client(
    "s3",
    endpoint_url="http://localhost:9000",
    aws_access_key_id="mi-llave",
    aws_secret_access_key=SECRETO,
    region_name="cali-san-antonio-1",
)
s3.upload_file("./archivo.pdf", "feria-de-cali", "docs/archivo.pdf")
```

## JavaScript (`@aws-sdk/client-s3`)

```js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: "http://localhost:9000",
  region: "cali-san-antonio-1",
  forcePathStyle: true,
  credentials: { accessKeyId: "mi-llave", secretAccessKey: process.env.SECRETO },
});
await s3.send(new PutObjectCommand({ Bucket: "feria-de-cali", Key: "docs/a.txt", Body: "hola" }));
```

## Go (`aws-sdk-go-v2`)

```go
cfg, err := config.LoadDefaultConfig(ctx,
    config.WithRegion("cali-san-antonio-1"),
    config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider("mi-llave", secreto, "")),
)
client := s3.NewFromConfig(cfg, func(o *s3.Options) {
    o.BaseEndpoint = aws.String("http://localhost:9000")
    o.UsePathStyle = true
})
```

## curl

curl 7.75 o superior firma con SigV4:

```bash
curl -T ./archivo.pdf --aws-sigv4 "aws:amz:cali-san-antonio-1:s3" \
  --user "mi-llave:$SECRETO" http://localhost:9000/feria-de-cali/docs/archivo.pdf
```

## Con TLS

Si el motor usa un certificado de una autoridad propia, indicale al cliente cuál es: `--ca-bundle` en el AWS CLI, `verify=` en boto3, o `NODE_EXTRA_CA_CERTS` en Node.js.

## Errores frecuentes

| Error | Causa |
|---|---|
| `SignatureDoesNotMatch` | Secreto o región distintos de los del servidor. |
| `RequestTimeTooSkewed` | El reloj del cliente está a más de 15 minutos del servidor. |
| `NoSuchBucket` con un SDK de JS o Go | Falta `forcePathStyle` / `UsePathStyle`. |
| `SlowDown` (503) | La IP acumuló demasiados intentos fallidos; espere 5 minutos. |
| `InsufficientStorage` (507) | El disco del servidor está por debajo del espacio libre mínimo. |
| `NotImplemented` (501) | Operación no soportada: ver [Compatibilidad](/docs/compatibilidad/). |
