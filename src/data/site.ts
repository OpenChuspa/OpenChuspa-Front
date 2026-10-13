import type { icons } from 'lucide';
import { DEFAULT_CHUSPA, ENDPOINT, REGION } from './constants';

type IconName = keyof typeof icons;

export const navLinks = [
  { href: '#playground', label: 'Terminal Interactiva', short: 'Terminal' },
  { href: '#comandos', label: 'Comandos CLI', short: 'CLI' },
  { href: '#glosario', label: 'Glosario Caleño', short: 'Glosario' },
  { href: '#generador', label: 'Generador', short: 'Generador' },
  { href: '#sdks', label: 'SDKs & S3', short: 'SDKs' },
  { href: '/docs', label: 'Docs', short: 'Docs' },
];

export const highlights = [
  { label: 'Latencia en Cali', value: '0.4 ms' },
  { label: 'Standard API', value: 'AWS S3' },
  { label: 'Garantía Caleña', value: 'Vos Sabés', accent: true },
];

export const quickCommands = [
  { label: 've mira chuspa://', cmd: 've mira chuspa://' },
  { label: 've crea chuspa://feria-de-cali', cmd: 've crea chuspa://feria-de-cali' },
  { label: 've subi ./cancion.mp3', cmd: `ve subi ./cancion.mp3 a chuspa://${DEFAULT_CHUSPA}/music/` },
  { label: 've baja chuspa://...', cmd: `ve baja chuspa://${DEFAULT_CHUSPA}/music/cancion.mp3 .` },
];

export const commands: {
  name: string;
  badge: string;
  icon: IconName;
  description: string;
  example: string;
  danger?: boolean;
}[] = [
  {
    name: 've subi',
    badge: 'PUT / Upload',
    icon: 'UploadCloud',
    description: 'Empaca y sube un archivo local directamente a tu chuspa.',
    example: `ve subi ./file.txt a chuspa://${DEFAULT_CHUSPA}/test/`,
  },
  {
    name: 've baja',
    badge: 'GET / Download',
    icon: 'DownloadCloud',
    description: 'Saca un objeto de la chuspa y lo descarga en tu directorio.',
    example: `ve baja chuspa://${DEFAULT_CHUSPA}/test/file.txt .`,
  },
  {
    name: 've crea',
    badge: 'MB / Create Bucket',
    icon: 'FolderPlus',
    description: 'Abre una chuspa completamente nueva lista para recibir datos.',
    example: 've crea chuspa://mi-nueva-chuspa',
  },
  {
    name: 've mira',
    badge: 'LS / List',
    icon: 'List',
    description: 'Listá todas las chuspas disponibles o el contenido dentro de una.',
    example: `ve mira chuspa://${DEFAULT_CHUSPA}/`,
  },
  {
    name: 've borra',
    badge: 'RM / Delete',
    icon: 'Trash2',
    description: 'Elimina una chuchería o vacía una chuspa que ya no sirva.',
    example: `ve borra chuspa://${DEFAULT_CHUSPA}/test/file.txt`,
    danger: true,
  },
  {
    name: 've sincroniza',
    badge: 'SYNC / Mirror',
    icon: 'RefreshCw',
    description: 'Mantiene sincronizada una carpeta entera con tu chuspa remota.',
    example: 've sincroniza ./mis-fotos chuspa://backup-chuspa/',
  },
];

export const glossary = [
  {
    aws: 'Bucket',
    term: 'Chuspa',
    description: 'La bolsa de plástico tradicional donde guardás todo lo que no querés que se te pierda.',
  },
  {
    aws: 'Object',
    term: 'Chuchería',
    description: 'Cualquier archivo, imagen, vídeo o dato comprimido empacado en tu chuspa.',
  },
  {
    aws: 'Access Key ID',
    term: 'Clave del Parchao',
    description: 'Tu identificador público para entrar al parche del servidor sin pedir permiso.',
  },
  {
    aws: 'Secret Key',
    term: 'La Secreta de la Cuadra',
    description: 'La contraseña privada. No se la des ni a tu mejor amigo del barrio.',
  },
  {
    aws: 'Endpoint',
    term: 'La Esquina',
    description: `La dirección del servidor central (${ENDPOINT}).`,
  },
  {
    aws: 'Region',
    term: 'Sucursal del Cielo',
    description: `Ubicaciones de data centers: ${REGION}, cali-granada-2, cali-terron-3.`,
  },
  {
    aws: 'IAM / Policy',
    term: 'Reglamento del Parche',
    description: 'Las reglas de quién puede ver o sacar cosas de cada chuspa.',
  },
  {
    aws: 'Server',
    term: 'Motor Caleño',
    description: 'El clúster S3 distribuido alimentado a jugo de borojó y champús.',
  },
];

