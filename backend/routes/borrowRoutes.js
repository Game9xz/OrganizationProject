
import express from 'express';
import { 
    getAllBorrows, 
    createBorrow, 
    updateBorrowStatus, 
    deleteBorrow 
} from '../controllers/borrowController.js';

const router = express.Router();

// กำหนด Routes
router.get('/', getAllBorrows);               
router.post('/', createBorrow);               
router.put('/:id/status', updateBorrowStatus); 
router.delete('/:id', deleteBorrow);          

export default router;