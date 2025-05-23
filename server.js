const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./task-manager/connect'); // Custom MongoDB connection file

const app = express();
app.use(cors());
app.use(express.json());

const taskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

app.get('/tasks', async (req, res) => {
  const { filter } = req.query;
  let query = {};
  if (filter === 'completed') query.completed = true;
  if (filter === 'pending') query.completed = false;

  const tasks = await Task.find(query);
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const task = new Task({ title: req.body.title });
  await task.save();
  res.json(task);
});

app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
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
module.exports =Task;