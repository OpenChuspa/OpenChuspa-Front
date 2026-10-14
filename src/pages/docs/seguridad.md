---
layout: ../../layouts/DocsLayout.astro
title: Seguridad
description: Modelo de seguridad de OpenChuspa, TLS, rotación de credenciales y cómo reportar vulnerabilidades.
---

# Seguridad

OpenChuspa guarda datos de otras personas, así que cada decisión por defecto es la segura.

## Lo que hace por defecto

- **No arranca abierto:** sin credenciales, con un secreto de menos de 32 caracteres o en modo anónimo fuera de loopback, se niega a arrancar.
- **Verifica cada firma:** SigV4 por header, con una ventana de 15 minutos y comparaciones en tiempo constante. También verifica la firma de cada chunk de los cuerpos `aws-chunked` y cada checksum declarado; si algo no coincide, el objeto no se guarda.
- **Frena la fuerza bruta:** 20 autenticaciones fallidas en un minuto desde una IP la bloquean 5 minutos, con `503 SlowDown`.
- **Las keys nunca son rutas:** el contenido se guarda con nombres aleatorios generados por el servidor, así que una key como `../../etc/passwd` no puede escribir fuera de la carpeta de datos.
- **Nunca un éxito falso:** lo que no está implementado responde `501`, y un header que pida algo que el motor no hace (ACL pública, cifrado, object lock) se rechaza en lugar de ignorarse.
- **Logs sin secretos:** no se registran headers ni la query. El CI lo verifica en cada cambio.
- **Imagen mínima:** distroless, sin shell, como usuario sin privilegios, compatible con un sistema de archivos de solo lectura y sin capabilities.

## TLS

Fuera de loopback, el motor necesita TLS: el propio o el de un proxy delante. Sin ninguno de los dos, lo avisa en el log al arrancar.

```yaml
    environment:
      CHUSPA_TLS_CERT_FILE: /run/secrets/tls_cert
      CHUSPA_TLS_KEY_FILE: /run/secrets/tls_key
```

El mínimo es TLS 1.2. El certificado se vuelve a leer cuando cambia en disco, así que una renovación (Let's Encrypt, cert-manager) no requiere reiniciar. Si el archivo nuevo no carga, se sigue sirviendo el anterior.

Detrás de un proxy, el bloqueo por fuerza bruta ve la IP del proxy: un ataque bloquea a todos durante 5 minutos. Se prefiere eso a dejar probar llaves sin límite. Si el proxy ya limita intentos, se puede ajustar con `CHUSPA_AUTH_MAX_FAILURES`.

## Rotar el secreto sin cortar el servicio

1. Generá el nuevo: `openssl rand -hex 24`.
2. Poné el nuevo en `CHUSPA_ROOT_PASSWORD` y el actual en `CHUSPA_ROOT_PASSWORD_PREVIOUS`. Reiniciá el motor: acepta los dos.
3. Cambiá el secreto en todos los clientes.
4. Quitá `CHUSPA_ROOT_PASSWORD_PREVIOUS` y reiniciá.

Mientras haya un secreto anterior configurado, el log lo recuerda al arrancar.

## Cadena de suministro

- Cada release publica la imagen firmada con cosign sin llaves, con SBOM y provenance, y los binarios con sus sumas SHA-256 firmadas. Para verificarlas, ver [Instalación](/docs/instalacion/#verificar-la-imagen).
- Las dependencias pasan por `govulncheck` y por una revisión de licencias en cada cambio, y las actions del CI están fijadas por SHA.
- Cada noche corre fuzzing de los analizadores de entrada no confiable: firmas, cuerpos `aws-chunked` y rangos.

## Lo que le toca a quien opera

- **La credencial raíz tiene acceso total:** guardala en un gestor de secretos y rotala con el procedimiento de arriba.
- **Cifrado en reposo:** se delega al volumen (LUKS, EBS o discos cifrados del proveedor).
- **Acceso al volumen de datos:** solo el motor debe poder escribir en la carpeta de datos. La verificación periódica detecta cualquier cambio de contenido.

## Reportar una vulnerabilidad

No abras un issue público. Usá el reporte privado de GitHub: pestaña **Security** del repositorio [OpenChuspa-core](https://github.com/OpenChuspa/OpenChuspa-core), botón **Report a vulnerability**. Compromisos de atención: acuse de recibo en 72 horas, evaluación en 7 días y corrección con divulgación coordinada en un máximo de 90 días.
