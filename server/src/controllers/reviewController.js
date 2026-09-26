import { store } from '../services/dataStore.js';

export const getReviews = async (req, res, next) => {
  try {
    const { status, limit } = req.query;
    const filter = {};
    if (status) filter.status = status;

    let reviews = await store.getReviews(filter);
    if (limit) {
      reviews = reviews.slice(0, Number(limit));
    }

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { productName, rating, title, comment, userName } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const review = await store.createReview({
      user: req.user ? req.user._id : null,
      userName: userName || (req.user ? req.user.name : 'Anonymous Collector'),
      productName: productName || 'General Experience',
      rating: Number(rating),
      title: title || '',
      comment,
      isVerifiedBuyer: true,
      status: 'Approved'
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await store.updateReview(id, { status });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      review: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await store.deleteReview(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
