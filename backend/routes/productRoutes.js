import express from 'express';
import Product from '../models/productModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';
const productRouter = express.Router();

const PAGE_SIZE = 20;

productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);
  }),
);

productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    });
    const product = await newProduct.save();
    res.send({ message: 'Product Created', product });
  }),
);
productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      await product.save();
      res.send({ message: 'Product Updated' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  }),
);

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  }),
);

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;

    const pageSize = Number(query.pageSize) || PAGE_SIZE;
    const page = Number(query.page) || 1;

    const category = query.category || '';
    const brand = query.brand || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};

    const categoryFilter = category && category !== 'all' ? { category } : {};

    const brandFilter = brand && brand !== 'all' ? { brand } : {};

    const ratingFilter = rating && rating !== 'all' ? { rating } : {};

    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};

    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
          ? { price: 1 }
          : order === 'highest'
            ? { price: -1 }
            : order === 'toprated'
              ? { rating: -1 }
              : order === 'newest'
                ? { createdAt: -1 }
                : order === 'bestselling'
                  ? { salesCount: -1 }
                  : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...brandFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...brandFilter,
      ...priceFilter,
      ...ratingFilter,
    });

    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  }),
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  }),
);

productRouter.get(
  '/category-counts',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    const categoryCounts = {};

    for (const category of categories) {
      const count = await Product.countDocuments({ category });
      categoryCounts[category] = count;
    }

    res.send(categoryCounts);
  }),
);

productRouter.get(
  '/random/:limit',
  expressAsyncHandler(async (req, res) => {
    const limit = parseInt(req.params.limit) || 5;
    const products = await Product.aggregate([{ $sample: { size: limit } }]);
    res.send(products);
  }),
);

productRouter.get(
  '/random-diverse/:limit',
  expressAsyncHandler(async (req, res) => {
    const limit = parseInt(req.params.limit) || 5;
    const categories = await Product.find().distinct('category');
    const selectedCategories = categories
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);

    const products = [];
    for (const category of selectedCategories) {
      const categoryProducts = await Product.find({ category });
      if (categoryProducts.length > 0) {
        const randomProduct =
          categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
        products.push(randomProduct);
      }
    }

    res.send(products);
  }),
);

productRouter.get(
  '/slug/:slug',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.send(product);
    } else {
      console.log('Product not found for slug:', req.params.slug);
      res.status(404).send({ message: 'Product Not Found' });
    }
  }),
);

productRouter.get(
  '/:_id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params._id);
    if (product) res.send(product);
    else res.status(404).send({ message: 'Product Not Found' });
  }),
);

productRouter.post(
  '/image-search',
  expressAsyncHandler(async (req, res) => {
    const { image } = req.body;

    // Simple image search implementation
    // In production, you would use AI/ML services like Google Vision API, Clarifai, etc.
    // For now, we'll return all products as a placeholder
    // You can enhance this by integrating with image recognition APIs

    try {
      // Placeholder: Return all products sorted by relevance
      // In a real implementation, you would:
      // 1. Send the image to an AI service
      // 2. Get product categories/features from the image
      // 3. Search products based on those features

      const products = await Product.find({});

      // Simulate relevance scoring (in production, this would come from AI)
      const scoredProducts = products
        .map((product) => ({
          ...product.toObject(),
          relevanceScore: Math.random(), // Random score for demo
        }))
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

      res.send(scoredProducts);
    } catch (error) {
      res
        .status(500)
        .send({ message: 'Image search failed', error: error.message });
    }
  }),
);

export default productRouter;
