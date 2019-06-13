import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV;
const jwtSecret = process.env.TOKEN_KEY;
const mailerEmail = process.env.MAILER_EMAIL;
const mailerToken = process.env.MAILER_API_KEY;
const baseUrl = process.env.API_BASE_URL;

const environnements = [
  {
    name: 'test',
    port,
    dbUrl: process.env.TEST_DB_URL,
    secret: jwtSecret,
    mailerEmail,
    baseUrl,
  },
  {
    name: 'development',
    port,
    dbUrl: process.env.DEV_DB_URL,
    secret: jwtSecret,
    mailerEmail,
    mailerToken,
    baseUrl,
  },
  {
    name: 'production',
    port,
    dbUrl: process.env.DB_URL,
    secret: jwtSecret,
    mailerEmail,
    mailerToken,
    baseUrl,
  },
  {
    name: 'stagging',
    port,
    dbUrl: process.env.DB_URL,
    secret: jwtSecret,
    mailerEmail,
    mailerToken,
    baseUrl,
  }
];


const currentEnv = environnements.find(el => el.name === env.toLocaleLowerCase());
export default { currentEnv, env };