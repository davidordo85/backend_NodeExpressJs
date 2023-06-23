# Backend Express.js

`This is a backend for a social network for buying and selling`

---

## Deploy

1. Install the dependencies:

```shell
npm install
```

2. Copy .env.example to .env and review the config.

```shell
cp .env.example .env
```

---

## Run

1. Production mode:

```shell
"npm run start" production mode,
```

2. Development mode:

```shell
"npm run dev" dev mode
```

---

## Routes

### User

- <span style="color: gold; font-size: 1.25rem">**🔒 Login**</span>

  - Endpoint: `api/v1/user/login`

  - Method: `📤 POST`

  - Description: Allows a user to log in.

  **Request Parameters:**

  - `email`: User's email (required string).
  - `password`: User's password (required string).

- <span style="color: gold; font-size: 1.25rem">**📝 Registration**</span>

  - Endpoint: `api/v1/user/registration`

  - Method: `📤 POST`

  - Description: Allows a user to register in the application.

  **Request Parameters:**

  - `name`: User's name (required string).
  - `email`: User's email (required string).
  - `birthdate`: User's birth date (required string).
  - `password`: User's password (required string).

- <span style="color: green; font-size: 1.25rem">**👤 Get User**</span>

  - Endpoint: `api/v1/user`
  - Method: ` 📥 GET`
  - Description: Retrieves user information.

  **Request Headers:**

  - `Authorization`: Bearer Token (required - must be the same user who created the product).

### Product

- <span style="color: green; font-size: 1.25rem">**📦 Get Products**</span>

  - Endpoint: `api/v1/products`
  - Method: ` 📥 GET`
  - Description: Retrieves a list of products.

  **Query Parameters:**

  - `name`: Filters products by name (string).
  - `price`: Sorts products by price. Accepted values: `asc` (ascending), `desc` (descending).
  - `categories`: Filters products by categories (array of strings).

- <span style="color: gold; font-size: 1.25rem">➕ Create Product</span>

  - Endpoint: `api/v1/products`
  - Method: `📤 POST`
  - Description: Creates a new product.

  **Request Parameters:**

  - `name`: Product's name (required string).
  - `price`: Product's price (required number).
  - `quantity`: Product's quantity (required number).
  - `description`: Product's description (string).
  - `images`: Product's images (array of strings).
  - `categories`: Product's categories (array of strings).
    **Request Headers:**
  - `Authorization`: Bearer Token (required).

- <span style="color: green; font-size: 1.25rem">**🔍 Get Product by ID**</span>

  - Endpoint: `api/v1/products/:id`

  - Method: ` 📥 GET`

  - Description: Retrieves a product by its ID.

  **Request Parameters:**

  - `id`: Product's ID (required string).

- <span style="color: orange; font-size: 1.25rem">**✏️ Update Product**</span>

  - Endpoint: `api/v1/products/:id`

  - Method: `📝 PUT`

  - Description: Updates an existing product.

  **Request Parameters:**

  - `id` (required, string): Product ID.
  - `name` (string): Updated product name.
  - `price` (number): Updated product price.
  - `quantity` (number): Updated product quantity.
  - `description` (string): Updated product description.
  - `images` (array of strings): Added images to the existing ones.
  - `categories` (array of strings): Updated product categories.

  **Request Headers:**

  - `Authorization` (required): Bearer Token.

- <span style="color: red; font-size: 1.25rem">**🗑️ Delete Product**</span>

  - Endpoint: `api/v1/products/:id`

  - Method: `🗑️ DELETE`

  - Description: Deletes a product with the specified ID.

  **Request Parameters:**

  - `id`: Product's ID (required string).
    Request Headers:
  - `Authorization`: Bearer Token (required - must be the same user who created the product).

- <span style="color: green; font-size: 1.25rem">**📚 Get Categories**</span>

  - Endpoint: `api/v1/products/categories`

  - Method: ` 📥 GET`

  - Description: Retrieves a list of categories for products.
