// const Product = require('../models/Product');

// // ==========================================
// // EXISTING CONTROLLERS
// // ==========================================

// const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find({}).populate('seller', '_id role name email');
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const createProduct = async (req, res) => {
//   const { title, description, price, image, location } = req.body;
//   try {
//     const product = await Product.create({
//       title,
//       description,
//       price,
//       image,
//       location,
//       seller: req.user._id
//     });
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // 🚩 Populate seller details taaki Chat button kaam kar sake
//     const product = await Product.findById(id).populate('seller', 'name email');

//     if (!product) {
//       return res.status(404).json({ message: "Product nahi mila!" });
//     }

//     res.json(product);
//   } catch (error) {
//     console.error("GetProductById Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ==========================================
// // NEW CONTROLLERS: EDIT & REMOVE
// // ==========================================

// // @desc    Update a product
// // @route   PUT /api/products/:id
// // @access  Private (Seller only)
// const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // 1. Find the product
//     let product = await Product.findById(id);

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // 2. SECURITY CHECK: Verify ownership
//     if (product.seller.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ error: "Not authorized to update this product" });
//     }

//     // 3. Update the product
//     product = await Product.findByIdAndUpdate(
//       id,
//       { $set: req.body },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       product
//     });

//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // @desc    Delete a product
// // @route   DELETE /api/products/:id
// // @access  Private (Seller only)
// const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // 1. Find the product
//     const product = await Product.findById(id);

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // 2. SECURITY CHECK: Verify ownership
//     if (product.seller.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ error: "Not authorized to delete this product" });
//     }

//     // 3. Delete the product
//     await product.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Product removed from marketplace",
//       id: id
//     });

//   } catch (error) {
//     console.error("Error deleting product:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ==========================================
// // EXPORTS
// // ==========================================
// module.exports = {
//   getProducts,
//   createProduct,
//   getProductById,
//   updateProduct,
//   deleteProduct
// };

const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('seller', '_id role name email');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('seller', 'name email');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, description, price, image, location } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      image,
      location,
      seller: req.user._id
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }

    product = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product removed from marketplace',
      id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};