import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

const api = axios.create({
  baseURL: baseURL,
});

export const uploadDocument = async (upload) => {
  try {
    let formData = new FormData();
    formData.append('file', upload.file);

    // Sending the formData as the body of the POST request
    const response = await api.post('upload_pdf/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Return the successful response data
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle errors returned by the server
      console.error('Server response error:', error.response.data);
    } else if (error.request) {
      // Handle errors when no response is received from the server
      console.error('No response from server:', error.request);
    } else {
      // Handle other errors (like incorrect config)
      console.error('Error in setup:', error.message);
    }
    
    // Throw the error again for higher-level error handling if needed
    throw error;
  }
};
