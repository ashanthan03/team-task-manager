const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide task title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed', 'blocked'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  isOverdue: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update isOverdue status
taskSchema.methods.updateOverdueStatus = function() {
  if (this.dueDate && this.status !== 'completed') {
    this.isOverdue = new Date() > this.dueDate;
  }
  return this;
};

taskSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'assignedTo createdBy',
    select: 'name email'
  }).populate({
    path: 'project',
    select: 'name'
  });
  next();
});

module.exports = mongoose.model('Task', taskSchema);
