// URL pública do site, usada nos metadados (links absolutos para as imagens de compartilhamento).
// Em produção, defina NEXT_PUBLIC_SITE_URL; na Vercel, cai no domínio de produção do projeto.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');
