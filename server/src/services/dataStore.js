import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import {
  categoriesData,
  productsData,
  reviewsData,
  couponsData,
  customTattoosData,
  demoOrdersData,
  homepageCmsData
} from '../data/seedData.js';

import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import CustomTattoo from '../models/CustomTattoo.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import HomepageSection from '../models/HomepageSection.js';
import Settings from '../models/Settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_DB_PATH = path.join(__dirname, '../data/db_local.json');

class DataStore {
  constructor() {
    this.memoryData = {
      users: [],
      products: [],
      categories: [],
      orders: [],
      customTattoos: [],
      reviews: [],
      coupons: [],
      homepageSections: [],
      settings: null
    };
    this.useMongoose = false;
  }

  async initialize(isMongoConnected = false) {
    this.useMongoose = isMongoConnected;

    if (this.useMongoose) {
      console.log('[DataStore] Connected to MongoDB. Verifying seed data in database...');
      await this.seedMongoIfNeeded();
    } else {
      console.log('[DataStore] Initializing Standalone Store with local JSON persistence...');
      this.loadLocalJson();
      await this.seedMemoryIfNeeded();
    }
  }

  loadLocalJson() {
    try {
      if (fs.existsSync(LOCAL_DB_PATH)) {
        const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
        this.memoryData = JSON.parse(raw);
        console.log('[DataStore] Loaded existing data from local store.');
      }
    } catch (err) {
      console.warn('[DataStore] Could not read local json, will initialize clean:', err.message);
    }
  }

