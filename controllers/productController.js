// const Product = require("../models/product")
// const fs = require("fs").promises

// module.exports = {
//     addProduct: async (req, res) => {
//         try {
//             const price = parseFloat(req.body.price)
//             const discount = req.body.discount ? parseFloat(req.body.discount) : null
//             const offerPrice = req.body.discount ? price - ((price / 100) * discount) : null;
//             const isFeatured = req.body.isFeatured == 'on' ? true : false
//             const productImages = req.files != null ? req.files.map((img) => img.filename) : null
//             const product = new Product({
//                 name: req.body.name,
//                 brand: req.body.brand,
//                 category: req.body.category,
//                 quantity: req.body.quantity,
//                 price: price,
//                 discount: discount,
//                 offerPrice: offerPrice,
//                 isFeatured: isFeatured,
//                 description: req.body.description,
//                 productImagePath: productImages
//             })
//             await product.save()
//             res.redirect("/admin/products")

//         } catch (err) {
//             console.log(err)
//             req.flash("message", "Error Adding product")
//             res.redirect("/admin/products")
//         }

//     },

//     editProduct: async (req, res) => {
//         let product
//         try {
//             product = await Product.findById(req.params.id)
//             const price = parseFloat(req.body.price)
//             const discount = req.body.discount ? parseFloat(req.body.discount) : null
//             const offerPrice = req.body.discount ? price - ((price / 100) * discount) : null;
//             const isFeatured = req.body.isFeatured == "on" ? true : false
//             const oldProductImages = product.productImagePath
//             const productImages = req.files.length > 0 ? req.files.map((img) => img.filename) : oldProductImages
//             await Product.findByIdAndUpdate(req.params.id, {
//                 name: req.body.name,
//                 brand: req.body.brand,
//                 category: req.body.category,
//                 quantity: req.body.quantity,
//                 price: price,
//                 discount: discount,
//                 offerPrice: offerPrice,
//                 isFeatured: isFeatured,
//                 description: req.body.description,
//                 productImagePath: productImages
//             })
//             if (req.files.length > 0) {
//                 oldProductImages.forEach(async (image) => {
//                     await fs.unlink("./public/files/" + image)
//                 })
//             }
//             res.redirect("/admin/products")
//         } catch (err) {
//             console.log(err)
//             req.flash("message", "Error updating product")
//             res.redirect("/admin/products")
//         }
//     },

//     deleteProduct: async (req, res) => {
//         try {
//             const product = await Product.findById(req.params.id)
//             const productImages = product.productImagePath
//             await product.remove()
//             productImages.forEach(async (image) => {
//                 await fs.unlink("./public/files/" + image)
//             })

//             res.redirect("/admin/products")
//         } catch (err) {
//             console.log(err)
//             req.flash("message", "Error deleting product")
//             res.redirect("/admin/products")
//         }
//     },

// }



const Product = require("../models/product");

module.exports = {
  addProduct: async (req, res) => {
    try {
      const price = parseFloat(req.body.price);
      const discount = req.body.discount ? parseFloat(req.body.discount) : null;
      const offerPrice = req.body.discount ? price - (price / 100) * discount : null;
      const isFeatured = req.body.isFeatured === "on" ? true : false;

      // Save Cloudinary URLs instead of filenames
      const productImages = req.files ? req.files.map((file) => file.path) : null;

      const product = new Product({
        name: req.body.name,
        brand: req.body.brand,
        category: req.body.category,
        quantity: req.body.quantity,
        price: price,
        discount: discount,
        offerPrice: offerPrice,
        isFeatured: isFeatured,
        description: req.body.description,
        productImagePath: productImages,
      });

      await product.save();
      res.redirect("/admin/products");
    } catch (err) {
      console.log(err);
      req.flash("message", "Error Adding product");
      res.redirect("/admin/products");
    }
  },

  editProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      const price = parseFloat(req.body.price);
      const discount = req.body.discount ? parseFloat(req.body.discount) : null;
      const offerPrice = req.body.discount ? price - (price / 100) * discount : null;
      const isFeatured = req.body.isFeatured === "on" ? true : false;

      const oldProductImages = product.productImagePath;

      // Use new Cloudinary URLs if files uploaded, else keep old URLs
      const productImages =
        req.files && req.files.length > 0 ? req.files.map((file) => file.path) : oldProductImages;

      await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        brand: req.body.brand,
        category: req.body.category,
        quantity: req.body.quantity,
        price: price,
        discount: discount,
        offerPrice: offerPrice,
        isFeatured: isFeatured,
        description: req.body.description,
        productImagePath: productImages,
      });

      res.redirect("/admin/products");
    } catch (err) {
      console.log(err);
      req.flash("message", "Error updating product");
      res.redirect("/admin/products");
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      await product.remove();
      // No need to unlink files locally, Cloudinary manages storage.

      res.redirect("/admin/products");
    } catch (err) {
      console.log(err);
      req.flash("message", "Error deleting product");
      res.redirect("/admin/products");
    }
  },
};
