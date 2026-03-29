const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Assignment = require('../models/Assignment');
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

// Get all assignments
router.get('/', auth, async (req, res) => {
  try {
    const query = {};

    if (req.user.role === 'student') {
      if (!req.user.semester) {
        return res.status(400).json({ msg: 'Your semester is not set. Contact your admin.' });
      }
      const teachers = await User.find({ semester: req.user.semester, role: 'teacher' });
      query.teacher = { $in: teachers.map(t => t._id) };
    }

    const assignments = await Assignment.find(query)
      .populate('teacher', 'name email semester')
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create assignment (Teacher/Admin only)
router.post('/', [auth, upload.single('file')], async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to create assignments' });
    }

    const { title, description, subject, dueDate } = req.body;

    const newAssignment = new Assignment({
      title,
      description,
      subject,
      dueDate,
      filePath: req.file ? req.file.path : null,
      fileName: req.file ? req.file.originalname : null,
      teacher: req.user.id
    });

    const assignment = await newAssignment.save();
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update assignment (Teacher/Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ msg: 'Assignment not found' });
    }

    // Check ownership
    if (assignment.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to update this assignment' });
    }

    const { title, description, subject, dueDate } = req.body;
    
    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.subject = subject || assignment.subject;
    assignment.dueDate = dueDate || assignment.dueDate;

    await assignment.save();
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete assignment (Teacher/Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ msg: 'Assignment not found' });
    }

    // Check ownership
    if (assignment.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this assignment' });
    }

    await assignment.deleteOne();
    res.json({ msg: 'Assignment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
