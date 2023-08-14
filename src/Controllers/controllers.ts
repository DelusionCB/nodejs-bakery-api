import {Request, Response} from 'express';
import {openDatabase} from '../Database/db';
import {ProductPropTypes} from '../Types/product.types'


/**
 * Fetch all the products listed in /products
 * @param req
 * @param res
 */
export async function getAllProducts(req: Request, res: Response): Promise<void> {
    try {
        const pageSize = parseInt(req.query.page_size as string) || 6;
        const page = parseInt(req.query.page as string) || 1;

        const db = await openDatabase();
        const products = await db.all(
            `SELECT * FROM product_list LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`,
        );

        const totalCount = await db.get('SELECT COUNT(*) as count FROM product_list');
        await db.close();
        const totalPages = Math.ceil(totalCount.count / pageSize);

        res.json({data: products, metadata: {count: totalCount.count, page, pageSize, totalPages}});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

/**
 * Fetch customer based on their customer ID
 * @param req
 * @param res
 */
export async function getCustomerByCustomerID(req: Request, res: Response): Promise<void> {
    try {
        const {customerID} = req.params;
        const parsedCustomerID = parseInt(customerID);
        const db = await openDatabase();

        if (isNaN(parsedCustomerID)) {
            res.status(400).json({error: 'Invalid customerID'});
            return;
        }

        const customer = await db.get('SELECT * FROM customer WHERE customerID = ?', parsedCustomerID);
        await db.close();

        if (!customer) {
            res.status(404).json({error: 'Customer not found'});
            return;
        }

        res.json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

/**
 * Update customers products -list with added products
 * @param req
 * @param res
 */
export async function addProductsToCustomer(req: Request, res: Response): Promise<void> {
    try {
        const {customerID} = req.params;
        const productIDs = req.body.products;
        const db = await openDatabase();

        if (isNaN(parseInt(customerID))) {
            res.status(400).json({error: 'Invalid customerID'});
            return;
        }

        // Check if productIDs is an array
        if (!Array.isArray(productIDs)) {
            res.status(400).json({error: 'Product IDs should be an array'});
            return;
        }

        // Fetch the product objects based on their IDs
        const products: ProductPropTypes[] = [];
        for (const productID of productIDs) {
            const product = await db.get('SELECT * FROM product_list WHERE id = ?', productID);
            if (!product) {
                res.status(404).json({error: `Product with ID ${productID} not found`});
                return;
            }
            products.push(product);
        }

        // Update the customer's products with the full product objects
        const updateQuery = 'UPDATE customer SET products = ?, status = ? WHERE customerID = ?';
        const status = products.length > 0 ? 'ordered' : 'not_ordered';
        await db.run(updateQuery, JSON.stringify(products), status, parseInt(customerID));
        await db.close();

        res.json({message: 'Products added successfully'});
    } catch (error) {
        console.error('Error adding products to customer:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

/**
 * Reset customer objects products -list to empty
 * @param req
 * @param res
 */
export async function resetCustomerProducts(req: Request, res: Response): Promise<void> {
    try {
        const {customerID} = req.params;
        const db = await openDatabase();

        const parsedCustomerID = parseInt(customerID);

        if (isNaN(parsedCustomerID)) {
            res.status(400).json({error: 'Invalid customerID'});
            return;
        }
        const customer = await db.get('SELECT * FROM customer WHERE customerID = ?', parsedCustomerID);

        if (!customer) {
            res.status(404).json({error: 'Customer not found'});
            return;
        }

        const updateQuery = 'UPDATE customer SET products = ?, status = ? WHERE customerID = ?';
        const status = 'not_ordered';
        const products: ProductPropTypes[] = [];

        await db.run(updateQuery, JSON.stringify(products), status, parseInt(customerID));
        await db.close();

        res.json({message: 'Products reseted successfully'});
    } catch (error) {
        console.error('Error reseting products', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}
