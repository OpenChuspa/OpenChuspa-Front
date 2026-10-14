import type { icons } from 'lucide';
import { DEFAULT_CHUSPA, ENDPOINT, IMAGE, REGION } from './constants';

type IconName = keyof typeof icons;

export const navLinks = [
  { href: '#playground', label: 'Terminal Interactiva', short: 'Terminal' },
  { href: '#comandos', label: 'Comandos CLI', short: 'CLI' },
  { href: '#glosario', label: 'Glosario Caleño', short: 'Glosario' },
  { href: '#generador', label: 'Generador', short: 'Generador' },
  { href: '#sdks', label: 'SDKs & S3', short: 'SDKs' },
];

export const highlights = [
  { label: 'Licencia', value: 'Apache-2.0' },
  { label: 'Standard API', value: 'AWS S3' },
  { label: 'Garantía Caleña', value: 'Vos Sabés 😉', accent: true },
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
    term: 'Chuspa 🛍️',
    description: 'La bolsa de plástico tradicional donde guardás todo lo que no querés que se te pierda.',
  },
  {
    aws: 'Object',
    term: 'Chuchería 📦',
    description: 'Cualquier archivo, imagen, vídeo o dato comprimido empacado en tu chuspa.',
  },
  {
    aws: 'Access Key ID',
    term: 'Clave del Parchao 🔑',
    description: 'Tu identificador público para entrar al parche del servidor sin pedir permiso.',
  },
  {
    aws: 'Secret Key',
    term: 'La Secreta de la Cuadra 🔒',
    description: 'La contraseña privada. No se la des ni a tu mejor amigo del barrio.',
  },
  {
    aws: 'Endpoint',
    term: 'La Esquina 📍',
    description: `La dirección de tu motor. En local: ${ENDPOINT}.`,
  },
  {
    aws: 'Region',
    term: 'Sucursal del Cielo ☁️',
    description: `La región que reporta el motor y exige en la firma: ${REGION}.`,
  },
  {
    aws: 'IAM / Policy',
    term: 'Reglamento del Parche 📜',
    description: 'Las reglas de quién puede ver o sacar cosas de cada chuspa. Está en el roadmap.',
  },
  {
    aws: 'Server',
    term: 'Motor Caleño 🏎️',
    description: 'El servidor S3 de un solo nodo, alimentado a jugo de borojó y champús.',
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
    aws_access_key_id='TU_CLAVE_DEL_PARCHAO',
    aws_secret_access_key='TU_SECRETA_DE_LA_CUADRA',
    region_name='${REGION}'
)

# Empacar objeto en la Chuspa (ve subi)
s3.upload_file('./archivo_caleño.png', '${DEFAULT_CHUSPA}', 'test/archivo_caleño.png')
print("¡Archivo empacado con éxito en la Chuspa! Vos sabés 😉")`,
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
  forcePathStyle: true, // el motor direcciona por ruta: /chuspa/key
  credentials: {
    accessKeyId: "TU_CLAVE_DEL_PARCHAO",
    secretAccessKey: "TU_SECRETA_DE_LA_CUADRA",
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
                "TU_CLAVE_DEL_PARCHAO", "TU_SECRETA_DE_LA_CUADRA", "",
            ),
        ),
    )

    // Inicializar Motor Caleño apuntando al Endpoint de OpenChuspa
    client := s3.NewFromConfig(cfg, func(o *s3.Options) {
        o.BaseEndpoint = aws.String("${ENDPOINT}")
        o.UsePathStyle = true
    })

    _ = client
    fmt.Println("Conectado a OpenChuspa en Cali! Vos sabés 😉")
}`,
  },
  {
    key: 'docker',
    tab: 'Docker Compose',
    title: 'Docker Compose de un nodo, endurecido',
    code: `# El secreto vive en un archivo, no en este YAML:
#   mkdir -p secrets && openssl rand -hex 24 > secrets/chuspa_root_password
services:
  chuspa:
    image: ${IMAGE}
    ports:
      - "127.0.0.1:9000:9000"
    environment:
      CHUSPA_ROOT_USER: "TU_CLAVE_DEL_PARCHAO"
      CHUSPA_ROOT_PASSWORD_FILE: /run/secrets/chuspa_root_password
      CHUSPA_REGION: "${REGION}"
    secrets:
      - chuspa_root_password
    volumes:
      - chuspa_data:/data
    read_only: true
    cap_drop: ["ALL"]
    security_opt: ["no-new-privileges:true"]

secrets:
  chuspa_root_password:
    file: ./secrets/chuspa_root_password

volumes:
  chuspa_data:`,
  },
  {
    key: 'curl',
    tab: 'cURL / REST',
    title: 'Petición REST con cURL, firmada con SigV4',
    code: `# Toda petición va firmada: el motor rechaza las anónimas.
# Empacar en la Chuspa (ve subi)
curl -X PUT -T "./archivo.pdf" \\
  --aws-sigv4 "aws:amz:${REGION}:s3" \\
  --user "$TU_CLAVE_DEL_PARCHAO:$TU_SECRETA_DE_LA_CUADRA" \\
  "${ENDPOINT}/${DEFAULT_CHUSPA}/test/archivo.pdf"

# Sacar de la Chuspa (ve baja)
curl -O --aws-sigv4 "aws:amz:${REGION}:s3" \\
  --user "$TU_CLAVE_DEL_PARCHAO:$TU_SECRETA_DE_LA_CUADRA" \\
  "${ENDPOINT}/${DEFAULT_CHUSPA}/test/archivo.pdf"`,
  },
];

// El secreto debe tener 32 caracteres o más.
export const DOCKER_RUN = `docker run -p 127.0.0.1:9000:9000 -e CHUSPA_ROOT_USER=mi-llave -e CHUSPA_ROOT_PASSWORD="$SECRETO" ${IMAGE}`;
