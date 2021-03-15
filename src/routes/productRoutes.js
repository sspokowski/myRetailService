import express from 'express';
import ProductController from '../controllers/productController.js';

const router = express.Router();

router.get('/', (request, response) => {
  response.send('Welcome to the myRetail Product Service');
});

router.get('/products/:id', async (request, response) => {
  await ProductController.getProductById(request, response);
});

router.post('/products/:id', async (request, response) => {
  await ProductController.updateProductById(request, response);
});

export default router;
