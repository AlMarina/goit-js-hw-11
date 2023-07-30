import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38535575-2b05e44024ae670a115fb0cfb';


export default async function searchImages(name, page) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

