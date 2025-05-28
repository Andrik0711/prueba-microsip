// src/api/kladiApi.ts
import axios from 'axios';

const kladiApi = axios.create({
  baseURL: 'https://catalogo-kladi.dev.rombo.microsipnube.com/',
});

export const fetchProducts = async () => {
  const response = await kladiApi.get('/');
  if (response.status !== 200) {
    throw new Error('Error fetching products');
  }
  return response.data;
};
