/* prefixo para ficheiros de /public quando o site vive numa subpasta (GitHub Pages) */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${BASE}${path}`;
