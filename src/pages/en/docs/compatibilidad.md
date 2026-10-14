---
layout: ../../../layouts/DocsLayout.astro
title: S3 compatibility
description: Which S3 operations OpenChuspa supports and how much of ceph/s3-tests passes.
---

# S3 compatibility

This page lists only what is tested on every change. What is not here is not promised.

## Operations

| Operation | Status |
|---|---|
| ListBuckets, CreateBucket, HeadBucket, GetBucketLocation, DeleteBucket | Supported |
| PutObject, GetObject (with `Range` and conditions), HeadObject, DeleteObject, DeleteObjects | Supported |
| Conditional writes (`If-None-Match: *`, `If-Match`) on PutObject and CompleteMultipartUpload | Supported |
| CopyObject and UploadPartCopy | Supported |
| ListObjectsV2 and ListObjects (prefix, delimiter, pagination, `encoding-type=url`) | Supported |
| CreateMultipartUpload, UploadPart, CompleteMultipartUpload, AbortMultipartUpload, ListParts, ListMultipartUploads | Supported |
| SigV4 by header; signed and unsigned `aws-chunked` bodies, with trailers | Supported |
| CRC32, CRC32C, CRC64NVME, SHA-1 and SHA-256 checksums | Supported |
| ListObjectVersions | Only the view of an unversioned chuspa |
| GetObjectTagging | Returns empty: tags cannot be set yet |
| Presigned URLs, versioning, ACLs, policies, tags, CORS, lifecycle, object lock, encryption | `501 NotImplemented` |

Addressing is path-style (`/chuspa/key`). Chuspa names are 3 to 63 characters of lowercase letters, digits and hyphens, without dots.

## Tested clients

On every change, against the real binary and in their default configuration: AWS CLI v2, boto3, `@aws-sdk/client-s3`, `aws-sdk-go-v2` and curl. Tests cover 100 MB files in parts, ranges, listings of more than 1000 objects, large copies, bulk delete, keys with unusual characters and the `ve` CLI.

## ceph/s3-tests

[`ceph/s3-tests`](https://github.com/ceph/s3-tests) conformance suite, file `test_s3.py`:

| | Tests |
|---|---|
| Total in the file | 838 |
| Skipped by the suite itself | 94 |
| Run | 744 |
| **Pass** | **222** |

The 222 run on every change and cannot stop passing. The ones that fail belong to features outside the current scope: ACLs and anonymous access, versioning, policies, encryption, lifecycle, form uploads, presigned URLs, tags, CORS, object lock, a second identity and Ceph-specific behavior.

Deliberate differences:

- Creating a chuspa that already exists returns `BucketAlreadyOwnedByYou` (409).
- Chuspa names with dots are rejected while virtual-host style does not exist.

## Roadmap

| Phase | What it brings |
|---|---|
| 2 | Presigned URLs, virtual host, multiple users and policies, tags |
| 3 | Versioning, lifecycle, encryption at rest, replication and clustering |
