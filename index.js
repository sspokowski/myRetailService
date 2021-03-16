import express from 'express';
import routes from './src/routes/productRoutes';
import mongoose from 'mongoose';
import path from 'path';
import swaggerUi from 'swagger-ui-dist';

//set up db connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//set up server
const app = express();
const port = process.env.PORT || 3000;

//set up docs
const pathToSwaggerUi = swaggerUi.absolutePath();
app.use(express.static(pathToSwaggerUi));
app.use('/docs', express.static(path.join(path.resolve(), './docs/index.html')));
app.use('/docs/myRetailProductServiceApi', express.static(path.join(path.resolve(), './docs/myRetailProductServiceApi.json')));

//set up request body parsing
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 

//apply routes
app.use('/', routes);

//catch all other routes
app.use((request, response) => {
    response.status(404).json({message: '404 - Not Found', status: 404});
});

//handle errors
app.use((error, request, response, next) => {
    console.error(error);
    response.status(error.status || 500).json({error: error.message, status: 500});
});

app.listen(port, async () => {
    console.log(`server running on port: ${port}`);
});