import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';

let gfs;

export const initializeGridFS = () => {
  return new Promise((resolve, reject) => {
    if (mongoose.connection.readyState === 1) {
      try {
        gfs = new GridFSBucket(mongoose.connection.db, {
          bucketName: 'images'
        });
        console.log('GridFS initialized successfully');
        resolve(gfs);
      } catch (error) {
        console.error('Error initializing GridFS:', error);
        reject(error);
      }
    } else {
      const error = new Error('MongoDB connection is not ready');
      console.error(error.message);
      reject(error);
    }
  });
};

export const uploadToGridFS = (buffer, filename, contentType) => {
  return new Promise((resolve, reject) => {
    if (!gfs) {
      return reject(new Error('GridFS is not initialized'));
    }

    console.log(`Uploading file: ${filename}, Content-Type: ${contentType}, Buffer length: ${buffer.length}`);

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    const uploadStream = gfs.openUploadStream(filename, {
      contentType: contentType
    });

    readableStream.pipe(uploadStream);

    uploadStream.on('error', (error) => {
      console.error('Error during file upload:', error);
      reject(error);
    });

    uploadStream.on('finish', (file) => {
      if (!file || !file._id) {
        console.error('File upload finished, but file object is invalid:', file);
        reject(new Error('File upload failed: Invalid file object returned'));
      } else {
        console.log(`File uploaded successfully. ID: ${file._id}`);
        resolve(file._id);
      }
    });
  });
};

export const getFileFromGridFS = (fileId) => {
  if (!gfs) {
    throw new Error('GridFS is not initialized');
  }
  return gfs.openDownloadStream(new mongoose.Types.ObjectId(fileId));
};

