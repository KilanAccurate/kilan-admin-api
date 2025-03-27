import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor(@Inject('Cloudinary') private cloudinary) { }

    async uploadImageMasuk(file: Express.Multer.File): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: 'uploads/masuk' }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }).end(file.buffer);
        });
    }
    async uploadImageKeluar(file: Express.Multer.File): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: 'uploads/keluar' }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }).end(file.buffer);
        });
    }
}