  saveLocalJson() {
    if (this.useMongoose) return;
    try {
      const dir = path.dirname(LOCAL_DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(this.memoryData, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DataStore] Failed to save local DB:', err.message);
    }
  }

  async seedMemoryIfNeeded() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@twilightthinks.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'TwilightAdmin@2026';
    const hashedAdminPass = await bcrypt.hash(adminPassword, 10);
    const hashedCustomerPass = await bcrypt.hash('Customer@2026', 10);

    if (!this.memoryData.users || this.memoryData.users.length === 0) {
      this.memoryData.users = [
        {
          _id: 'usr_admin_001',
          name: 'Twilight Master Admin',
          email: adminEmail,
          phone: '+91 99999 88888',
          password: hashedAdminPass,
          role: 'admin',
          addresses: [],
          wishlist: [],
          createdAt: new Date().toISOString()
        },
        {
          _id: 'usr_cust_001',
          name: 'Aarav Mehta',
          email: 'customer@twilightthinks.com',
          phone: '+91 98765 43210',
          password: hashedCustomerPass,
          role: 'customer',
          addresses: [
            {
              _id: 'addr_001',
              fullName: 'Aarav Mehta',
              phone: '+91 98765 43210',
              street: '402 Highline Towers, Pali Hill',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400050',
              isDefault: true
            }
          ],
          wishlist: ['prd_001', 'prd_003'],
          createdAt: new Date().toISOString()
        }
      ];
    }

    if (!this.memoryData.categories || this.memoryData.categories.length === 0) {
      this.memoryData.categories = categoriesData.map((c, i) => ({
        _id: `cat_${String(i + 1).padStart(3, '0')}`,
        ...c,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    }

    if (!this.memoryData.products || this.memoryData.products.length === 0) {
      this.memoryData.products = productsData.map((p, i) => ({
        _id: `prd_${String(i + 1).padStart(3, '0')}`,
        ...p,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    }

    if (!this.memoryData.reviews || this.memoryData.reviews.length === 0) {
      this.memoryData.reviews = reviewsData.map((r, i) => ({
        _id: `rev_${String(i + 1).padStart(3, '0')}`,
        ...r,
        createdAt: new Date().toISOString()
      }));
    }

    if (!this.memoryData.coupons || this.memoryData.coupons.length === 0) {
      this.memoryData.coupons = couponsData.map((cp, i) => ({
        _id: `cpn_${String(i + 1).padStart(3, '0')}`,
        ...cp,
        createdAt: new Date().toISOString()
      }));
    }

    if (!this.memoryData.customTattoos || this.memoryData.customTattoos.length === 0) {
      this.memoryData.customTattoos = customTattoosData.map((ct, i) => ({
        _id: `ct_${String(i + 1).padStart(3, '0')}`,
        ...ct,
        createdAt: new Date().toISOString()
      }));
    }

    if (!this.memoryData.orders || this.memoryData.orders.length === 0) {
      this.memoryData.orders = demoOrdersData.map((o, i) => ({
        _id: `ord_${String(i + 1).padStart(3, '0')}`,
        ...o,
        createdAt: new Date().toISOString()
      }));
    }

    if (!this.memoryData.homepageSections || this.memoryData.homepageSections.length === 0) {
      this.memoryData.homepageSections = homepageCmsData.map((sec, i) => ({
        _id: `sec_${String(i + 1).padStart(3, '0')}`,
        ...sec,
        createdAt: new Date().toISOString()
      }));
    }

    this.saveLocalJson();
    console.log(`[DataStore] Memory store seeded: ${this.memoryData.products.length} products, ${this.memoryData.categories.length} categories, ${this.memoryData.orders.length} orders.`);
  }

  async seedMongoIfNeeded() {
    try {
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        console.log('[DataStore] Seeding MongoDB collections...');
        await Category.insertMany(categoriesData);
        await Product.insertMany(productsData);
        await Review.insertMany(reviewsData);
        await Coupon.insertMany(couponsData);
        await CustomTattoo.insertMany(customTattoosData);
        await Order.insertMany(demoOrdersData);
        await HomepageSection.insertMany(homepageCmsData);

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@twilightthinks.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'TwilightAdmin@2026';
        await User.create({
          name: 'Twilight Master Admin',
          email: adminEmail,
          phone: '+91 99999 88888',
          password: adminPassword,
          role: 'admin'
        });

        await User.create({
          name: 'Aarav Mehta',
          email: 'customer@twilightthinks.com',
          phone: '+91 98765 43210',
          password: 'Customer@2026',
          role: 'customer'
        });

        console.log('[DataStore] MongoDB seeded successfully!');
      }
    } catch (err) {
      console.error('[DataStore] Mongo seeding error:', err.message);
    }
  }

  // --- Products ---
  async getProducts(filter = {}) {
    if (this.useMongoose) {
      return await Product.find(filter).lean();
    }
    return this.memoryData.products.filter(p => {
      if (filter.category && p.category.toLowerCase() !== filter.category.toLowerCase()) return false;
      if (filter.isPublished !== undefined && p.isPublished !== filter.isPublished) return false;
      if (filter.featured && !p.featured) return false;
      if (filter.trending && !p.trending) return false;
      if (filter.newArrival && !p.newArrival) return false;
      if (filter.bestSeller && !p.bestSeller) return false;
      return true;
    });
  }

  async getProductByIdOrSlug(idOrSlug) {
    if (this.useMongoose) {
      const bySlug = await Product.findOne({ slug: idOrSlug.toLowerCase() }).lean();
      if (bySlug) return bySlug;
      if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        return await Product.findById(idOrSlug).lean();
      }
      return null;
    }
    return this.memoryData.products.find(p => p._id === idOrSlug || p.slug === idOrSlug.toLowerCase()) || null;
  }

  async createProduct(productData) {
    if (this.useMongoose) {
      const created = await Product.create(productData);
      return created.toObject();
    }
    const newProduct = {
      _id: `prd_${Date.now()}`,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.memoryData.products.unshift(newProduct);
    this.saveLocalJson();
    return newProduct;
  }

  async updateProduct(id, updates) {
    if (this.useMongoose) {
      return await Product.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
    const index = this.memoryData.products.findIndex(p => p._id === id);
    if (index === -1) return null;
    this.memoryData.products[index] = {
      ...this.memoryData.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveLocalJson();
    return this.memoryData.products[index];
  }

  async deleteProduct(id) {
    if (this.useMongoose) {
      return await Product.findByIdAndDelete(id);
    }
    const index = this.memoryData.products.findIndex(p => p._id === id);
    if (index === -1) return false;
    this.memoryData.products.splice(index, 1);
    this.saveLocalJson();
    return true;
  }

  // --- Categories ---
  async getCategories() {
    if (this.useMongoose) {
      return await Category.find().lean();
    }
    return this.memoryData.categories;
  }

  async createCategory(catData) {
    if (this.useMongoose) {
      const cat = await Category.create(catData);
      return cat.toObject();
    }
    const newCat = {
      _id: `cat_${Date.now()}`,
      ...catData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.memoryData.categories.push(newCat);
    this.saveLocalJson();
    return newCat;
  }

  async updateCategory(id, updates) {
    if (this.useMongoose) {
      return await Category.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
    const index = this.memoryData.categories.findIndex(c => c._id === id);
    if (index === -1) return null;
    this.memoryData.categories[index] = {
      ...this.memoryData.categories[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveLocalJson();
    return this.memoryData.categories[index];
  }

  async deleteCategory(id) {
    if (this.useMongoose) {
      return await Category.findByIdAndDelete(id);
    }
    const index = this.memoryData.categories.findIndex(c => c._id === id);
    if (index === -1) return false;
    this.memoryData.categories.splice(index, 1);
    this.saveLocalJson();
    return true;
  }

  // --- Users ---
  async findUserByEmail(email) {
    if (this.useMongoose) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    return this.memoryData.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(id) {
    if (this.useMongoose) {
      return await User.findById(id).select('-password').lean();
    }
    const u = this.memoryData.users.find(usr => usr._id === id);
    if (!u) return null;
    const { password, ...safeUser } = u;
    return safeUser;
  }

  async createUser(userData) {
    if (this.useMongoose) {
      return await User.create(userData);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      _id: `usr_${Date.now()}`,
      ...userData,
      password: hashedPassword,
      role: userData.role || 'customer',
      addresses: userData.addresses || [],
      wishlist: userData.wishlist || [],
      createdAt: new Date().toISOString()
    };
    this.memoryData.users.push(newUser);
    this.saveLocalJson();
    const { password, ...safe } = newUser;
    return safe;
  }

  async getAllUsers() {
    if (this.useMongoose) {
      return await User.find().select('-password').lean();
    }
    return this.memoryData.users.map(({ password, ...u }) => u);
  }

  async updateUser(id, updates) {
    if (this.useMongoose) {
      return await User.findByIdAndUpdate(id, updates, { new: true }).select('-password').lean();
    }
    const idx = this.memoryData.users.findIndex(u => u._id === id);
    if (idx === -1) return null;
    this.memoryData.users[idx] = { ...this.memoryData.users[idx], ...updates };
    this.saveLocalJson();
    const { password, ...safe } = this.memoryData.users[idx];
    return safe;
  }

  // --- Orders ---
  async getOrders(filter = {}) {
    if (this.useMongoose) {
      return await Order.find(filter).sort({ createdAt: -1 }).lean();
    }
    let list = [...this.memoryData.orders];
    if (filter['customerDetails.email']) {
      list = list.filter(o => o.customerDetails?.email === filter['customerDetails.email']);
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getOrderById(id) {
    if (this.useMongoose) {
      const byOrderId = await Order.findOne({ orderId: id }).lean();
      if (byOrderId) return byOrderId;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        return await Order.findById(id).lean();
      }
      return null;
    }
    return this.memoryData.orders.find(o => o._id === id || o.orderId === id) || null;
  }

  async createOrder(orderData) {
    if (this.useMongoose) {
      const order = await Order.create(orderData);
      return order.toObject();
    }
    const newOrder = {
      _id: `ord_${Date.now()}`,
      orderId: orderData.orderId || `TT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      ...orderData,
      status: orderData.status || 'Confirmed',
      timeline: orderData.timeline || [
        { status: 'Confirmed', timestamp: new Date().toISOString(), note: 'Order placed successfully' }
      ],
      createdAt: new Date().toISOString()
    };
    this.memoryData.orders.unshift(newOrder);
    this.saveLocalJson();
    return newOrder;
  }

  async updateOrderStatus(id, status, note = '') {
    if (this.useMongoose) {
      return await Order.findOneAndUpdate(
        { $or: [{ _id: id }, { orderId: id }] },
        {
          $set: { status },
          $push: { timeline: { status, timestamp: new Date(), note } }
        },
        { new: true }
      ).lean();
    }
    const order = this.memoryData.orders.find(o => o._id === id || o.orderId === id);
    if (!order) return null;
    order.status = status;
    if (!order.timeline) order.timeline = [];
    order.timeline.push({ status, timestamp: new Date().toISOString(), note });
    this.saveLocalJson();
    return order;
  }

  // --- Custom Tattoos ---
  async getCustomTattoos(filter = {}) {
    if (this.useMongoose) {
      const query = {};
      if (filter.email) query['customer.email'] = filter.email;
      if (filter.userId) query['user'] = filter.userId;
      if (filter.status) query['status'] = filter.status;
      return await CustomTattoo.find(query).sort({ createdAt: -1 }).lean();
    }
    return [...this.memoryData.customTattoos]
      .filter(ct => {
        if (filter.email && ct.customer?.email?.toLowerCase() !== filter.email.toLowerCase()) return false;
        if (filter.userId && ct.user !== filter.userId) return false;
        if (filter.status && ct.status?.toLowerCase() !== filter.status.toLowerCase()) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getCustomTattooById(id) {
    if (this.useMongoose) {
      const byRequestId = await CustomTattoo.findOne({ requestId: id }).lean();
      if (byRequestId) return byRequestId;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        return await CustomTattoo.findById(id).lean();
      }
      return null;
    }
    return this.memoryData.customTattoos.find(ct => ct._id === id || ct.requestId === id) || null;
  }

  async createCustomTattoo(data) {
    if (this.useMongoose) {
      const created = await CustomTattoo.create(data);
      return created.toObject();
    }
    const newCt = {
      _id: `ct_${Date.now()}`,
      requestId: data.requestId || `CT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      ...data,
      status: data.status || 'New',
      createdAt: new Date().toISOString()
    };
    this.memoryData.customTattoos.unshift(newCt);
    this.saveLocalJson();
    return newCt;
  }

  async updateCustomTattoo(id, updates) {
    if (this.useMongoose) {
      return await CustomTattoo.findOneAndUpdate(
        { $or: [{ _id: id }, { requestId: id }] },
        updates,
        { new: true }
      ).lean();
    }
    const item = this.memoryData.customTattoos.find(ct => ct._id === id || ct.requestId === id);
    if (!item) return null;
    Object.assign(item, updates, { updatedAt: new Date().toISOString() });
    this.saveLocalJson();
    return item;
  }

  // --- Reviews ---
  async getReviews(filter = {}) {
    if (this.useMongoose) {
      return await Review.find(filter).sort({ createdAt: -1 }).lean();
    }
    return this.memoryData.reviews.filter(r => {
      if (filter.status && r.status !== filter.status) return false;
      return true;
    });
  }

  async createReview(revData) {
    if (this.useMongoose) {
      const review = await Review.create(revData);
      return review.toObject();
    }
    const newRev = {
      _id: `rev_${Date.now()}`,
      ...revData,
      status: revData.status || 'Approved',
      createdAt: new Date().toISOString()
    };
    this.memoryData.reviews.unshift(newRev);
    this.saveLocalJson();
    return newRev;
  }

  async updateReview(id, updates) {
    if (this.useMongoose) {
      return await Review.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
    const rev = this.memoryData.reviews.find(r => r._id === id);
    if (!rev) return null;
    Object.assign(rev, updates);
    this.saveLocalJson();
    return rev;
  }

  async deleteReview(id) {
    if (this.useMongoose) {
      return await Review.findByIdAndDelete(id);
    }
    const idx = this.memoryData.reviews.findIndex(r => r._id === id);
    if (idx === -1) return false;
    this.memoryData.reviews.splice(idx, 1);
    this.saveLocalJson();
    return true;
  }

  // --- Coupons ---
  async getCoupons() {
    if (this.useMongoose) {
      return await Coupon.find().lean();
    }
    return this.memoryData.coupons;
  }

  async getCouponByCode(code) {
    if (this.useMongoose) {
      return await Coupon.findOne({ code: code.toUpperCase() }).lean();
    }
    return this.memoryData.coupons.find(c => c.code.toUpperCase() === code.toUpperCase()) || null;
  }

  async createCoupon(data) {
    if (this.useMongoose) {
      const c = await Coupon.create(data);
      return c.toObject();
    }
    const newCoupon = {
      _id: `cpn_${Date.now()}`,
      ...data,
      code: data.code.toUpperCase(),
      createdAt: new Date().toISOString()
    };
    this.memoryData.coupons.push(newCoupon);
    this.saveLocalJson();
    return newCoupon;
  }

  async updateCoupon(id, updates) {
    if (this.useMongoose) {
      return await Coupon.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
    const coupon = this.memoryData.coupons.find(c => c._id === id);
    if (!coupon) return null;
    Object.assign(coupon, updates);
    this.saveLocalJson();
    return coupon;
  }

  async deleteCoupon(id) {
    if (this.useMongoose) {
      return await Coupon.findByIdAndDelete(id);
    }
    const idx = this.memoryData.coupons.findIndex(c => c._id === id);
    if (idx === -1) return false;
    this.memoryData.coupons.splice(idx, 1);
    this.saveLocalJson();
    return true;
  }

  // --- Homepage CMS ---
  async getHomepageSections() {
    if (this.useMongoose) {
      return await HomepageSection.find().sort({ order: 1 }).lean();
    }
    return [...this.memoryData.homepageSections].sort((a, b) => a.order - b.order);
  }

  async updateHomepageSection(key, updates) {
    if (this.useMongoose) {
      return await HomepageSection.findOneAndUpdate({ key }, updates, { new: true }).lean();
    }
    const sec = this.memoryData.homepageSections.find(s => s.key === key);
    if (!sec) return null;
    Object.assign(sec, updates);
    this.saveLocalJson();
    return sec;
  }

  // --- Studio Settings ---
  async getSettings() {
    const defaultSettings = {
      studioName: 'TWILIGHT THINKS',
      tagline: 'Premium Tattoo Studio & Custom Body Art Atelier',
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      email: 'concierge@twilightthinks.com',
      instagram: 'https://instagram.com/twilightthinks',
      address: 'Suite 402, Highline Atelier, Bandra West, Mumbai 400050',
      hours: 'Mon–Sat: 10:00 AM – 8:00 PM IST',
      currency: 'INR',
      currencySymbol: '₹',
      consultationFee: 0,
      minimumCustomPrice: 500
    };

    if (this.useMongoose) {
      let settings = await Settings.findOne().lean();
      if (!settings) {
        settings = await Settings.create(defaultSettings);
        settings = settings.toObject();
      }
      return settings;
    }

    if (!this.memoryData.settings) {
      this.memoryData.settings = { ...defaultSettings, updatedAt: new Date().toISOString() };
      this.saveLocalJson();
    }
    return this.memoryData.settings;
  }

  async updateSettings(updates) {
    if (this.useMongoose) {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = await Settings.create(updates);
      } else {
        Object.assign(settings, updates);
        await settings.save();
      }
      return settings.toObject ? settings.toObject() : settings;
    }

    if (!this.memoryData.settings) {
      await this.getSettings();
    }
    Object.assign(this.memoryData.settings, updates, { updatedAt: new Date().toISOString() });
    this.saveLocalJson();
    return this.memoryData.settings;
  }
}

export const store = new DataStore();
