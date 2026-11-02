# MT1-LABEXAM

Full Stack Development MT1 practical project using Node.js, built-in HTTP and FS modules, Express.js, and JavaScript ES Modules.

## Project files

- `httpServer.js` - Part A: built-in Node.js HTTP and FS server on port 3000.
- `expressApp.js` - Part B: Express REST API on port 4000 using an in-memory JavaScript array.
- `public/index.html` - HTML file served by `GET /home` in Part A.
- `MT1-LABEXAM.postman_collection.json` - Postman collection for the required requests.
- `screenshots/` - Save only genuine screenshots captured during your own Postman testing.

## Setup

Install dependencies if `node_modules` is not available:

```powershell
npm.cmd install
```

Check JavaScript syntax:

```powershell
npm.cmd run check
```

## Run both servers

Open two terminals in this project folder.

Terminal 1:

```powershell
node httpServer.js
```

Terminal 2:

```powershell
node expressApp.js
```

## Part A: Built-in HTTP server

Base URL: `http://localhost:3000`

| Method | Route | Expected result |
| --- | --- | --- |
| GET | `/` | HTML welcome message, `200` |
| GET | `/cart` | Cart items as JSON, `200` |
| GET | `/about` | Application information as JSON, `200` |
| GET | `/home` | `public/index.html` through the FS module, `200` |
| POST | `/add-to-cart` | Valid product is added, `201` |

Valid JSON body for `POST /add-to-cart`:

```json
{
  "id": 4,
  "productName": "Headphones",
  "price": 1499,
  "quantity": 1
}
```

The required fields are `id`, `productName`, `price`, and `quantity`. Invalid JSON or invalid field values return `400`; unknown routes return `404`.

## Part B: Express server

Base URL: `http://localhost:4000`

| Method | Route | Expected result |
| --- | --- | --- |
| GET | `/cart` | All products, `200` |
| GET | `/cart/1` | One product plus `totalPrice`, `200` |
| POST | `/cart` | Create product, `201` |
| PUT | `/cart/:id` | Update an existing product, `200` |
| DELETE | `/cart/:id` | Delete an existing product, `200` |

Every product stores and returns `id`, `productName`, `price`, `quantity`, and `category`; the PUT body must include all fields except `id`.

PDF sample POST body for `POST /cart`:

```json
{
  "id": 4,
  "productName": "Bluetooth Headphones",
  "price": 1499,
  "quantity": 1,
  "category": "Electronics"
}
```

PDF sample PUT body for `PUT /cart/1`:

```json
{
  "productName": "Wireless Mouse",
  "price": 899,
  "quantity": 3,
  "category": "Electronics"
}
```

`GET /cart/:id` calculates `totalPrice` as `price * quantity`. Missing products return `404`; invalid JSON or invalid product details return `400`.

## Postman

1. Start both servers.
2. Open Postman and choose **Import**.
3. Select `MT1-LABEXAM.postman_collection.json` from this project folder.
4. Run the **Safe CRUD Sequence** folder in order: POST `/cart`, PUT `/cart/4`, then DELETE `/cart/4`.
5. Restart the Express server before using the separate PDF sample PUT and DELETE requests for `/cart/1`, because DELETE removes that sample product.
6. Take genuine screenshots of your Postman request, status code, and response. Save them in `screenshots/`.

Postman has not been run automatically by this project.

## GitHub repository

Repository: https://github.com/adityamishra0706/MT1-LABEXAM

The project uses meaningful local commits for implementation, submission documentation, and the screenshots folder. Push the `main` branch only after genuine screenshots have been added.
