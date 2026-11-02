import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

let cart = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
  },
  {
    id: 2,
    productName: "Keyboard",
    price: 1200,
    quantity: 1,
  },
  {
    id: 3,
    productName: "Notebook",
    price: 100,
    quantity: 5,
  },
];

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost:3000"}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Welcome route
  if (method === "GET" && pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Welcome to Shopping Cart</h1>");
  }

  // Get cart items
  else if (method === "GET" && pathname === "/cart") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(cart));
  }

  // About route
  else if (method === "GET" && pathname === "/about") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        application: "Shopping Cart Application",
        description: "Shopping cart application information",
        port: PORT,
      })
    );
  }

  // Serve HTML using FS module
  else if (method === "GET" && pathname === "/home") {
    const filePath = path.join(__dirname, "public", "index.html");

    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ message: "Error reading HTML file" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
  }

  // Add product to cart
  else if (method === "POST" && pathname === "/add-to-cart") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("error", () => {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ message: "Unable to read request body" }));
    });

    req.on("end", () => {
      try {
        const product = JSON.parse(body);
        const { id, productName, price, quantity } = product;

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
          quantity <= 0
        ) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ message: "Invalid product details" }));
          return;
        }

        if (cart.some((item) => item.id === id)) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ message: "Product ID already exists" }));
          return;
        }

        const newProduct = {
          id,
          productName: productName.trim(),
          price,
          quantity,
        };

        cart.push(newProduct);

        res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
        res.end(
          JSON.stringify({
            message: "Product added successfully",
            product: newProduct,
          })
        );
      } catch {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });
  }

  // Invalid route
  else {
    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ message: "404 - Route Not Found" }));
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
