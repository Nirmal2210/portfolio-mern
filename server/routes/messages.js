import { Router } from 'express';
import Message from '../models/Message.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// POST /api/messages (public - contact form submit)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }
    const doc = await Message.create({ name, email, message });
    res.status(201).json({ success: true, id: doc._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/messages (admin only - view inbox)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// PATCH /api/messages/:id/read (admin only)
router.patch('/:id/read', requireAdmin, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE /api/messages/:id (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
