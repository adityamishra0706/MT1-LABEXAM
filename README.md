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
  "quantity": 1,
  "category": "Electronics"
}
```

The required fields are `id`, `productName`, `price`, `quantity`, and `category`. Invalid JSON or invalid field values return `400`; unknown routes return `404`.

## Part B: Express server

Base URL: `http://localhost:4000`

| Method | Route | Expected result |
| --- | --- | --- |
| GET | `/cart` | All products, `200` |
| GET | `/cart/1` | One product plus `totalPrice`, `200` |
| POST | `/cart` | Create product, `201` |
| PUT | `/cart/4` | Update product ID 4, `200` |
| DELETE | `/cart/4` | Delete product ID 4, `200` |

Use this order in Postman: first `POST /cart`, then `PUT /cart/4`, then `DELETE /cart/4`. Every product stores and returns `id`, `productName`, `price`, `quantity`, and `category`; the PUT body must include all fields except `id`.

`GET /cart/:id` calculates `totalPrice` as `price * quantity`. Missing products return `404`; invalid JSON or invalid product details return `400`.

## Postman

1. Start both servers.
2. Open Postman and choose **Import**.
3. Select `MT1-LABEXAM.postman_collection.json` from this project folder.
4. Open the imported collection and send the requests in the shown order.
5. Take genuine screenshots of your Postman request, status code, and response. Save them in `screenshots/`.

Postman has not been run automatically by this project.

## GitHub submission later

Do this only after creating an empty GitHub repository and when you are ready to submit:

```powershell
git init
git add .
git status
git commit -m "Complete MT1 lab exam practical"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/MT1-LABEXAM.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. These commands have not been run for this project.
