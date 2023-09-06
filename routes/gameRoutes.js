import express from 'express';
import { getById,getAll,addOnce,updateOnce,deleteOnce, updateGameById, getGameByGameId, deleteGameById} from '../controllers/gameController.js';

const router = express.Router();

// Get all games
router.get('/', getAll);

// Get game by ID
router.get('/:id', getById);
//get,put,delete by gameId generated by unity
router.get('/get/:gameId', getGameByGameId);
router.put('/put/:gameId', updateGameById);
router.delete('/delete/:gameId', deleteGameById);

// Create new game
router.post('/', addOnce);


// Update game by ID
router.put('/:id', updateOnce);

// Delete game by ID
router.delete('/:id', deleteOnce);

export default router;
