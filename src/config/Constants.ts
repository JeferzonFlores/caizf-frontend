export const Constants = {
  baseUrl: process.env['NEXT_PUBLIC_BASE_URL'] ?? '',
  siteName: process.env['NEXT_PUBLIC_SITE_NAME'] ?? '',
  sitePath: process.env['NEXT_PUBLIC_PATH'] ?? '',
  appEnv: process.env['NEXT_PUBLIC_APP_ENV'] ?? '',
  ciudadaniaUrl: process.env['NEXT_PUBLIC_CIUDADANIA_URL'] ?? '',
  firmadorUrl: process.env['NEXT_PUBLIC_FIRMADOR_URL'] ?? '',
  apiOpenStreetMap: 'https://nominatim.openstreetmap.org',
}
