# MT1-LABEXAM - Shopping Cart Management Web Application

Full Stack Development MT1 practical lab examination project implemented using Node.js built-in HTTP module, FS module, Express.js REST API framework, and JavaScript ES Modules.

---

## Project Structure

```text
MT1-LABEXAM/
├── package.json                          # Project metadata, ES Module config, dependencies, and run scripts
├── package-lock.json                     # Dependency lock file
├── httpServer.js                         # Part A: Built-in HTTP and FS server (port 3000)
├── expressApp.js                         # Part B: Express.js REST API server (port 4000)
├── public/
│   └── index.html                        # Static HTML page served via FS module
├── screenshots/                          # EchoAPI / Postman test screenshots for submission
│   ├── Terminal.jpeg
│   ├── get.jpeg
│   ├── get 2.jpeg
│   ├── post.jpeg
│   ├── put.jpeg
│   └── delete.jpeg
├── MT1-LABEXAM.postman_collection.json   # Exported Postman / EchoAPI collection
├── .gitignore                            # Git ignore rules for node_modules and logs
└── README.md                             # Comprehensive project documentation
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v24.x tested)
- **npm**: v9.0.0 or higher
- **API Client**: EchoAPI extension in VS Code or Postman

---

## Installation & Setup

1. Open the project folder in terminal:
   ```powershell
   cd MT1-LABEXAM
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Verify JavaScript syntax:
   ```powershell
   npm run check
   ```

---

## Running the Servers

Both servers run independently and can be executed simultaneously in separate terminals.

### Terminal 1 - Part A: Built-in HTTP Server (Port 3000)
```powershell
npm run start:http
```
*or directly with node:*
```powershell
node httpServer.js
```
**Expected Console Output:**
```text
HTTP Server running at http://localhost:3000
```

### Terminal 2 - Part B: Express.js REST API Server (Port 4000)
```powershell
npm run start:express
```
*or directly with node:*
```powershell
node expressApp.js
```
**Expected Console Output:**
```text
Express Server running at http://localhost:4000
```

---

## API Endpoints Reference

### Part A: Built-in HTTP & FS Server (`httpServer.js`)

**Base URL:** `http://localhost:3000`

| Method | Endpoint | Description | Content-Type | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Welcome message in HTML format | `text/html` | `200 OK` |
| `GET` | `/cart` | Retrieve all cart items in JSON format | `application/json` | `200 OK` |
| `GET` | `/about` | Shopping cart application information | `application/json` | `200 OK` |
| `GET` | `/home` | Serve static `public/index.html` via FS module | `text/html` | `200 OK` |
| `POST` | `/add-to-cart` | Add a new product to in-memory array | `application/json` | `201 Created` |

#### `POST /add-to-cart` Sample Request Body
```json
{
  "id": 4,
  "productName": "Headphones",
  "price": 1499,
  "quantity": 1
}
```

#### `POST /add-to-cart` Expected Response (`201 Created`)
```json
{
  "message": "Product added successfully",
  "product": {
    "id": 4,
    "productName": "Headphones",
    "price": 1499,
    "quantity": 1
  }
}
```

---

### Part B: Express.js Shopping Cart REST API (`expressApp.js`)

**Base URL:** `http://localhost:4000`

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/cart` | Retrieve all shopping cart items | `200 OK` |
| `GET` | `/cart/:id` | Retrieve item by ID (includes computed `totalPrice`) | `200 OK` / `404 Not Found` |
| `POST` | `/cart` | Add a new product to cart | `201 Created` / `400 Bad Request` |
| `PUT` | `/cart/:id` | Update product details by ID | `200 OK` / `404 Not Found` |
| `DELETE` | `/cart/:id` | Delete product from cart by ID | `200 OK` / `404 Not Found` |

#### Product Object Structure
```json
{
  "id": 1,
  "productName": "Wireless Mouse",
  "price": 799,
  "quantity": 2,
  "category": "Electronics"
}
```

#### Sample `POST /cart` Request Body
```json
{
  "id": 4,
  "productName": "Bluetooth Headphones",
  "price": 1499,
  "quantity": 1,
  "category": "Electronics"
}
```
**Expected Response (`201 Created`):**
```json
{
  "message": "Product added successfully",
  "product": {
    "id": 4,
    "productName": "Bluetooth Headphones",
    "price": 1499,
    "quantity": 1,
    "category": "Electronics"
  }
}
```

#### Sample `GET /cart/1` Expected Response (`200 OK`)
```json
{
  "id": 1,
  "productName": "Wireless Mouse",
  "price": 799,
  "quantity": 2,
  "category": "Electronics",
  "totalPrice": 1598
}
```
*(Note: `totalPrice` is dynamically computed as `price * quantity`)*

#### Sample `PUT /cart/1` Request Body
```json
{
  "productName": "Wireless Mouse",
  "price": 899,
  "quantity": 3,
  "category": "Electronics"
}
```
**Expected Response (`200 OK`):**
```json
{
  "message": "Product updated successfully",
  "product": {
    "id": 1,
    "productName": "Wireless Mouse",
    "price": 899,
    "quantity": 3,
    "category": "Electronics"
  }
}
```

#### Sample `DELETE /cart/1` Expected Response (`200 OK`)
```json
{
  "message": "Product deleted successfully",
  "product": {
    "id": 1,
    "productName": "Wireless Mouse",
    "price": 899,
    "quantity": 3,
    "category": "Electronics"
  }
}
```

---

## API Testing with Postman / EchoAPI

1. Import `MT1-LABEXAM.postman_collection.json` into EchoAPI (VS Code) or Postman.
2. Recommended Execution Order:
   - **Part A Requests**:
     - `GET http://localhost:3000/`
     - `GET http://localhost:3000/cart`
     - `GET http://localhost:3000/about`
     - `GET http://localhost:3000/home`
     - `POST http://localhost:3000/add-to-cart`
   - **Part B Safe CRUD Sequence**:
     - `GET http://localhost:4000/cart`
     - `GET http://localhost:4000/cart/1`
     - `POST http://localhost:4000/cart` (creates ID 4)
     - `PUT http://localhost:4000/cart/4` (updates ID 4)
     - `DELETE http://localhost:4000/cart/4` (removes ID 4)
   - **Error Handling Checks**:
     - `GET http://localhost:4000/cart/999` (`404 Not Found`)
     - `GET http://localhost:4000/cart/abc` (`400 Bad Request`)
     - `POST http://localhost:4000/cart` with invalid body (`400 Bad Request`)
     - `GET http://localhost:3000/not-found` (`404 Not Found`)
     - `POST http://localhost:3000/add-to-cart` with invalid JSON (`400 Bad Request`)

---

## Troubleshooting & Port Configuration

- **Port 3000 in use with EchoAPI**:
  The EchoAPI VS Code extension defaults its internal document service to port 3000. This project configures `"echoapi.documentServicePort": 3005` in `.vscode/settings.json` so port 3000 remains available for `httpServer.js`.

---

## GitHub Repository

- **Repository**: [https://github.com/adityamishra0706/MT1-LABEXAM](https://github.com/adityamishra0706/MT1-LABEXAM)
- **Branch**: `main`
