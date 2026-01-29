import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';

@Injectable()
export class FileUploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
    this.region = process.env.S3_REGION;
    this.bucketName = process.env.S3_BUCKET;
  }

  async uploadFile(file: Express.Multer.File, type: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const { originalname, buffer, mimetype } = file;
    const ext = path.extname(originalname);
    const key = `${type}/${Date.now().toString()}${ext}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    });

    await this.s3Client.send(command);
    // return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    return key;
  }

  async uploadPdfToS3(buffer: Buffer, pdfType: string): Promise<string> {
    try {
      const key = `${pdfType}/${Date.now().toString()}.pdf`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: 'application/pdf',
      });

      await this.s3Client.send(command);
      return key;
    } catch (err) {
      console.error(err);
    }
  }
}
