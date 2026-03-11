const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, sellerOnly } = require('../middleware/auth');

// Seller dashboard analytics
router.get('/analytics', protect, sellerOnly, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    const productIds = products.map(p => p._id);

    const orders = await Order.find({ 'items.product': { $in: productIds } });

    let totalRevenue = 0;
    let totalSales = 0;
    const monthlySales = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        if (productIds.some(id => id.toString() === item.product?.toString())) {
          totalRevenue += item.price * item.quantity;
          totalSales += item.quantity;

          const month = new Date(order.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
          monthlySales[month] = (monthlySales[month] || 0) + (item.price * item.quantity);
        }
      });
    });

    const categoryData = {};
    products.forEach(p => {
      categoryData[p.category] = (categoryData[p.category] || 0) + 1;
    });

    res.json({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      totalSales,
      monthlySales: Object.entries(monthlySales).map(([month, revenue]) => ({ month, revenue })),
      categoryData: Object.entries(categoryData).map(([name, count]) => ({ name, count })),
      recentOrders: orders.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get seller products
router.get('/products', protect, sellerOnly, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort('-createdAt');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get seller orders
router.get('/orders', protect, sellerOnly, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    const productIds = products.map(p => p._id);
    const orders = await Order.find({ 'items.product': { $in: productIds } })
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status
router.put('/orders/:id/status', protect, sellerOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
