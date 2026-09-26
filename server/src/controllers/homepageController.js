import { store } from '../services/dataStore.js';

export const getHomepageSections = async (req, res, next) => {
  try {
    const sections = await store.getHomepageSections();
    res.json({
      success: true,
      sections
    });
  } catch (error) {
    next(error);
  }
};

export const updateHomepageSection = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { title, subtitle, badge, content, isActive, order } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (subtitle !== undefined) updates.subtitle = subtitle;
    if (badge !== undefined) updates.badge = badge;
    if (content !== undefined) updates.content = content;
    if (isActive !== undefined) updates.isActive = Boolean(isActive);
    if (order !== undefined) updates.order = Number(order);

    const updated = await store.updateHomepageSection(key, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    res.json({
      success: true,
      message: 'Homepage section updated successfully',
      section: updated
    });
  } catch (error) {
    next(error);
  }
};
