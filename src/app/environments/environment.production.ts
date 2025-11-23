export const environment = {
  production: true,
  apiUrl: 'https://api.mikhailbahdashych.me/api',
  staticStorage: 'https://bahdashych-on-security.s3.eu-central-1.amazonaws.com',
  basicAuth: {
    username: process.env['BASIC_AUTH_USERNAME'],
    password: process.env['BASIC_AUTH_PASSWORD']
  }
};