export const generatorActions = [
  { value: 'subi', label: 've subi (Upload / Put Object)' },
  { value: 'baja', label: 've baja (Download / Get Object)' },
  { value: 'crea', label: 've crea (Create Bucket)' },
  { value: 'mira', label: 've mira (List Objects / Buckets)' },
  { value: 'borra', label: 've borra (Delete Object)' },
];

export const sdkSnippets = [
  {
    key: 'python',
    tab: 'Python (boto3)',
    title: 'Librería Python (boto3) configurada para OpenChuspa',
    code: `# Python boto3 S3 Client con OpenChuspa
import boto3

# Conexión al Motor Caleño de Chuspas
s3 = boto3.client(
    's3',
    endpoint_url='${ENDPOINT}',
    aws_access_key_id='clave-del-parchao',
    aws_secret_access_key='la-secreta-de-la-cuadra',
    region_name='${REGION}'
)

# Empacar objeto en la Chuspa (ve subi)
s3.upload_file('./archivo_caleño.png', '${DEFAULT_CHUSPA}', 'test/archivo_caleño.png')
print("¡Archivo empacado con éxito en la Chuspa! Vos sabés")`,
  },
  {
    key: 'node',
    tab: 'Node.js (@aws-sdk)',
    title: 'Node.js (@aws-sdk/client-s3) para OpenChuspa',
    code: `// Node.js AWS SDK v3 con OpenChuspa
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: "${ENDPOINT}",
  region: "${REGION}",
  credentials: {
    accessKeyId: "clave-del-parchao",
    secretAccessKey: "la-secreta-de-la-cuadra",
  },
});

// Empacar objeto en la Chuspa
await s3.send(new PutObjectCommand({
  Bucket: "${DEFAULT_CHUSPA}",
  Key: "test/musica.mp3",
  Body: fileBuffer,
}));
console.log("¡Empacado en la chuspa con swing!");`,
  },
  {
    key: 'go',
    tab: 'Go (aws-sdk-go)',
    title: 'Go (aws-sdk-go-v2) SDK con OpenChuspa',
    code: `// Go AWS SDK v2 (S3) para OpenChuspa
package main

import (
    "context"
    "fmt"

    "github.com/aws/aws-sdk-go-v2/aws"
    "github.com/aws/aws-sdk-go-v2/config"
    "github.com/aws/aws-sdk-go-v2/credentials"
    "github.com/aws/aws-sdk-go-v2/service/s3"
)

func main() {
    cfg, _ := config.LoadDefaultConfig(context.TODO(),
        config.WithRegion("${REGION}"),
        config.WithCredentialsProvider(
            credentials.NewStaticCredentialsProvider(
                "clave-del-parchao", "la-secreta-de-la-cuadra", "",
            ),
        ),
    )

    // Inicializar Motor Caleño apuntando al Endpoint de OpenChuspa
    client := s3.NewFromConfig(cfg, func(o *s3.Options) {
        o.BaseEndpoint = aws.String("${ENDPOINT}")
        o.UsePathStyle = true
    })

    _ = client
    fmt.Println("Conectado a OpenChuspa en Cali! Vos sabés")
}`,
  },
  {
    key: 'docker',
    tab: 'Docker Compose',
    title: 'Docker Compose Self-Hosted Cluster',
    code: `version: '3.8'

services:
  openchuspa-engine:
    image: openchuspa/chuspa:latest
    container_name: motor_caleño_s3
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      CHUSPA_ROOT_USER: "clave-del-parchao"
      CHUSPA_ROOT_PASSWORD: "la-secreta-de-la-cuadra"
      CHUSPA_REGION: "${REGION}"
    volumes:
      - ./chuspa_data:/data`,
  },
  {
    key: 'curl',
    tab: 'cURL / REST',
    title: 'Petición REST cURL directa al Endpoint',
    code: `# Petición cURL PutObject (ve subi directo)
curl -X PUT -T "./archivo.pdf" \\
  -H "Host: ${new URL(ENDPOINT).host}" \\
  -H "x-amz-acl: public-read" \\
  "${ENDPOINT}/${DEFAULT_CHUSPA}/test/archivo.pdf"

# Sacar de la Chuspa (ve baja)
curl -O ${ENDPOINT}/${DEFAULT_CHUSPA}/test/archivo.pdf`,
  },
];

export const DOCKER_RUN = 'docker run -p 9000:9000 openchuspa/chuspa';
