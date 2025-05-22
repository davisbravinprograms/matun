// const multer = require("multer")

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/files");
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split("/")[1];
//         cb(null, `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`);
//     },
// });

// const multerFilter = (req, file, cb) => {
//     if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/webp" || file.mimetype == "image/gif") {
//         cb(null, true);
//     } else {
//         return cb(new Error("File not supported"), false);
//     }
// };

// const upload = multer({
//     storage: multerStorage,
//     fileFilter: multerFilter,
// })

// const uploadImages = upload.array("productImages", 4)
// const uploadBanner = upload.single("bannerImage")

// module.exports = {
//     productImage: (req, res, next) => {
//         return uploadImages(req, res, (err) => {
//             if (err instanceof multer.MulterError) {
//                 // A Multer error occurred when uploading.
//                 req.flash("message", "Error uploading files, max 4 images")
//                 res.redirect("/admin/products")
//             } else if (err) {
//                 // An unknown error occurred when uploading.
//                 req.flash("message", "Only support image files")
//                 res.redirect("/admin/products")
//             } else {
//                 next()
//             }
//         })
//     },

//     bannerImage: (req, res, next) => {
//         return uploadBanner(req, res, (err) => {
//             if (err instanceof multer.MulterError) {
//                 // A Multer error occurred when uploading.
//                 console.log(err)
//                 req.flash("message", "Error uploading file")
//                 res.redirect("/admin/banners")
//             } else if (err) {
//                 console.log(err)
//                 req.flash("message", "Only support image files")
//                 res.redirect("/admin/banners")
//             } else {
//                 next()
//             }
//         })
//     }

// }







const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with your credentials (make sure to set env vars)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage config for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "your_folder_name", // optional folder in your Cloudinary account
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

// Multer upload instance using Cloudinary storage
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/webp" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(new Error("File not supported"), false);
    }
  },
});

const uploadImages = upload.array("productImages", 4);
const uploadBanner = upload.single("bannerImage");

module.exports = {
  productImage: (req, res, next) => {
    return uploadImages(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        req.flash("message", "Error uploading files, max 4 images");
        return res.redirect("/admin/products");
      } else if (err) {
        req.flash("message", "Only support image files");
        return res.redirect("/admin/products");
      } else {
        next();
      }
    });
  },

  bannerImage: (req, res, next) => {
    return uploadBanner(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        req.flash("message", "Error uploading file");
        return res.redirect("/admin/banners");
      } else if (err) {
        req.flash("message", "Only support image files");
        return res.redirect("/admin/banners");
      } else {
        next();
      }
    });
  },
};
