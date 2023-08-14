import {ProductPropTypes} from './product.types';

export interface CustomerPropTypes {
    customerID: number,
    products: ProductPropTypes[],
    status: string
}
