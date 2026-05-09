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

    // Check if project exists and user has access - use .lean() for faster read
    const project = await Project.findById(projectId).lean();
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(m => m.user.toString() === req.user.id);

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

    // Populate for response
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name');

    res.status(201).json({
      success: true,
      task: populatedTask
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
    const { projectId, status, priority, page = 1, limit = 20 } = req.query;
    let filter = {};

    // SECURITY: Only fetch tasks from projects user has access to
    if (projectId) {
      // Verify user has access to this project
      const project = await Project.findById(projectId)
        .select('owner members.user')
        .lean();
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const isOwner = project.owner.toString() === req.user.id;
      const isMember = project.members.some(m => m.user.toString() === req.user.id);

      if (!isOwner && !isMember && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access tasks in this project'
        });
      }

      filter.project = projectId;
    }

    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }

    const skip = (page - 1) * limit;
    
    // Use .lean() for list operations and selective population
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name')
      .lean();

    const totalCount = await Task.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: tasks.length,
      totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalCount / limit),
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
    // Add selective population
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

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
    // Use .lean() for read-only authorization check
    let task = await Task.findById(req.params.id).lean();

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Get project to check membership - use .lean() and only select necessary fields
    const project = await Project.findById(task.project)
      .select('owner members.user')
      .lean();
    
    // Check authorization - creator, assignee, project owner, project member, or admin can update
    const isCreator = task.createdBy.toString() === req.user.id;
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user.id;
    const isProjectOwner = project && project.owner.toString() === req.user.id;
    const isProjectMember = project && project.members.some(m => m.user.toString() === req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAssignee && !isProjectOwner && !isProjectMember && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (dueDate) updateData.dueDate = dueDate;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo || null;
    updateData.updatedAt = new Date();

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('project', 'name');

    res.status(200).json({
      success: true,
      task: updatedTask
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
    // Use .lean() for read-only authorization check
    const task = await Task.findById(req.params.id)
      .select('createdBy')
      .lean();

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check authorization - creator or admin can delete
    const isCreator = task.createdBy.toString() === req.user.id;

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
    // Get all projects where user is owner or member (lean for faster queries)
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    }).lean();

    const projectIds = userProjects.map(p => p._id);

    if (projectIds.length === 0) {
      return res.status(200).json({
        success: true,
        dashboard: {
          totalProjects: 0,
          totalTasks: 0,
          completedTasks: 0,
          completionPercentage: 0,
          overdueCount: 0,
          recentTasks: [],
          myTasks: []
        }
      });
    }

    // Use aggregation for dashboard stats - much more efficient than separate queries
    const dashboardStats = await Task.aggregate([
      {
        $match: {
          project: { $in: projectIds }
        }
      },
      {
        $facet: {
          stats: [
            {
              $group: {
                _id: null,
                totalTasks: { $sum: 1 },
                completedTasks: {
                  $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                },
                overdueCount: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $lt: ['$dueDate', new Date()] },
                          { $ne: ['$status', 'completed'] }
                        ]
                      },
                      1,
                      0
                    ]
                  }
                }
              }
            }
          ],
          recentTasks: [
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'users', localField: 'assignedTo', foreignField: '_id', as: 'assignedTo' } },
            { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy' } },
            { $lookup: { from: 'projects', localField: 'project', foreignField: '_id', as: 'project' } },
            { $unwind: { path: '$assignedTo', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
            {
              $project: {
                title: 1,
                description: 1,
                status: 1,
                priority: 1,
                dueDate: 1,
                createdAt: 1,
                assignedTo: { name: 1, email: 1 },
                createdBy: { name: 1, email: 1 },
                project: { name: 1 }
              }
            }
          ]
        }
      }
    ]);

    // Get user's tasks separately
    const myTasks = await Task.find({
      assignedTo: req.user.id
    })
      .sort({ dueDate: 1 })
      .limit(10)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .lean();

    const stats = dashboardStats[0].stats[0] || {
      totalTasks: 0,
      completedTasks: 0,
      overdueCount: 0
    };

    res.status(200).json({
      success: true,
      dashboard: {
        totalProjects: userProjects.length,
        totalTasks: stats.totalTasks,
        completedTasks: stats.completedTasks,
        completionPercentage: stats.totalTasks > 0 ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(2) : 0,
        overdueCount: stats.overdueCount,
        recentTasks: dashboardStats[0].recentTasks,
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
