import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

/*We are retrieving products in accordance with the schema set out in productModel*/
//@desc     Fetch all products
//@route    GET/api/products
//@access   Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1; //pageNumber is whatever is in the query (will be something like ?pageNumber=2)

  const keyword = req.query.keyword
    ? {
        //this is how we decide what to display based on the search keyword
        name: {
          $regex: req.query.keyword, //regex is a regular expression, so that we don't have to type in the exact product name
          $options: 'i', //case insensitive
        },
      }
    : {}; //if no keyword, return empty object

  const count = await Product.countDocuments({ ...keyword }); //get the total count of products. spreading keyword means count is limited to those products
  const products = await Product.find({ ...keyword }) //again, could be something or nothing
    .limit(pageSize) //we limit by page size (if 2, 2 products).
    .skip(pageSize * (page - 1)); //Skip makes sure we get the right products (for example, if we are on page 2 we get the next 2 products). Page 1 = 2*(1-1) = 0, so skip 0. Page 2 = 2*(2-1) = 2, so skip 2 products.
  res.json({ products, page, pages: Math.ceil(count / pageSize) }); //if four products, count = 4 and pages would be 4 / 2 = 2 pages
});

//@desc     Fetch single product
//@route    GET/api/products/:id
//@access   Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc     delete a product
//@route    DELETE/api/products/:id
//@access   Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc     create a product - every time an admin creates a product a dummy product is created in the database and then productUpdate updates that product
//@route    POST/api/products/
//@access   Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//@desc     update a product
//@route    PUT/api/products/:id
//@access   Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc     create new review
//@route    POST/api/products/:id/reviews
//@access   Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id); //finding the product we are reviewing

  if (product) {
    //check to see if user has already submitted a review
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString() //for each review attached to the product, check that the user within the review model matches the logged in user (using user._id)
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed 👮‍♂️');
    }

    const review = {
      //constructing a review object which will contain the information submitted by the user
      name: req.user.name, //logged in user name
      rating: Number(rating), //rating from the body that we destructured above
      comment, //comment from the body that we destructured above
      user: req.user._id, //the user including name, id, etc.
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added 🎉' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc     get top rated products
//@route    GET/api/products/top
//@access   Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3); //empty object because not limiting it to anything. Sorting in ascending order by rating (so -1). Limit to three products.
  res.json(products);
});
//we could edit get products to take in an extra param, but cleaner this way.

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
