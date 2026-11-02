import express from 'express';

const app = express();
const PORT = 4000;

const cartItems = [
  { id: 1, productName: 'Notebook', price: 80, quantity: 2, category: 'Stationery' },
  { id: 2, productName: 'Pen Set', price: 120, quantity: 1, category: 'Stationery' },
  { id: 3, productName: 'Water Bottle', price: 350, quantity: 1, category: 'Accessories' }
];

app.use(express.json());

function getProductId(id) {
  const productId = Number(id);
  return Number.isInteger(productId) && productId > 0 ? productId : null;
}

function validateProduct(product, requireId) {
  if (!product || typeof product !== 'object' || Array.isArray(product)) {
    return 'Request body must be a JSON object.';
  }

  const { id, productName, price, quantity, category } = product;

  if (requireId && (!Number.isInteger(id) || id <= 0)) {
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

app.get('/cart', (request, response) => {
  response.status(200).json(cartItems);
});

app.get('/cart/:id', (request, response) => {
  const productId = getProductId(request.params.id);
  const product = cartItems.find((item) => item.id === productId);

  if (!product) {
    response.status(404).json({ message: 'Product not found.' });
    return;
  }

  response.status(200).json({
    ...product,
    totalPrice: product.price * product.quantity
  });
});

app.post('/cart', (request, response) => {
  const validationError = validateProduct(request.body, true);
  if (validationError) {
    response.status(400).json({ message: validationError });
    return;
  }

  if (cartItems.some((item) => item.id === request.body.id)) {
    response.status(409).json({ message: 'A product with this id already exists.' });
    return;
  }

  const newProduct = {
    id: request.body.id,
    productName: request.body.productName.trim(),
    price: request.body.price,
    quantity: request.body.quantity,
    category: request.body.category.trim()
  };

  cartItems.push(newProduct);
  response.status(201).json({ message: 'Product added to cart.', product: newProduct });
});

app.put('/cart/:id', (request, response) => {
  const productId = getProductId(request.params.id);
  const product = cartItems.find((item) => item.id === productId);

  if (!product) {
    response.status(404).json({ message: 'Product not found.' });
    return;
  }

  const validationError = validateProduct(request.body, false);
  if (validationError) {
    response.status(400).json({ message: validationError });
    return;
  }

  product.productName = request.body.productName.trim();
  product.price = request.body.price;
  product.quantity = request.body.quantity;
  product.category = request.body.category.trim();

  response.status(200).json({ message: 'Product updated successfully.', product });
});

app.delete('/cart/:id', (request, response) => {
  const productId = getProductId(request.params.id);
  const productIndex = cartItems.findIndex((item) => item.id === productId);

  if (productIndex === -1) {
    response.status(404).json({ message: 'Product not found.' });
    return;
  }

  const deletedProduct = cartItems.splice(productIndex, 1)[0];
  response.status(200).json({ message: 'Product deleted successfully.', product: deletedProduct });
});

app.use((request, response) => {
  response.status(404).json({ message: 'Route not found.' });
});

app.use((error, request, response, next) => {
  if (error.type === 'entity.parse.failed') {
    response.status(400).json({ message: 'Invalid JSON in request body.' });
    return;
  }

  next(error);
});

app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
});
