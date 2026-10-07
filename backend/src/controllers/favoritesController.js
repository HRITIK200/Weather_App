import * as favoritesModel from '../models/favoritesModel.js';

export const getFavorites = async (req, res, next) => {
  try {
    const { region } = req.query;
    const favorites = await favoritesModel.getAllFavorites(region);
    return res.status(200).json({
      success: true,
      data: favorites,
    });
  } catch (err) {
    return next(err);
  }
};

export const getIndianStatesList = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: favoritesModel.INDIAN_STATES_AND_CITIES,
    });
  } catch (err) {
    return next(err);
  }
};

export const createFavorite = async (req, res, next) => {
  try {
    const { city_name, state, country, region, lat, lon } = req.body;

    if (!city_name) {
      return res.status(400).json({
        success: false,
        message: 'city_name is required to pin a favorite',
      });
    }

    const created = await favoritesModel.addFavorite(city_name, country, lat, lon, state, region);
    return res.status(201).json({
      success: true,
      message: 'City added to favorites',
      data: created,
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await favoritesModel.deleteFavorite(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Favorite city not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'City removed from favorites',
      data: deleted,
    });
  } catch (err) {
    return next(err);
  }
};
