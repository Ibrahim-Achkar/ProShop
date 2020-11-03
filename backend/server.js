import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();

app.get('/', (req, res) => {
  res.send('API is running...');
});

/* these were used when we were fetching from the producst.js file. These are no longer used since we are fetching from mongoDB.
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.json(product);
});
*/

app.use('/api/products', productRoutes);

/*Middleware = any function that makes use of information inside of a request. 
app.use allows the middleware to fire using whatever information is within the specific request that was made. 
For example, if we make a get request to all products, app.use could fire and we could find out information about the request (such as original URL origin) */

/*
 Error handling middleware.
 To override the default error handler then create a function that takes in error first and then req, res, next. 
*/
app.use(notFound);
app.use(errorHandler);

//dotenv allows you to do things like set ports, etc. Dotenv should be secret and not pushed to github etc.
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`.yellow.bold
  )
);
