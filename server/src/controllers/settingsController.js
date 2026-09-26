import { store } from '../services/dataStore.js';

export const getSettings = async (req, res, next) => {
  try {
    const settings = await store.getSettings();
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body;
    const settings = await store.updateSettings(updates);
    res.json({
      success: true,
      message: 'Studio settings updated successfully',
      settings
    });
  } catch (error) {
    next(error);
  }
};
