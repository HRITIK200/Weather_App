import express from 'express';
import {
  getFavorites,
  getIndianStatesList,
  createFavorite,
  deleteFavorite,
} from '../controllers/favoritesController.js';

const router = express.Router();

router.get('/', getFavorites);
router.get('/indian-states', getIndianStatesList);
router.post('/', createFavorite);
router.delete('/:id', deleteFavorite);

export default router;
