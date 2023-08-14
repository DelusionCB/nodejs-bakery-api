# Node.js API Project

This is a simple Node.js API project that uses Express, SQLite, and TypeScript. It provides endpoints to manage a list of products and customers.

## Getting Started

1. **Clone the repository:**

   ```code
   git clone https://github.com/DelusionCB/nodejs-bakery-api.git
   
2. **Install dependencies**
    ```code
    cd nodejs-api
    npm install

3. **Start the server:**
    ```code
   npm start
   ```
   Starting server, will create new sqlite -file in src/db -folder.

   It will also run src/Defaults/ JSON -files for default data.


   **Default customer ID is 123456**


   The server will start on http://localhost:8080 by default.
   You can change this in:

    
    index.ts
    const port = 8080;
    

## Endpoints

#### GET /products: Retrieve a list of products.
Example of products
```code
{
    "data": [
        {
            "id": 1,
            "name": "Chocolate Cake",
            "description": "A rich and moist chocolate cake.",
            "image_placeholder": "https://www.thomsonsmartcook.com/wp-content/uploads/2019/09/Sweet-shortcrust-pastry-1-650x650.jpg",
            "rating": 4,
            "price": 30.5,
            "currency": "eur"
        },
        {
            "id": 2,
            "name": "Pancake",
            "description": "A fluffy and syrupy pancake.",
            "image_placeholder": "https://www.thomsonsmartcook.com/wp-content/uploads/2019/09/Sweet-shortcrust-pastry-1-650x650.jpg",
            "rating": 5,
            "price": 15,
            "currency": "eur"
        },
    ],
}
```

#### GET /products?page_size=6&page=1: Retrieve products with pagination.
Pagination is returned without giving query parameters but that is the way you should use them.

Example of metadata:
```code
    "metadata": {
        "count": 43,
        "page": 1,
        "pageSize": 6,
        "totalPages": 8
    }
```

#### GET /customer/:customerID: Retrieve a customer's details.
Example of details:
```code
{
    "id": 1,
    "customerID": 123456,
    "products": [
    {
        "id":1,
        "name":"Chocolate Cake",
        "description":"A rich and moist chocolate cake.",
        "image_placeholder":"https://www.thomsonsmartcook.com/wp-content/uploads/2019/09/Sweet-shortcrust-pastry-1-650x650.jpg",
        "rating":4,
        "price":30.5,
        "currency":"eur"
        }
    ],
    "status": "ordered"
}
```

#### POST /customer/:customerID: Add products to a customer.
Example of POST:
```code
{products: ['id1', 'id2', 'id3']}
```

#### POST /customer/:customerID/reset: Reset a customer's products & status.
Does what it says, sets users products into empty list & changes status to "not_ordered"

## License

This project is licensed under the MIT License.
