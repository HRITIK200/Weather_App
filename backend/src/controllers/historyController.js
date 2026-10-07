import * as historyModel from '../models/historyModel.js';

export const getHistory = async (req, res, next) => {
  try {
    const list = await historyModel.getAllHistory();
    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await historyModel.deleteHistoryEntry(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'History item not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'History item removed',
      data: deleted,
    });
  } catch (err) {
    return next(err);
  }
};
