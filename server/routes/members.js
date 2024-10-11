import express from 'express';
import { getAllMembers, addMember, updateMember, deleteMember } from '../controllers/membersController.js';

const router = express.Router();

router.get('/', getAllMembers);
router.post('/', addMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;
