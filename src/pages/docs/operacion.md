---
layout: ../../layouts/DocsLayout.astro
title: Operación y respaldo
description: Cómo guarda los datos OpenChuspa, cómo respaldarlos, verificarlos y recuperarlos.
---

# Operación y respaldo

## Cómo guarda los datos

```text
<CHUSPA_DATA_DIR>/
  meta.db               índice: chuspas, objetos y subidas multipart
  blobs/ab/cd/<id>      contenido, con un nombre aleatorio generado por el servidor
  blobs/ab/cd/<id>.meta chuspa, key y metadatos del objeto
  chuspas/<nombre>      una marca por chuspa
  staging/              escrituras en curso
```

La key de un objeto nunca se usa como ruta de archivo: `../../etc/passwd` es un nombre como cualquier otro. Cada escritura va primero a `staging/`, se sincroniza a disco, se mueve a `blobs/` y solo entonces se confirma en el índice. Una caída deja el objeto anterior o el nuevo, nunca uno a medias. Al arrancar se borran los restos de escrituras interrumpidas.

## Mantenimiento automático

Con el servidor en marcha:

| Cada | Qué hace |
|---|---|
| Hora | Borra blobs sin referencia y aborta subidas multipart más viejas que `CHUSPA_MULTIPART_EXPIRY`. |
| Día | Deja una copia consistente del índice en `meta.db.bak`. |
| Semana (`CHUSPA_SCRUB_INTERVAL`) | Relee todo el contenido y lo compara con su SHA-256; cada objeto dañado queda en el log como error y en la métrica `chuspa_scrub_damaged_objects`. |

## Respaldo

La forma segura de respaldar es copiar la carpeta de datos completa **con el servidor detenido**:

```bash
docker compose stop chuspa
tar -C /ruta/a/los/datos -czf chuspa-$(date +%F).tar.gz .
docker compose start chuspa
```

Restaurar es poner esa carpeta en su lugar y arrancar. Después, `chuspa verify` confirma que todo quedó íntegro.

Si no se puede detener el servidor, copiá `blobs/` y `chuspas/` en caliente (por ejemplo con `rsync` o un snapshot del volumen). Al restaurar esa copia, corré `chuspa rebuild-index` antes de arrancar: arma el índice a partir de lo que quedó copiado, sin depender de un `meta.db` tomado a mitad de una escritura. Lo que se escribió mientras corría la copia puede no estar.

## Si el índice se daña o se pierde

Con el servidor detenido:

```bash
CHUSPA_DATA_DIR=/ruta/a/los/datos chuspa rebuild-index
CHUSPA_DATA_DIR=/ruta/a/los/datos chuspa verify
```

En Docker, con la misma imagen y el mismo volumen:

```bash
docker compose stop chuspa
docker compose run --rm chuspa rebuild-index
docker compose run --rm chuspa verify
docker compose start chuspa
```

`rebuild-index` arma un índice nuevo a partir de los metadatos guardados junto a cada blob y de las marcas de chuspa. No borra nada:

- renombra el índice anterior a `meta.db.reemplazado-<fecha>`;
- aparta en `recuperados/` lo que no puede asignar a un objeto: partes de subidas sin completar y versiones viejas que quedaron por una caída.

Se recuperan todos los objetos y todas las chuspas, también las vacías. Las subidas multipart en curso no se recuperan.

## Verificar el contenido

```bash
CHUSPA_DATA_DIR=/ruta/a/los/datos chuspa verify
```

Relee cada objeto y lo compara con su tamaño y su SHA-256. Sale con error si encuentra algo dañado, y lista cada caso con su chuspa y su key. Un objeto dañado se recupera desde el respaldo.

## Inspeccionar sin la API

Como las keys viven en el índice, los datos no se miran con `ls`. Con el servidor detenido:

```bash
chuspa inspect                                   # chuspas, con cantidad de objetos y bytes
chuspa inspect feria-de-cali test/               # objetos de una chuspa, por prefijo
chuspa export feria-de-cali test/salsa.txt ./salsa.txt
```

## Disco lleno

Por debajo de `CHUSPA_MIN_FREE_MB` libres (1 GiB por defecto), las escrituras responden `507 InsufficientStorage` y las lecturas siguen funcionando. Un disco que se llena de verdad durante una escritura da el mismo error, sin dejar nada a medias.

## Actualizar de versión

1. Respaldá la carpeta de datos con el servidor detenido.
2. Cambiá la imagen o el binario por la versión nueva, con su versión exacta.
3. Arrancá: la versión nueva migra sola el formato de los datos, por ejemplo de 0.1.x y 0.2.x al formato actual.
4. Corré `chuspa verify`.

Una versión vieja se niega a abrir datos de una más nueva, para no dañarlos. La migración desde datos reales de versiones anteriores se prueba en cada cambio.

## Apagado

Con `SIGTERM` (lo que envía `docker stop`), el servidor deja de aceptar conexiones y espera hasta 30 segundos a que terminen las peticiones en curso.
