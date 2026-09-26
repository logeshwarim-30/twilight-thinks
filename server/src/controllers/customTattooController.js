import { store } from '../services/dataStore.js';

export const createCustomTattoo = async (req, res, next) => {
  try {
    const {
      customer,
      type,
      style,
      tattooIdea,
      customText,
      font,
      description,
      requiredChanges,
      placement,
      size,
      artworkUrl,
      budget,
      preferredDate,
      preferredTime,
      notes
    } = req.body;

    const customerData = customer || {
      name: req.user ? req.user.name : 'Guest Collector',
      email: req.user ? req.user.email : 'guest@example.com',
      phone: req.user ? req.user.phone : ''
    };

    if (!customerData.name || !customerData.email) {
      return res.status(400).json({ success: false, message: 'Customer name and email are required.' });
    }

    const requestId = `CT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const customTattoo = await store.createCustomTattoo({
      requestId,
      user: req.user ? req.user._id : null,
      customer: customerData,
      type: type || 'Custom Artwork',
      style: style || type || 'Custom Artwork',
      tattooIdea: tattooIdea || customText || 'Bespoke Studio Tattoo',
      customText: customText || '',
      font: font || 'Gothic Serif',
      description: description || requiredChanges || '',
      requiredChanges: requiredChanges || description || '',
      placement: placement || 'Arm',
      size: size || 'Medium',
      artworkUrl: artworkUrl || '',
      budget: budget || '',
      preferredDate: preferredDate || '',
      preferredTime: preferredTime || '',
      notes: notes || '',
      price: 0,
      quotedPrice: 0,
      isCustomerConfirmed: false,
      status: 'Pending',
      internalNotes: 'Request submitted online by customer'
    });

    res.status(201).json({
      success: true,
      message: 'Custom tattoo design request submitted to studio successfully.',
      customTattoo
    });
  } catch (error) {
    next(error);
  }
};

export const getMyCustomTattoos = async (req, res, next) => {
  try {
    const email = req.user?.email;
    const userId = req.user?._id;

    const allRequests = await store.getCustomTattoos();
    const myRequests = allRequests.filter(r =>
      (userId && r.user === userId) ||
      (email && r.customer?.email?.toLowerCase() === email.toLowerCase())
    );

    res.json({
      success: true,
      count: myRequests.length,
      customTattoos: myRequests
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomTattoos = async (req, res, next) => {
  try {
    const { status, type, search } = req.query;
    let requests = await store.getCustomTattoos();

    if (status && status !== 'All') {
      requests = requests.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }

    if (type && type !== 'All') {
      requests = requests.filter(r => (r.type || r.style || '').toLowerCase() === type.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      requests = requests.filter(r =>
        r.requestId.toLowerCase().includes(q) ||
        r.customer?.name?.toLowerCase().includes(q) ||
        r.customer?.email?.toLowerCase().includes(q) ||
        (r.tattooIdea && r.tattooIdea.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: requests.length,
      customTattoos: requests
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomTattooById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await store.getCustomTattooById(id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Custom tattoo request not found' });
    }

    res.json({
      success: true,
      customTattoo: request
    });
  } catch (error) {
    next(error);
  }
};

export const updateCustomTattoo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, internalNotes, price, quotedPrice } = req.body;

    const updates = {};
    if (status) updates.status = status;
    if (internalNotes !== undefined) updates.internalNotes = internalNotes;
    if (quotedPrice !== undefined) {
      updates.quotedPrice = Number(quotedPrice);
      updates.price = Number(quotedPrice);
      if (!status || status === 'Pending') {
        updates.status = 'Price Quoted';
      }
    } else if (price !== undefined) {
      updates.price = Number(price);
      updates.quotedPrice = Number(price);
    }

    const updated = await store.updateCustomTattoo(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Custom tattoo request not found' });
    }

    res.json({
      success: true,
      message: 'Custom tattoo request updated successfully',
      customTattoo: updated
    });
  } catch (error) {
    next(error);
  }
};

export const confirmCustomTattoo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await store.getCustomTattooById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Custom tattoo request not found' });
    }

    const updates = {
      isCustomerConfirmed: true,
      customerConfirmationDate: new Date(),
      status: 'Confirmed',
      internalNotes: `${existing.internalNotes ? existing.internalNotes + ' | ' : ''}Customer accepted quotation of ₹${existing.quotedPrice || existing.price || 0} on ${new Date().toLocaleDateString()}`
    };

    const updated = await store.updateCustomTattoo(id, updates);

    res.json({
      success: true,
      message: 'Quotation confirmed! Our tattoo artist will prepare your stencil and schedule your studio session.',
      customTattoo: updated
    });
  } catch (error) {
    next(error);
  }
};
