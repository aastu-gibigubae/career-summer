import { S3Client } from '@aws-sdk/client-s3';
import { envConfig } from './config.js';
const r2 = new S3Client({
    region: 'auto',
    endpoint: envConfig.R2_LINK,
    credentials: {
        accessKeyId: envConfig.R2_ACCESS_KEY_ID,
        secretAccessKey: envConfig.R2_SECRET_ACCESS_KEY,
    },
});
export default r2;
