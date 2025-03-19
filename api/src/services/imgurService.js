// import axios from 'axios';
// import { IMGUR_CLIENT_ID } from '@env';

// const uploadImageToImgur = async (imageUri) => {
//   const formData = new FormData();
//   formData.append('image', {
//     uri: imageUri,
//     type: 'image/jpeg', // or 'image/png' based on your image
//     name: 'uploaded_image.jpg',
//   });

//   try {
//     const response = await axios.post('https://api.imgur.com/3/image', formData, {
//       headers: {
//         Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     console.log('Uploaded Image URL:', response.data.data.link);
//     return response.data.data.link; // URL of the uploaded image
//   } catch (error) {
//     console.error('Image upload failed:', error.response || error.message);
//     throw error;
//   }
// };

import axios from 'axios';
// import { IMGUR_CLIENT_ID } from '@env';

export const uploadImageToImgur = async (imageUri) => {
  try {
    const response = await axios.post(
      'https://api.imgur.com/3/image',
      {
        image: imageUri, // Provide the remote image URL directly
        type: 'url',     // Specify the type as 'url'
      },
      {
        headers: {
          Authorization: `Client-ID a6de6fc903fe795`,
        },
      }
    );
    console.log('Uploaded Image URL:', response.data.data.link);
    return response.data.data.link; // URL of the uploaded image
  } catch (error) {
    console.error('Image upload failed:', error.response || error.message);
    throw error;
  }
};
