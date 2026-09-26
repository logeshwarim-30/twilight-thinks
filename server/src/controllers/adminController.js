import { store } from '../services/dataStore.js';

export const getAnalytics = async (req, res, next) => {
  try {
    const products = await store.getProducts();
    const orders = await store.getOrders();
    const users = await store.getAllUsers();
    const customTattoos = await store.getCustomTattoos();

    // KPIs
    const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const totalCustomers = users.filter(u => u.role !== 'admin').length;
    const lowStockCount = products.filter(p => (p.stock || 0) <= 25).length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

    // Recent orders
    const recentOrders = orders.slice(0, 5);

    // Top selling products
    const topProducts = [...products]
      .sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0) || b.reviewCount - a.reviewCount)
      .slice(0, 5);

    // Low stock items
    const lowStockProducts = products
      .filter(p => (p.stock || 0) <= 30)
      .slice(0, 6)
      .map(p => ({
        _id: p._id,
        name: p.name,
        sku: p.sku,
        stock: p.stock,
        threshold: 25,
        status: p.stock <= 0 ? 'OUT OF STOCK' : p.stock <= 25 ? 'LOW STOCK' : 'IN STOCK'
      }));

    // Demo chart trends
    const salesChart = [
      { month: 'Jan', sales: 42000, orders: 84 },
      { month: 'Feb', sales: 58000, orders: 112 },
      { month: 'Mar', sales: 74000, orders: 148 },
      { month: 'Apr', sales: 89000, orders: 172 },
      { month: 'May', sales: 112000, orders: 210 },
      { month: 'Jun', sales: 138000, orders: 265 }
    ];

    res.json({
      success: true,
      analytics: {
        totalSales,
        totalOrders,
        totalCustomers,
        lowStockCount,
        avgOrderValue,
        customTattooRequests: customTattoos.length,
        salesChart,
        recentOrders,
        topProducts,
        lowStockProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const users = await store.getAllUsers();
    const orders = await store.getOrders();

    const customerList = users
      .filter(u => u.role !== 'admin')
      .map(u => {
        const userOrders = orders.filter(o => o.customerDetails?.email === u.email || o.user === u._id);
        const totalSpent = userOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
        const lastOrder = userOrders[0] ? userOrders[0].createdAt : null;

        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone || 'N/A',
          ordersCount: userOrders.length,
          totalSpent,
          lastOrder,
          status: 'Active',
          createdAt: u.createdAt
        };
      });

    res.json({
      success: true,
      count: customerList.length,
      customers: customerList
    });
  } catch (error) {
    next(error);
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const products = await store.getProducts();

    const inventory = products.map(p => {
      let status = 'IN STOCK';
      if (p.stock <= 0) status = 'OUT OF STOCK';
      else if (p.stock <= 25) status = 'LOW STOCK';

      return {
        _id: p._id,
        name: p.name,
        sku: p.sku,
        category: p.category,
        currentStock: p.stock,
        threshold: 25,
        status,
        price: p.price,
        image: p.images?.[0]
      };
    });

    res.json({
      success: true,
      count: inventory.length,
      inventory
    });
  } catch (error) {
    next(error);
  }
};

export const updateInventoryStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({ success: false, message: 'Stock value is required' });
    }

    const updated = await store.updateProduct(id, { stock: Number(stock) });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let status = 'IN STOCK';
    if (updated.stock <= 0) status = 'OUT OF STOCK';
    else if (updated.stock <= 25) status = 'LOW STOCK';

    res.json({
      success: true,
      message: 'Inventory updated successfully',
      item: {
        _id: updated._id,
        name: updated.name,
        sku: updated.sku,
        currentStock: updated.stock,
        threshold: 25,
        status
      }
    });
  } catch (error) {
    next(error);
  }
};
