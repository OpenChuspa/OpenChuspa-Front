---
layout: ../../../layouts/DocsLayout.astro
title: Clients and SDKs
description: How to connect the AWS CLI, boto3, the JavaScript SDK, the Go SDK and curl to OpenChuspa.
---

# Clients and SDKs

Any S3 client works once you give it three things:

1. **The engine endpoint**, for example `http://localhost:9000`.
2. **The configured region:** `cali-san-antonio-1` by default. The signature requires it.
3. **Path-style addressing** (`/chuspa/key`). Virtual-host style is not supported.

These clients are tested on every change, in their default configuration: AWS CLI v2, boto3, `@aws-sdk/client-s3` and `aws-sdk-go-v2`.

## AWS CLI

```bash
export AWS_ACCESS_KEY_ID=my-key
export AWS_SECRET_ACCESS_KEY="$SECRET"
export AWS_DEFAULT_REGION=cali-san-antonio-1
export AWS_ENDPOINT_URL=http://localhost:9000

aws s3 mb s3://feria-de-cali
aws s3 cp ./file.pdf s3://feria-de-cali/docs/
aws s3 sync ./photos s3://feria-de-cali/photos/
aws s3 ls s3://feria-de-cali --recursive
```

## Python (boto3)

```python
import boto3

s3 = boto3.client(
    "s3",
    endpoint_url="http://localhost:9000",
    aws_access_key_id="my-key",
    aws_secret_access_key=SECRET,
    region_name="cali-san-antonio-1",
)
s3.upload_file("./file.pdf", "feria-de-cali", "docs/file.pdf")
```

## JavaScript (`@aws-sdk/client-s3`)

```js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: "http://localhost:9000",
  region: "cali-san-antonio-1",
  forcePathStyle: true,
  credentials: { accessKeyId: "my-key", secretAccessKey: process.env.SECRET },
});
await s3.send(new PutObjectCommand({ Bucket: "feria-de-cali", Key: "docs/a.txt", Body: "hello" }));
```

## Go (`aws-sdk-go-v2`)

```go
cfg, err := config.LoadDefaultConfig(ctx,
    config.WithRegion("cali-san-antonio-1"),
    config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider("my-key", secret, "")),
)
client := s3.NewFromConfig(cfg, func(o *s3.Options) {
    o.BaseEndpoint = aws.String("http://localhost:9000")
    o.UsePathStyle = true
})
```

## curl

curl 7.75 or later signs with SigV4:

```bash
curl -T ./file.pdf --aws-sigv4 "aws:amz:cali-san-antonio-1:s3" \
  --user "my-key:$SECRET" http://localhost:9000/feria-de-cali/docs/file.pdf
```

## With TLS

If the engine uses a certificate from your own authority, tell the client which one: `--ca-bundle` in the AWS CLI, `verify=` in boto3, or `NODE_EXTRA_CA_CERTS` in Node.js.

## Common errors

| Error | Cause |
|---|---|
| `SignatureDoesNotMatch` | Secret or region different from the server's. |
| `RequestTimeTooSkewed` | The client clock is more than 15 minutes off the server. |
| `NoSuchBucket` with the JS or Go SDK | `forcePathStyle` / `UsePathStyle` is missing. |
| `SlowDown` (503) | The IP accumulated too many failed attempts; wait 5 minutes. |
| `InsufficientStorage` (507) | The server disk is below the minimum free space. |
| `NotImplemented` (501) | Unsupported operation: see [Compatibility](/en/docs/compatibilidad/). |
