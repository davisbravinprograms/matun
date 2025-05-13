const _ = require("lodash");
const User = require("../models/users");
const Product = require("../models/product");
const Category = require("../models/category");
const Wishlist = require("../models/wishlist");
const Order = require("../models/order");
const Banner = require("../models/banner");
const { sendPasswordResetLink } = require("../middleware/otp");

module.exports = {
  getHome: async (req, res) => {
    try {
      const allCategoriesPromise = Category.find();
      const primaryBannerPromise = Banner.findOne({
        $and: [{ viewOrder: "primary" }, { isActive: true }],
      }).exec();
      const secondaryBannerPromise = Banner.find({
        $and: [{ viewOrder: "secondary" }, { isActive: true }],
      })
        .sort({ createdAt: -1 })
        .limit(2)
        .exec();

      const topRatedProductsPromise = Product.find({ avgRating: { $ne: null } })
        .sort({ avgRating: -1 })
        .limit(6)
        .exec();

      const topReviewedProductsPromise = Product.find({
        totalReviews: { $ne: null },
      })
        .sort({ totalReviews: -1 })
        .limit(6)
        .exec();

      const latestProductsPromise = Product.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .exec();

      const featuredProductsPromise = Product.find({ isFeatured: true })
        .populate("category")
        .sort({ createdAt: -1 })
        .limit(12)
        .exec();

      const [
        allCategories,
        primaryBanner,
        featuredProducts,
        latestProducts,
        topRatedProducts,
        topReviewedProducts,
        secondaryBanner,
      ] = await Promise.all([
        allCategoriesPromise,
        primaryBannerPromise,
        featuredProductsPromise,
        latestProductsPromise,
        topRatedProductsPromise,
        topReviewedProductsPromise,
        secondaryBannerPromise,
      ]);

      res.render("master/index", {
        allCategories: allCategories,
        featuredProducts: featuredProducts,
        latestProducts: latestProducts,
        topRatedProducts: topRatedProducts,
        topReviewedProducts: topReviewedProducts,
        primaryBanner: primaryBanner,
        secondaryBanner: secondaryBanner,
      });
    } catch (err) {
      console.log(err);
      res.render("errorPage/error", { layout: false });
    }
  },

  forgetPassword: async (req, res) => {
    try {
      const userEmail = req.body.email;
      const user = await User.findOne({ email: userEmail }, { email: 1 });
      if (user) {
        await sendPasswordResetLink(userEmail);
        res
          .status(201)
          .json({ message: "Please check your mail to reset your password" });
      } else {
        res.status(404).json({ message: "user not found" });
      }
    } catch (err) {
      res.status(500);
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const limit = 9;
      const page = req.params.page || 1;
      const minPrice = req.query.minPrice || 100;
      const maxPrice = req.query.maxPrice || 5000;
      const sortOrder = req.query.sort || "latest";
      let sort;
      const priceRange = { $gt: minPrice, $lt: maxPrice };
      if (sortOrder == "asc") {
        sort = { price: 1 };
      } else if (sortOrder == "dsc") {
        sort = { price: -1 };
      } else {
        sort = { createdAt: -1 };
      }

      const allCategoriesPromise = Category.find();
      const latestProductsPromise = Product.find()
        .sort({ createdAt: -1 })
        .limit(6);

      const offerProductsPromise = Product.find({
        offerPrice: { $ne: null },
      }).limit(6);
      const allProductsPromise = Product.find()
        .populate("category")
        .where("price")
        .equals(priceRange)
        .sort(sort)
        .skip(limit * page - limit)
        .limit(limit)
        .exec();

      const countPromise = Product.find()
        .where("price")
        .equals(priceRange)
        .sort(sort)
        .countDocuments();

      const [allCategories, allProducts, offerProducts, latestProducts, count] =
        await Promise.all([
          allCategoriesPromise,
          allProductsPromise,
          offerProductsPromise,
          latestProductsPromise,
          countPromise,
        ]);
      res.render("master/shop", {
        allCategories: allCategories,
        allProducts: allProducts,
        offerProducts: offerProducts,
        latestProducts: latestProducts,
        minPrice: minPrice,
        maxPrice: maxPrice,
        sortOrder: sortOrder,
        current: page,
        limit: Math.ceil(count / limit),
        count: count,
      });
    } catch (err) {
      console.log(err);
      res.render("errorPage/error", { layout: false });
    }
  },

  getShopByCategory: async (req, res) => {
    try {
      const limit = 9;
      const page = req.params.page || 1;
      const minPrice = req.query.minPrice || 100;
      const maxPrice = req.query.maxPrice || 5000;
      const sortOrder = req.query.sort || "latest";
      let sort;
      const priceRange = { $gt: minPrice, $lt: maxPrice };
      if (sortOrder == "asc") {
        sort = { price: 1 };
      } else if (sortOrder == "dsc") {
        sort = { price: -1 };
      } else {
        sort = { createdAt: -1 };
      }
      const allCategories = await Category.find();
      const paramsId = _.upperFirst(req.params.category);
      const findCategory = await Category.find({ categoryName: paramsId });

      const latestProducts = await Product.find({
        category: findCategory[0].id,
      })
        .sort({ createdAt: -1 })
        .limit(6);

      const findProducts = await Product.find({ category: findCategory[0].id })
        .where("price")
        .equals(priceRange)
        .sort(sort)
        .skip(limit * page - limit)
        .limit(limit)
        .exec();

      //getting count of products for pagination

      const count = await Product.find({ category: findCategory[0].id })
        .where("price")
        .equals(priceRange)
        .sort(sort)
        .countDocuments();

      res.render("master/category", {
        allCategories: allCategories,
        findProducts: findProducts,
        latestProducts: latestProducts,
        findCategory: findCategory,
        minPrice: minPrice,
        maxPrice: maxPrice,
        sortOrder: sortOrder,
        category: paramsId,
        current: page,
        limit: Math.ceil(count / limit),
        count: count,
      });
    } catch (err) {
      console.log(err);
      res.render("errorPage/error", { layout: false });
    }
  },

  getProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      const allCategories = await Category.find();
      const relatedProducts = await Product.find().limit(4).exec();
      const isPurchased = await Order.exists({
        products: { $elemMatch: { productId: new Object(productId) } },
      })
        .where("userId")
        .equals(req.user?.id);

      const isInMyList = await Wishlist.exists()
        .where("userId")
        .equals(req.user?.id)
        .where("myList.productId")
        .equals(productId);

      const findProduct = await Product.findById(productId)
        .populate("category")
        .exec();

      if (findProduct) {
        res.render("master/productDetails", {
          findProduct: findProduct,
          allCategories: allCategories,
          relatedProducts: relatedProducts,
          isInMyList: isInMyList,
          isPurchased,
        });
      } else {
        res.render("errorPage/error", { layout: false });
      }
    } catch (err) {
      console.log(err);
      res.render("errorPage/error", { layout: false });
    }
  },

  getProductByKeyword: async (req, res) => {
    try {
      const limit = 9;
      const page = req.params.page || 1;
      const keyword = req.query.name || "";
      const minPrice = req.query.minPrice || 100;
      const maxPrice = req.query.maxPrice || 5000;
      const sortOrder = req.query.sort || "latest";
      let sort;
      const priceRange = { $gt: minPrice, $lt: maxPrice };
      const newProducts = await Product.find().limit(3);
      if (sortOrder == "asc") {
        sort = { price: 1 };
      } else if (sortOrder == "dsc") {
        sort = { price: -1 };
      } else {
        sort = { createdAt: -1 };
      }
      const allCategories = await Category.find();
      const category = await Category.find({
        categoryName: { $regex: keyword, $options: "i" },
      });
      const findProducts = await Product.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { brand: { $regex: keyword, $options: "i" } },
          { category: category[0]?.id },
        ],
      })
        .populate("category")
        .where("price")
        .equals(priceRange)
        .sort(sort)
        .skip(limit * page - limit)
        .limit(limit)
        .exec();

      const count = await Product.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { brand: { $regex: keyword, $options: "i" } },
        ],
      })
        .where("price")
        .equals(priceRange)
        .sort(sort)
        .countDocuments();

      res.render("master/search", {
        allCategories: allCategories,
        newProducts: newProducts,
        findProducts: findProducts,
        keyword: keyword,
        sortOrder: sortOrder,
        minPrice: minPrice,
        maxPrice: maxPrice,
        count: count,
        current: page,
        limit: Math.ceil(count / limit),
      });
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  },

  autoFill: async (req, res) => {
    let searchKey = req.body.searchKey.trim();
    try {
      let searchResult = await Product.find(
        {
          $or: [
            { name: { $regex: searchKey, $options: "i" } },
            { brand: { $regex: searchKey, $options: "i" } },
          ],
        },
        { name: 1, brand: 1 }
      ).exec();
      searchResult = searchResult.slice(0, 10);
      res.send({ searchResult: searchResult });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },

  myOrders: async (req, res) => {
    try {
      const allCategories = await Category.find();
      const userId = req.user.id;
      const myOrders = await Order.find({ userId })
        .populate([
          {
            path: "userId",
            model: "User",
          },
          {
            path: "products.productId",
            model: "Product",
          },
        ])
        .sort({ createdAt: -1 })
        .exec();
      res.render("master/myOrders", {
        myOrders: myOrders,
        allCategories: allCategories,
      });
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  },

  orderDetails: async (req, res) => {
    try {
      const allCategories = await Category.find();
      const orderId = req.params.id;
      const userId = req.user.id;
      const myOrder = await Order.findById(orderId)
        .populate([
          {
            path: "userId",
            model: "User",
          },
          {
            path: "coupon",
            model: "Coupon",
          },
          {
            path: "products.productId",
            model: "Product",
          },
        ])
        .exec();
      if (myOrder && myOrder.userId.id == userId) {
        res.render("master/orderDetails", {
          myOrder: myOrder,
          allCategories: allCategories,
        });
      } else {
        res.render("errorPage/error", { layout: false });
      }
    } catch (err) {
      console.log(err);
      res.render("errorPage/error", { layout: false });
    }
  },
};
