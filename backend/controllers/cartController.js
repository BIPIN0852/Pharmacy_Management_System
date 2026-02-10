const Cart = require("../models/Cart");
const Medicine = require("../models/Medicine");

// @desc    Get User Cart
// @route   GET /api/cart
// @access  Private
const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      // Return empty structure if no cart exists yet
      return res.status(200).json({ cartItems: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error Fetching Cart" });
  }
};

// @desc    Add Item to Cart (or Update Qty)
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const { medicineId, qty } = req.body;

  try {
    // 1. Fetch Medicine to check real-time stock
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // 2. Validate Stock
    if (medicine.countInStock < qty) {
      return res
        .status(400)
        .json({ message: `Only ${medicine.countInStock} items left in stock` });
    }

    // 3. Find User's Cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      // --- Cart Exists: Check if item is already inside ---
      const itemIndex = cart.cartItems.findIndex(
        (item) => item.medicine.toString() === medicineId
      );

      if (itemIndex > -1) {
        // Item exists, update quantity
        cart.cartItems[itemIndex].qty = qty;
        cart.cartItems[itemIndex].price = medicine.price; // Update price in case it changed
      } else {
        // Item doesn't exist, push new item
        cart.cartItems.push({
          medicine: medicine._id,
          name: medicine.name,
          qty,
          image: medicine.image,
          price: medicine.price,
          countInStock: medicine.countInStock,
        });
      }
    } else {
      // --- No Cart Exists: Create New ---
      cart = new Cart({
        user: req.user._id,
        cartItems: [
          {
            medicine: medicine._id,
            name: medicine.name,
            qty,
            image: medicine.image,
            price: medicine.price,
            countInStock: medicine.countInStock,
          },
        ],
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error Adding to Cart" });
  }
};

// @desc    Remove Item from Cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.cartItems = cart.cartItems.filter(
        (item) => item.medicine.toString() !== req.params.id
      );
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error Removing Item" });
  }
};

module.exports = { getUserCart, addToCart, removeFromCart };
