const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, priority, dueDate } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and projectId'
      });
    }

    // Check if project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const isOwner = project.owner._id.toString() === req.user.id;
    const isMember = project.members.some(m => m.user._id.toString() === req.user.id);

    if (!isOwner && !isMember && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create tasks in this project'
      });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      createdBy: req.user.id,
      priority: priority || 'medium',
      dueDate
    });

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId, status, priority } = req.query;
    let filter = {};

    if (projectId) {
      filter.project = projectId;
    }
    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    // Update overdue status
    tasks.forEach(task => task.updateOverdueStatus());

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.updateOverdueStatus();

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Get project to check membership
    const project = await Project.findById(task.project);
    
    // Check authorization - creator, assignee, project owner, project member, or admin can update
    const isCreator = task.createdBy._id.toString() === req.user.id;
    const isAssignee = task.assignedTo && task.assignedTo._id.toString() === req.user.id;
    const isProjectOwner = project && project.owner._id.toString() === req.user.id;
    const isProjectMember = project && project.members.some(m => m.user._id.toString() === req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAssignee && !isProjectOwner && !isProjectMember && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;

    task.updateOverdueStatus();
    task.updatedAt = new Date();

    task = await task.save();

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check authorization - creator, project owner, or admin can delete
    const isCreator = task.createdBy._id.toString() === req.user.id;

    if (!isCreator && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    // Get all projects where user is owner or member
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    });

    const projectIds = userProjects.map(p => p._id);

    // Get tasks statistics
    const totalTasks = await Task.countDocuments({
      project: { $in: projectIds }
    });

    const completedTasks = await Task.countDocuments({
      project: { $in: projectIds },
      status: 'completed'
    });

    const overdueTasks = await Task.find({
      project: { $in: projectIds },
      status: { $ne: 'completed' }
    });

    // Count overdue
    let overdueCount = 0;
    overdueTasks.forEach(task => {
      if (task.dueDate && new Date() > task.dueDate) {
        overdueCount++;
      }
    });

    // Get recent tasks
    const recentTasks = await Task.find({
      project: { $in: projectIds }
    })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get tasks assigned to user
    const myTasks = await Task.find({
      assignedTo: req.user.id
    })
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      dashboard: {
        totalProjects: userProjects.length,
        totalTasks,
        completedTasks,
        completionPercentage: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0,
        overdueCount,
        recentTasks,
        myTasks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
