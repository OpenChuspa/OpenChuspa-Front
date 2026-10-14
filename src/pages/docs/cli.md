---
layout: ../../layouts/DocsLayout.astro
title: CLI ve
description: La CLI de OpenChuspa con direcciones chuspa://.
---

# CLI ve

`ve` traduce comandos cortos a llamadas S3. Funciona con OpenChuspa y con cualquier servicio compatible con S3. Se descarga con cada release, junto al motor (ver [Instalación](/docs/instalacion/)).

## Configuración

```bash
export AWS_ACCESS_KEY_ID=mi-llave
export AWS_SECRET_ACCESS_KEY="$SECRETO"
export VE_ENDPOINT=http://localhost:9000      # valor por defecto
export VE_REGION=cali-san-antonio-1           # o AWS_REGION; este es el valor por defecto
```

Si el endpoint usa HTTP fuera de loopback, `ve` avisa que el contenido viaja sin cifrar.

## Comandos

| `ve` | Equivalente en AWS CLI |
|---|---|
| `ve mira chuspa://` | `aws s3 ls` |
| `ve mira chuspa://chuspa/prefijo/ [-r]` | `aws s3 ls [--recursive]` |
| `ve crea chuspa://chuspa` | `aws s3 mb` |
| `ve subi <archivo>... [a] chuspa://chuspa/key` | `aws s3 cp` |
| `ve baja chuspa://chuspa/key [destino]` | `aws s3 cp` |
| `ve borra chuspa://chuspa/key` | `aws s3 rm` |
| `ve borra chuspa://chuspa/prefijo -r` | `aws s3 rm --recursive` |
| `ve borra chuspa://chuspa [-r]` | `aws s3 rb [--force]` |
| `ve sincroniza <carpeta> chuspa://...` (y al revés) | `aws s3 sync`, sin borrar en el destino |
| `ve version`, `ve ayuda` | |

También se aceptan direcciones `s3://`.

## Ejemplos

```bash
ve crea chuspa://feria-de-cali
ve subi ./cancion.mp3 a chuspa://feria-de-cali/musica/
ve mira chuspa://feria-de-cali/musica/
ve baja chuspa://feria-de-cali/musica/cancion.mp3 .
ve sincroniza ./fotos chuspa://feria-de-cali/fotos/
ve borra chuspa://feria-de-cali -r
```

## Comportamiento

- **`subi`:** si el destino termina en `/`, la key es ese prefijo más el nombre del archivo. Desde 64 MiB, el archivo sube en partes; si algo falla, la subida se aborta en el servidor.
- **`baja`:** escribe primero en un temporal y lo renombra al terminar, así que una descarga interrumpida nunca deja un archivo a medias.
- **`sincroniza`:** copia lo que falta o cambió, comparando tamaño y fecha como `aws s3 sync`, y nunca borra en el destino. Al bajar, se saltan con un aviso las keys que se saldrían de la carpeta, como `../../etc/passwd`.
- **Errores:** dicen qué hacer, por ejemplo que la chuspa no existe, que no está vacía, que las credenciales fueron rechazadas o que el motor no responde en el endpoint.
