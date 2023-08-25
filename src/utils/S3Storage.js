const aws = require('aws-sdk');
const sharp = require('sharp');

const client = new aws.S3();

module.exports = {
    /**
     * Saves a file directly to S3
     * @param {Buffer} buffer 
     * @param {string} key 
     * @param {string?} contentType 
     */
    async saveFile(buffer, key, contentType) {
        await client.putObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ACL: 'public-read',
            Body: buffer,
            ContentType: contentType ? contentType : undefined,
        }).promise();

        return {
            url: process.env.AWS_BUCKET_URL + key,
            key,
        };
    },

    async saveProfilePicture(buffer, key, mimeType) {
        const type = mimeType.split('/')[0];
        if (type === 'image') {
            const fileContent = await sharp(buffer)
                .resize(256, 256)
                .jpeg({ mozjpeg: true })
                .toBuffer();
            return await this.saveFile(fileContent, key + '.jpg', 'image/jpg');
        } else {
            throw new Error('Only images are supported');
        }
    },

    async deleteFile(key) {
        await client.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        }).promise();
    }
}