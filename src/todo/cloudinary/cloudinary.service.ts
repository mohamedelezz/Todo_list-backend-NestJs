import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { Express } from 'express';
import { UpdateTodoDto } from '../dto/updateTdo.dto';

@Injectable()
export class CloudinaryService {

  // upload image to cloudinary
  async uploadImage(file: Express.Multer.File,): Promise<UploadApiResponse | UploadApiErrorResponse> {

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  // update image in cloudinary
  async updateImage(file: Express.Multer.File, todo: UpdateTodoDto): Promise<any> {
    const { imageId } = todo;
    // delete old image
   await this.deleteImage({ imageId });
    // upload new image
    return await this.uploadImage(file);
  }

// delete image from cloudinary
  async deleteImage(imageIdd: any): Promise<any> {
    const { imageId } = imageIdd;
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(imageId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
