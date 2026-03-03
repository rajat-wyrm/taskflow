const Task = require('../models/Task');  // ✅ CORRECT - Capital T

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findByUser(req.user.id);
    
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching tasks'
    });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id, req.user.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching task'
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, category, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Task title is required'
      });
    }

    const taskData = {
      title,
      description: description || '',
      category: category || 'personal',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const task = await Task.create(taskData, req.user.id);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error creating task'
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.update(req.params.id, req.body, req.user.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating task'
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.delete(req.params.id, req.user.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting task'
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};