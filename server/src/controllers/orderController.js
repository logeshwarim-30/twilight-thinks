import { store } from '../services/dataStore.js';

export const createOrder = async (req, res, next) => {
  try {
    const {
      customerDetails,
      items,
      shippingAddress,
      deliveryMethod,
      shippingCost,
      discountAmount,
      couponApplied,
      subtotal,
      totalAmount,
      paymentMethod
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    if (!customerDetails || !customerDetails.name || !customerDetails.email) {
      return res.status(400).json({ success: false, message: 'Customer details are required' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Shipping address is incomplete' });
    }

    const orderId = `TT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await store.createOrder({
      orderId,
      user: req.user ? req.user._id : null,
      customerDetails,
      items,
      shippingAddress,
      deliveryMethod: deliveryMethod || 'Standard',
      shippingCost: shippingCost || 0,
      discountAmount: discountAmount || 0,
      couponApplied: couponApplied || '',
      subtotal: subtotal || 0,
      totalAmount: totalAmount || subtotal,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: paymentMethod === 'Cash on Delivery' || paymentMethod === 'COD' ? 'Pending' : 'Paid',
      status: 'Confirmed',
      timeline: [
        {
          status: 'Confirmed',
          timestamp: new Date(),
          note: `Order placed successfully via ${paymentMethod || 'UPI'}`
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const email = req.user.email;
    const orders = await store.getOrders({ 'customerDetails.email': email });
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await store.getOrderById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Customer can view their own order, or guest order, or admin can view all
    if (req.user && req.user.role !== 'admin') {
      if (order.customerDetails?.email !== req.user.email && order.user !== req.user._id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let orders = await store.getOrders();

    if (status && status !== 'All') {
      orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      orders = orders.filter(o =>
        o.orderId.toLowerCase().includes(q) ||
        o.customerDetails?.name?.toLowerCase().includes(q) ||
        o.customerDetails?.email?.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Order status is required' });
    }

    const updated = await store.updateOrderStatus(id, status, note || `Status updated to ${status}`);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: updated
    });
  } catch (error) {
    next(error);
  }
};
