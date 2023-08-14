import sqlite3 from 'sqlite3';
import {Database, open} from 'sqlite';
import path from 'path';
import * as fs from 'fs';
import {ProductPropTypes} from '../Types/product.types';
import {CustomerPropTypes} from '../Types/customer.types';

// Construct the database file path using path.join
const dbPath = path.join(__dirname, '..', 'db', 'litebase.sqlite');

// Function to open the SQLite database connection
export async function openDatabase(): Promise<Database> {
    try {
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        return db;
    } catch (error) {
        console.error('Error opening the database:', error);
        throw error;
    }
}

// Read the default customer from the JSON
function readDefaultCustomer(): CustomerPropTypes {
    const filePath = path.join(__dirname, '..',  'Defaults', 'default_customer.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

// Read the default products from the JSON
function readDefaultProducts(): ProductPropTypes[] {
    const filePath = path.join(__dirname, '..', 'Defaults', 'default_products.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

export async function createDatabase(): Promise<void> {
    try {
        const db = await openDatabase();

        // Create product_list table
        await db.run(`
      CREATE TABLE IF NOT EXISTS product_list (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        image_placeholder TEXT NOT NULL,
        rating INTEGER,
        price INTEGER,
        currency TEXT DEFAULT 'eur'
      )
    `);

        const defaultProducts = readDefaultProducts();

        const productInsertPromises = defaultProducts.map((product: ProductPropTypes) =>
            db.run(`
        INSERT INTO product_list (name, description, image_placeholder, rating, price, currency)
        VALUES (?, ?, ?, ?, ?, ?)
      `, product.name, product.description, product.image_placeholder, product.rating, product.price, product.currency),
        );
        await Promise.all(productInsertPromises);

        await db.run(`
      CREATE TABLE IF NOT EXISTS customer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerID INTEGER,
        products JSON DEFAULT '[]',
        status TEXT DEFAULT 'not_ordered'
      )
    `);

        const defaultCustomer = readDefaultCustomer();

        await db.run(`
      INSERT INTO customer (customerID, products, status)
      VALUES (?, ?, ?)
    `, defaultCustomer.customerID, JSON.stringify(defaultCustomer.products), defaultCustomer.status);

        await db.close();
        console.log('Tables created successfully with default data!');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
