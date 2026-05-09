const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide project name'
      });
    }

    const project = await Project.create({
      name,
      description,
      owner: req.user.id,
      members: [{
        user: req.user.id,
        role: 'admin'
      }]
    });

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    // Use .lean() for read-only operation + selective population
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    })
    .populate('owner', 'name email')
    .populate('members.user', 'name email')
    .lean()
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    // Add selective population for this read-heavy operation
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check authorization
    const isOwner = project.owner._id.toString() === req.user.id;
    const isMember = project.members.some(m => m.user._id.toString() === req.user.id);

    if (!isOwner && !isMember && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    // Use .lean() for read-only check, no population needed
    let project = await Project.findById(req.params.id).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check authorization - only owner or admin can update
    const isOwner = project.owner.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    const { name, description, status } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    updateData.updatedAt = new Date();

    project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('owner', 'name email')
    .populate('members.user', 'name email');

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;

    // Use .lean() for authorization check only
    let project = await Project.findById(req.params.id).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check authorization - only owner can add members
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add members'
      });
    }

    // Now fetch full project for update operation
    project = await Project.findById(req.params.id);

    // Check if member already exists
    const memberExists = project.members.some(m => m.user.toString() === userId);
    if (memberExists) {
      return res.status(400).json({
        success: false,
        message: 'Member already added to project'
      });
    }

    project.members.push({
      user: userId,
      role: role || 'member'
    });

    project = await project.save();

    // Populate for response
    project = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    // Use .lean() for authorization check
    let project = await Project.findById(req.params.id).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check authorization
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove members'
      });
    }

    // Fetch full project for update
    project = await Project.findById(req.params.id);
    project.members = project.members.filter(m => m.user.toString() !== userId);

    project = await project.save();

    // Populate for response
    project = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    // Use .lean() for authorization check
    const project = await Project.findById(req.params.id).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check authorization - only owner or admin can delete
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
