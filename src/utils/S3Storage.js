const aws = require('aws-sdk');
const sharp = require('sharp');

const client = new aws.S3();

module.exports = {
    async saveFile(buffer, path, contentType) {
        if (!contentType) {
            throw new Error('content type was not set');
        }

        let key = path;
        let fileContent;
        const type = contentType.split('/')[0];
        if (type === 'image') {
            fileContent = await sharp(buffer)
                .jpeg({ mozjpeg: true })
                .toBuffer();
            key = key + '.jpg';
        } else {
            throw new Error('Only images are supported');
        }

        await client.putObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ACL: 'public-read',
            Body: fileContent,
            // ContentType,
        }).promise();

        return {
            url: process.env.AWS_BUCKET_URL + key,
            key,
        };
    },
    async deleteFile(key) {
        await client.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        }).promise();
    }
}