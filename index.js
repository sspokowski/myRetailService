import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import routes from './src/routes/productRoutes.js'
import mongoose from 'mongoose';

//set up db connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//set up server
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
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