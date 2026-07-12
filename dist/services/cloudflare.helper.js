import { PutObjectCommand } from '@aws-sdk/client-s3';
import r2 from '../config/r2.js';
import { envConfig } from '../config/config.js';
const cloudFlareHelper = async (file) => {
    //return cloudflare LINK TODO
    const fileName = `cv/${crypto.randomUUID()}-${file.originalname}`;
    await r2.send(new PutObjectCommand({
        Bucket: envConfig.R2_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=31536000, s-maxage=31536000, immutable',
    }));
    return `${envConfig.R2_PUBLIC_URL}/${fileName}`;
};
export default cloudFlareHelper;
