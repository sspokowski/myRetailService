import Product from './../models/product';
import priceModel from './../models/price';
import getProduct from '../serviceIntegration/redsky'

class ProductController {

    /**
     * This method retrieves product data from the Redsky API 
     * and collates it with data from the product pricing database.
     * It sends the collated data back to an HTTP/S request as the response body. 
     * @param {*} req 
     * @param {*} res 
     * @returns void
     */
    getProductById = async (req, res) => {
        const id = req.params.id;
        let product, productName, price, productData;
        try {
            product = await getProduct(id);
            if(product === undefined) {
                response.status(400).json({message: 'invalid product'});
                return;
            }
            productName = product.product.item.product_description.title;
        } catch (error) {
            console.error('An error occurred during the redsky api call.', error);
            res.status(500).send('An error occurred.');
            return;
        }

        try{
            price = await priceModel.find({productId: `${id}`});
            if(price === undefined) {
                response.status(400).json({message: 'Product pricing information not found'});
                return;
            }
        } catch (error) {
            console.error('An error occurred during the mongo pricing lookup.', error);
            res.status(500).send('An error occurred.');
            return;
        }

        try {
            productData = new Product(id, productName, price[0].price);
            res.send(productData);
        } catch (error) {
            console.error('something went wrong creating a new product data object.', error);
            res.status(500).send('An error occurred.');
        }
        return;
    }

    /**
     * This method verifies a particular product is in myRetail's product system by querying the product in the RedskyAPI
     * After verification, the method performs an 'upsert' on the pricing database.  
     * If the product has existing products in the DB, it will get updated, otherwise it will get inserted.
     * @param {*} request 
     * @param {*} response 
     * @returns void
     */
    updateProductById = async (request, response) => {
        const id = request.params.id;
        const body = request.body;
      
        if(!request.body) {
            response.status(400).json({message: 'invalid body', status:400});
            return;
        }

        //mmake sure product ID is legit in from RedSky API.
        let product;
        try {
            product = await getProduct(id);
            if(product === undefined) {
                response.status(400).json({message: 'invalid product'});
                return;
            }
        } catch (error) {
            console.error('An error occurred during the redsky api call.', error);
            response.status(500).send('An error occurred.');
            return;
        }
        
        const filter = {productId: `${id}`};
        const update = {price: {value: body.current_price.value, currency_code: body.current_price.currency_code}}
        try{
            const price = await priceModel.findOneAndUpdate(filter, update, {upsert: true}, (err, docs) => {
                if (err) {
                    console.error('Error occured updating mongo', err);
                    response.status(500).send('An error occurred');
                    return;
                } else {
                    //create audit trail
                    console.log('Updated product: ', docs);
                    response.status(200).send('Product updated');
                    return;
                }
            });
        } catch (error) {
            console.error('An error occurred during the mongo pricing lookup.', error);
            response.status(500).send('An error occurred.');
            return;
        }
        return;
    }
}

export default new ProductController()