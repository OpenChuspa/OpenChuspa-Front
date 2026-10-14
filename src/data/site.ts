import type { icons } from 'lucide';
import { CLI_VERSION, DEFAULT_CHUSPA, ENDPOINT, IMAGE, REGION } from './constants';
import { localizePath, type Lang } from '../i18n/ui';

type IconName = keyof typeof icons;

// Lo que no depende del idioma.
export const quickCommands = [
  { label: 've mira chuspa://', cmd: 've mira chuspa://' },
  { label: 've crea chuspa://feria-de-cali', cmd: 've crea chuspa://feria-de-cali' },
  { label: 've subi ./cancion.mp3', cmd: `ve subi ./cancion.mp3 a chuspa://${DEFAULT_CHUSPA}/music/` },
  { label: 've baja chuspa://...', cmd: `ve baja chuspa://${DEFAULT_CHUSPA}/music/cancion.mp3 .` },
];

export const DOCKER_RUN = `docker run -p 127.0.0.1:9000:9000 -e CHUSPA_ROOT_USER=mi-llave -e CHUSPA_ROOT_PASSWORD="$SECRETO" ${IMAGE}`;

const text = {
  es: {
    nav: [
      ['/docs/', 'Documentación', 'Docs'],
      ['/#playground', 'Terminal', 'Terminal'],
      ['/#comandos', 'Comandos CLI', 'CLI'],
      ['/#glosario', 'Glosario', 'Glosario'],
      ['/#sdks', 'SDKs', 'SDKs'],
    ],
    commands: [
      'Sube uno o varios archivos locales a una chuspa.',
      'Descarga un objeto de una chuspa a tu directorio.',
      'Crea una chuspa nueva.',
      'Lista las chuspas o el contenido de una.',
      'Borra un objeto, un prefijo o una chuspa vacía.',
      'Sincroniza una carpeta con una chuspa, en cualquier sentido.',
    ],
    glossary: [
      'El contenedor donde se guardan los objetos: el equivalente a un bucket.',
      'Cualquier archivo guardado en una chuspa, con su key, sus metadatos y su checksum.',
      'El identificador público de la credencial (Access Key ID).',
      'La parte privada de la credencial: mínimo 32 caracteres y nunca en un repositorio.',
      `La dirección de tu motor. En local: ${ENDPOINT}.`,
      `La región que reporta el motor y exige en la firma: ${REGION}.`,
      'Usuarios y políticas por chuspa. Está en el roadmap; hoy hay una credencial raíz.',
      'El servidor S3 de un solo nodo: durable ante caídas, verificable y seguro por defecto.',
    ],
    gen: ['Subir', 'Descargar', 'Crear chuspa', 'Listar', 'Borrar'],
    sdkTitles: [
      'Python (boto3) configurado para OpenChuspa',
      'Node.js (@aws-sdk/client-s3) para OpenChuspa',
      'Go (aws-sdk-go-v2) para OpenChuspa',
      'Docker Compose de un nodo, endurecido',
      'Petición REST con curl, firmada con SigV4',
    ],
    c: {
      connect: 'Conexión al motor',
      upload: 'Subir un archivo a la chuspa',
      uploaded: 'Archivo guardado en la chuspa.',
      path: 'el motor direcciona por ruta: /chuspa/key',
      init: 'Cliente apuntando al endpoint de OpenChuspa',
      connected: 'Conectado a OpenChuspa.',
      secret: 'El secreto vive en un archivo, no en este YAML:',
      signed: 'Toda petición va firmada: el motor rechaza las anónimas.',
      put: 'Subir (ve subi)',
      get: 'Descargar (ve baja)',
      key: 'TU_CLAVE_DEL_PARCHAO',
      secretVar: 'TU_SECRETA_DE_LA_CUADRA',
    },
  },
  en: {
    nav: [
      ['/docs/', 'Documentation', 'Docs'],
      ['/#playground', 'Terminal', 'Terminal'],
      ['/#comandos', 'CLI commands', 'CLI'],
      ['/#glosario', 'Glossary', 'Glossary'],
      ['/#sdks', 'SDKs', 'SDKs'],
    ],
    commands: [
      'Uploads one or more local files to a chuspa.',
      'Downloads an object from a chuspa to your directory.',
      'Creates a new chuspa.',
      'Lists chuspas or the contents of one.',
      'Deletes an object, a prefix or an empty chuspa.',
      'Syncs a folder with a chuspa, in either direction.',
    ],
    glossary: [
      'The container where objects are stored: the equivalent of a bucket.',
      'Any file stored in a chuspa, with its key, metadata and checksum.',
      'The public identifier of the credential (Access Key ID).',
      'The private part of the credential: at least 32 characters and never in a repository.',
      `The address of your engine. Locally: ${ENDPOINT}.`,
      `The region the engine reports and requires in the signature: ${REGION}.`,
      'Users and per-chuspa policies. On the roadmap; today there is one root credential.',
      'The single-node S3 server: crash-safe, verifiable and secure by default.',
    ],
    gen: ['Upload', 'Download', 'Create chuspa', 'List', 'Delete'],
    sdkTitles: [
      'Python (boto3) configured for OpenChuspa',
      'Node.js (@aws-sdk/client-s3) for OpenChuspa',
      'Go (aws-sdk-go-v2) for OpenChuspa',
      'Hardened single-node Docker Compose',
      'REST request with curl, signed with SigV4',
    ],
    c: {
      connect: 'Connect to the engine',
      upload: 'Upload a file to the chuspa',
      uploaded: 'File stored in the chuspa.',
      path: 'the engine uses path-style addressing: /chuspa/key',
      init: 'Client pointing at the OpenChuspa endpoint',
      connected: 'Connected to OpenChuspa.',
      secret: 'The secret lives in a file, not in this YAML:',
      signed: 'Every request is signed: the engine rejects anonymous ones.',
      put: 'Upload (ve subi)',
      get: 'Download (ve baja)',
      key: 'YOUR_ACCESS_KEY',
      secretVar: 'YOUR_SECRET_KEY',
    },
  },
} as const;

