// Valores compartidos entre el markup (build) y los scripts del navegador.
// El motor es self-hosted: no hay un endpoint público, cada quien corre el suyo.
export const ENDPOINT = 'http://localhost:9000';
export const REGION = 'cali-san-antonio-1';
export const DEFAULT_CHUSPA = 'prod-chuspa-name';
export const CLI_VERSION = 'v0.2.0';
// Imagen pública del motor en Docker Hub (también en ghcr.io/openchuspa/chuspa).
export const IMAGE = 'openchuspa/chuspa:0.2.0';
export const PROMPT = 'caleño@openchuspa:~$';
