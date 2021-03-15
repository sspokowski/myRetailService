import Product from './../models/product.js';
import priceModel from './../models/price.js';
import getProduct from '../serviceIntegration/redsky.js'

class ProductController {

    getProductById = async (req, res) => {
        const id = req.params.id;
        let product, productName, price, productData;
        try {
            product = await getProduct(id);
            productName = product.product.item.product_description.title;
        } catch (error) {
            console.error('An error occurred during the redsky api call.', error);
            res.status(500).send('An error occurred.');
            return;
        }

        try{
            price = await priceModel.find({productId: `${id}`})[0];
        } catch (error) {
            console.error('An error occurred during the mongo pricing lookup.', error);
            res.status(500).send('An error occurred.');
            return;
        }

        try {
            productData = new Product(id, productName, price.price);
            res.send(productData);
        } catch (error) {
            console.error('something went wrong creating a new product data object.', error);
            res.status(500).send('An error occurred.');
        }
        return;
    }

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
        } catch (error) {
            console.error('An error occurred during the redsky api call.', error);
            response.status(500).send('An error occurred.');
            return;
        }
       
        const filter = {productId: `${id}`};
        const update = {price: {value: body.current_price.value, currency_code: body.current_price.currency_code}}
        try{
            const price = await priceModel.findOneAndUpdate(filter, update, (err, docs) => {
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