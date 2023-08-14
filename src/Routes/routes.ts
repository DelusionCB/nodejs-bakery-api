import {Router} from 'express';
import {getAllProducts, getCustomerByCustomerID, addProductsToCustomer, resetCustomerProducts} from '../Controllers/controllers';

const router = Router();

router.get('/products', getAllProducts);
router.get('/customer/:customerID', getCustomerByCustomerID);
router.post('/customer/:customerID', addProductsToCustomer);
router.post('/customer/:customerID/reset', resetCustomerProducts)

export default router;
