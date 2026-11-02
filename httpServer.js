import { createServer } from 'node:http';
import { readFile } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const PORT = 3000;
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const homePagePath = path.join(currentDirectory, 'public', 'index.html');

const cartItems = [
  { id: 1, productName: 'Notebook', price: 80, quantity: 2, category: 'Stationery' },
  { id: 2, productName: 'Pen Set', price: 120, quantity: 1, category: 'Stationery' },
  { id: 3, productName: 'Water Bottle', price: 350, quantity: 1, category: 'Accessories' }
];

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}

function validateProduct(product) {
  if (!product || typeof product !== 'object' || Array.isArray(product)) {
    return 'Request body must be a JSON object.';
  }

  const { id, productName, price, quantity, category } = product;

  if (!Number.isInteger(id) || id <= 0) {
    return 'id must be a positive integer.';
  }
  if (typeof productName !== 'string' || productName.trim() === '') {
    return 'productName must be a non-empty string.';
  }
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
    return 'price must be a non-negative number.';
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return 'quantity must be a positive integer.';
  }
  if (typeof category !== 'string' || category.trim() === '') {
    return 'category must be a non-empty string.';
  }

  return null;
}

function handleAddToCart(request, response) {
  let body = '';

  request.on('data', (chunk) => {
    body += chunk;
  });

  request.on('error', () => {
    sendJson(response, 400, { message: 'Unable to read request body.' });
  });

  request.on('end', () => {
    let product;

    try {
      product = JSON.parse(body);
    } catch {
      sendJson(response, 400, { message: 'Invalid JSON in request body.' });
      return;
    }

    const validationError = validateProduct(product);
    if (validationError) {
      sendJson(response, 400, { message: validationError });
      return;
    }

    if (cartItems.some((item) => item.id === product.id)) {
      sendJson(response, 409, { message: 'A product with this id already exists.' });
      return;
    }

    const newProduct = {
      id: product.id,
      productName: product.productName.trim(),
      price: product.price,
      quantity: product.quantity,
      category: product.category.trim()
    };

    cartItems.push(newProduct);
    sendJson(response, 201, { message: 'Product added to cart.', product: newProduct });
  });
}

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  if (request.method === 'GET' && requestUrl.pathname === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end('<h1>Welcome to the Shopping Cart Application</h1>');
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/cart') {
    sendJson(response, 200, cartItems);
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/about') {
    sendJson(response, 200, {
      application: 'Shopping Cart Application',
      description: 'A Node.js HTTP server created for the MT1 practical exam.',
      port: PORT
    });
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/home') {
    readFile(homePagePath, 'utf8', (error, html) => {
      if (error) {
        sendJson(response, 500, { message: 'Unable to read the home page file.' });
        return;
      }

      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(html);
    });
    return;
  }

  if (request.method === 'POST' && requestUrl.pathname === '/add-to-cart') {
    handleAddToCart(request, response);
    return;
  }

  sendJson(response, 404, { message: 'Route not found.' });
});

server.listen(PORT, () => {
  console.log(`HTTP server is running at http://localhost:${PORT}`);
});
