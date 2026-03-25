const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Note = require('../models/Note');
const User = require('../models/User');

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Get all notes
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.user && req.user.role === 'student') {
      const teachers = await User.find({ semester: req.user.semester, role: 'teacher' });
      query.teacher = { $in: teachers.map(t => t._id) };
    }
    const notes = await Note.find(query)
      .populate('teacher', 'name email semester')
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create note (Teacher/Admin only)
router.post('/', [auth, upload.single('file')], async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to create notes' });
    }

    const { title, description, subject } = req.body;

    const newNote = new Note({
      title,
      description,
      subject,
      filePath: req.file ? req.file.path : null,
      fileName: req.file ? req.file.originalname : null,
      teacher: req.user.id
    });

    const note = await newNote.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update note (Teacher/Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    // Check ownership
    if (note.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to update this note' });
    }

    const { title, description, subject } = req.body;
    
    note.title = title || note.title;
    note.description = description || note.description;
    note.subject = subject || note.subject;

    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete note (Teacher/Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    // Check ownership
    if (note.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this note' });
    }

    await note.deleteOne();
    res.json({ msg: 'Note removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