export function siteData(lang: Lang) {
  const t = text[lang];
  const c = t.c;

  const navLinks = t.nav.map(([href, label, short]) => ({ href: localizePath(href, lang), label, short }));

  const highlights = [
    { label: 'hl.license', value: 'Apache-2.0', accent: false },
    { label: 'hl.api', value: 'AWS S3', accent: false },
    { label: 'hl.version', value: CLI_VERSION, accent: true },
  ] as const;

  const commandDefs: { name: string; badge: string; icon: IconName; example: string; danger?: boolean }[] = [
    { name: 've subi', badge: 'PUT / Upload', icon: 'UploadCloud', example: `ve subi ./file.txt a chuspa://${DEFAULT_CHUSPA}/test/` },
    { name: 've baja', badge: 'GET / Download', icon: 'DownloadCloud', example: `ve baja chuspa://${DEFAULT_CHUSPA}/test/file.txt .` },
    { name: 've crea', badge: 'MB / Create Bucket', icon: 'FolderPlus', example: 've crea chuspa://mi-nueva-chuspa' },
    { name: 've mira', badge: 'LS / List', icon: 'List', example: `ve mira chuspa://${DEFAULT_CHUSPA}/` },
    { name: 've borra', badge: 'RM / Delete', icon: 'Trash2', example: `ve borra chuspa://${DEFAULT_CHUSPA}/test/file.txt`, danger: true },
    { name: 've sincroniza', badge: 'SYNC / Mirror', icon: 'RefreshCw', example: 've sincroniza ./mis-fotos chuspa://backup-chuspa/' },
  ];
  const commands = commandDefs.map((d, i) => ({ ...d, description: t.commands[i] }));

  const glossary = [
    ['Bucket', 'Chuspa'],
    ['Object', 'Chuchería'],
    ['Access Key ID', 'Clave del Parchao'],
    ['Secret Key', 'La Secreta de la Cuadra'],
    ['Endpoint', 'La Esquina'],
    ['Region', 'Sucursal del Cielo'],
    ['IAM / Policy', 'Reglamento del Parche'],
    ['Server', 'Motor Caleño'],
  ].map(([aws, term], i) => ({ aws, term, description: t.glossary[i] }));

  const generatorActions = ['subi', 'baja', 'crea', 'mira', 'borra'].map((value, i) => ({
    value,
    label: `ve ${value} (${t.gen[i]})`,
  }));

  const sdkSnippets = [
    {
      key: 'python',
      tab: 'Python (boto3)',
      code: `import boto3

# ${c.connect}
s3 = boto3.client(
    's3',
    endpoint_url='${ENDPOINT}',
    aws_access_key_id='${c.key}',
    aws_secret_access_key='${c.secretVar}',
    region_name='${REGION}'
)

# ${c.upload} (ve subi)
s3.upload_file('./archivo.png', '${DEFAULT_CHUSPA}', 'test/archivo.png')
print("${c.uploaded}")`,
    },
    {
      key: 'node',
      tab: 'Node.js (@aws-sdk)',
      code: `import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: "${ENDPOINT}",
  region: "${REGION}",
  forcePathStyle: true, // ${c.path}
  credentials: {
    accessKeyId: "${c.key}",
    secretAccessKey: "${c.secretVar}",
  },
});

// ${c.upload}
await s3.send(new PutObjectCommand({
  Bucket: "${DEFAULT_CHUSPA}",
  Key: "test/musica.mp3",
  Body: fileBuffer,
}));
console.log("${c.uploaded}");`,
    },
    {
      key: 'go',
      tab: 'Go (aws-sdk-go)',
      code: `package main

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
                "${c.key}", "${c.secretVar}", "",
            ),
        ),
    )

    // ${c.init}
    client := s3.NewFromConfig(cfg, func(o *s3.Options) {
        o.BaseEndpoint = aws.String("${ENDPOINT}")
        o.UsePathStyle = true
    })

    _ = client
    fmt.Println("${c.connected}")
}`,
    },
    {
      key: 'docker',
      tab: 'Docker Compose',
      code: `# ${c.secret}
#   mkdir -p secrets && openssl rand -hex 24 > secrets/chuspa_root_password
services:
  chuspa:
    image: ${IMAGE}
    ports:
      - "127.0.0.1:9000:9000"
    environment:
      CHUSPA_ROOT_USER: "${c.key}"
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
      code: `# ${c.signed}
# ${c.put}
curl -X PUT -T "./archivo.pdf" \\
  --aws-sigv4 "aws:amz:${REGION}:s3" \\
  --user "$${c.key}:$${c.secretVar}" \\
  "${ENDPOINT}/${DEFAULT_CHUSPA}/test/archivo.pdf"

# ${c.get}
curl -O --aws-sigv4 "aws:amz:${REGION}:s3" \\
  --user "$${c.key}:$${c.secretVar}" \\
  "${ENDPOINT}/${DEFAULT_CHUSPA}/test/archivo.pdf"`,
    },
  ].map((s, i) => ({ ...s, title: t.sdkTitles[i] }));

  return { navLinks, highlights, commands, glossary, generatorActions, sdkSnippets };
}
