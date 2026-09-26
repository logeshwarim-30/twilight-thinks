import { store } from '../services/dataStore.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await store.getCategories();
    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, featured } = req.body;
    if (!name || !image) {
      return res.status(400).json({ success: false, message: 'Category name and image URL are required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const category = await store.createCategory({
      name,
      slug,
      description: description || '',
      image,
      featured: featured !== undefined ? Boolean(featured) : true,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.name && !updates.slug) {
      updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const updated = await store.updateCategory(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      category: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await store.deleteCategory(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
