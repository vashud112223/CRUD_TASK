const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('../connect'); // Custom MongoDB connection file

const app = express();
app.use(cors());
app.use(express.json());

// Allow specific methods including PATCH
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));


// Define schema and model
const taskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// GET: Fetch tasks (All, Completed, or Pending)
app.get('/tasks', async (req, res) => {
  const { filter } = req.query;
  let query = {};
  if (filter === 'completed') query.completed = true;
  if (filter === 'pending') query.completed = false;

  const tasks = await Task.find(query);
  res.json(tasks);
});

// POST: Create new task
app.post('/tasks', async (req, res) => {
  const task = new Task({ title: req.body.title });
  await task.save();
  res.json(task);
});

// PUT: Update task (title or completed status)
app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// DELETE: Delete task
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// PATCH: Mark task as completed
app.patch('/tasks/:id/complete', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as completed' });
  }
});


// Start server after DB connection
const start = async () => {
  try {
    await connectDB(); // connectDB handles mongoose.connect
    app.listen(5000, () => {
      console.log("✅ Server started on http://localhost:5000");
    });
  } catch (error) {
    console.log("❌ Error connecting to database:", error.message);
  }
};

start();

// Export Task model (optional)
module.exports = Task;
