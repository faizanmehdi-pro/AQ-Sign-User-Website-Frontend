import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

const api = axios.create({
  baseURL: baseURL,
});

export const CleanDocument = async (fileData) => {
  try {
    console.log("fileData", fileData);

    if (!fileData.region || !fileData.file_url) {
      throw new Error('Missing required fields: region or file_url');
    }

    const response = await api.post('clean_document/', {
      region: fileData.region,
      file_url: fileData.file_url,
    });

    return response.data;
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response ? error.response.data : null,
      request: error.request ? error.request : null,
      config: error.config,
    });

    // Customize your error message based on the error type
    if (error.response) {
      throw new Error(`Server responded with status ${error.response.status}: ${error.response.data}`);
    } else if (error.request) {
      throw new Error('No response from server. Please try again later.');
    } else {
      throw new Error(`Error in setup: ${error.message}`);
    }
  }
};
