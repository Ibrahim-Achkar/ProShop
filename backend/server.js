import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); //allows us to accept json data in request bodies - this is used in userController to send login data as json

/* not needed in production
;
*/

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
app.use('/api/users', userRoutes); //userRoutes adds the /login to the api/users, which it is being hooked into.
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve(); //path.resolve mimics __dirname which is only available in vanilla js (not when using es modules, which we are)
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))); //this makes the uploads folder static so that it can get loaded in the browswer

//this is how we get ready for production.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build'))); //setting front end build folder as our static folder
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  ); //take everything in this file that isn't one of the api routes and point to index.html in our build folder
} else {
  //this is what we do when we are not in production
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

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
