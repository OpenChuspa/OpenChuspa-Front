import { localizePath, type Lang } from '../i18n/ui';

// Orden de la documentación: el menú lateral y los enlaces anterior/siguiente.
const pages: [slug: string, es: string, en: string][] = [
  ['', 'Introducción', 'Introduction'],
  ['instalacion/', 'Instalación', 'Installation'],
  ['configuracion/', 'Configuración', 'Configuration'],
  ['clientes/', 'Clientes y SDK', 'Clients and SDKs'],
  ['cli/', 'CLI ve', 've CLI'],
  ['operacion/', 'Operación y respaldo', 'Operations and backup'],
  ['monitoreo/', 'Monitoreo', 'Monitoring'],
  ['seguridad/', 'Seguridad', 'Security'],
  ['compatibilidad/', 'Compatibilidad con S3', 'S3 compatibility'],
];

export function docsNav(lang: Lang) {
  return pages.map(([slug, es, en]) => ({ href: localizePath(`/docs/${slug}`, lang), label: lang === 'en' ? en : es }));
}
