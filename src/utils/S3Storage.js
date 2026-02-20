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
            
            Body: buffer,
            ContentType: contentType ? contentType : undefined,
        }).promise();

        console.log(`File saved to S3 with key: ${key}`);
        console.log(`Accessible at: ${process.env.AWS_BUCKET_URL + key}`);

        return {
            url: process.env.AWS_BUCKET_URL + key,
            key,
        };
    },

    /**
     * Saves a profile picture, resizing it to 256x256
     * @param {Buffer} buffer image data
     * @param {string} key should not include file extension
     * @param {string} mimeType 
     */
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

    /**
     * Saves a regular picture, with a max width or height of 2000px.
     * @param {Buffer} buffer image data
     * @param {string} key should not include file extension
     * @param {string} mimeType 
     */
    async savePicture(buffer, key, mimeType) {
        const type = mimeType.split('/')[0];
        if (type === 'image') {
            const fileContent = await sharp(buffer)
                .resize(2000, 2000, {
                    fit: "inside",
                    withoutEnlargement: true,
                })
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
    },

    async deleteFiles(keys) {
        await client.deleteObjects({
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: {
                Objects: keys.map(key => ({ Key: key }))
            }
        }).promise();
    }
}