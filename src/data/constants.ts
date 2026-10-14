// Valores compartidos entre el markup (build) y los scripts del navegador.
// El motor es self-hosted: no hay un endpoint público, cada quien corre el suyo.
export const ENDPOINT = 'http://localhost:9000';
export const REGION = 'cali-san-antonio-1';
export const DEFAULT_CHUSPA = 'prod-chuspa-name';
export const VERSION = '1.0.0';
export const CLI_VERSION = `v${VERSION}`;
// Imagen pública del motor en Docker Hub (también en ghcr.io/openchuspa/chuspa).
export const IMAGE = `openchuspa/chuspa:${VERSION}`;
export const PROMPT = 'caleño@openchuspa:~$';
