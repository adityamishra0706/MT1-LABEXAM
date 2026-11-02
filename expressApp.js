import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

// JSON error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON format",
    });
  }
  next(err);
});

let cart = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
    category: "Electronics",
  },
  {
    id: 2,
    productName: "Keyboard",
    price: 1200,
    quantity: 1,
    category: "Electronics",
  },
  {
    id: 3,
    productName: "Notebook",
    price: 100,
    quantity: 5,
    category: "Stationery",
  },
];

// GET all cart items
app.get("/cart", (req, res) => {
  res.status(200).json(cart);
});

// GET cart item by ID
app.get("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }

  const product = cart.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json({
    ...product,
    totalPrice: product.price * product.quantity,
  });
});

// POST add a product
app.post("/cart", (req, res) => {
  const { id, productName, price, quantity, category } = req.body || {};

  if (
    typeof id !== "number" ||
    !Number.isInteger(id) ||
    id <= 0 ||
    typeof productName !== "string" ||
    productName.trim() === "" ||
    typeof price !== "number" ||
    price < 0 ||
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    typeof category !== "string" ||
    category.trim() === ""
  ) {
    return res.status(400).json({
      message: "Invalid product details",
    });
  }

  if (cart.some((item) => item.id === id)) {
    return res.status(400).json({
      message: "Product ID already exists",
    });
  }

  const product = {
    id,
    productName: productName.trim(),
    price,
    quantity,
    category: category.trim(),
  };

  cart.push(product);

  res.status(201).json({
    message: "Product added successfully",
    product,
  });
});

// PUT update product
app.put("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }

  const index = cart.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const { productName, price, quantity, category } = req.body || {};

  if (
    typeof productName !== "string" ||
    productName.trim() === "" ||
    typeof price !== "number" ||
    price < 0 ||
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    typeof category !== "string" ||
    category.trim() === ""
  ) {
    return res.status(400).json({
      message: "Invalid product details",
    });
  }

  cart[index] = {
    id,
    productName: productName.trim(),
    price,
    quantity,
    category: category.trim(),
  };

  res.status(200).json({
    message: "Product updated successfully",
    product: cart[index],
  });
});

// DELETE product
app.delete("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }

  const index = cart.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const deletedProduct = cart.splice(index, 1)[0];

  res.status(200).json({
    message: "Product deleted successfully",
    product: deletedProduct,
  });
});

// Invalid routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
