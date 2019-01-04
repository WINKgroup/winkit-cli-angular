// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  BASE_SERVER_URL: 'http://localhost:1337/',
  BASE_URL: 'http://localhost:5000/',
  COMPANY_NAME: 'Wink S.r.l.',
  APP_NAME: 'Winkit',
  ANALYTICS_UA_ID: '',
  DEFAULT_LANGUAGE: 'en',
  CURRENCY: '€',
  isFirebase: false,
  production: false
};
