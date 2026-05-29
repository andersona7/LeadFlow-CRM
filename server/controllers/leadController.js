const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const Lead = require('../models/Lead');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/leads
exports.getLeads = asyncHandler(async (req, res) => {
  const {
    search = '',
    status,
    source,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'DESC',
  } = req.query;

  const allowedSortFields = ['name', 'status', 'source', 'createdAt', 'updatedAt'];
  const allowedSortOrders = ['ASC', 'DESC'];
  const safeSort = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const safeOrder = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

  const where = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { phone: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (status) where.status = status;
  if (source) where.source = source;

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows } = await Lead.findAndCountAll({
    where,
    include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }],
    order: [[safeSort, safeOrder]],
    limit: parseInt(limit),
    offset,
  });

  res.json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
      limit: parseInt(limit),
    },
  });
});

// GET /api/leads/:id
exports.getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findByPk(req.params.id, {
    include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }],
  });

  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found.' });
  }

  res.json({ success: true, data: lead });
});

// POST /api/leads
exports.createLead = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, phone, email, source, status, notes } = req.body;

  const existing = await Lead.findOne({ where: { phone } });
  if (existing) {
    return res.status(409).json({ success: false, message: 'A lead with this phone number already exists.' });
  }

  const lead = await Lead.create({
    name, phone, email, source, status, notes,
    assignedTo: req.user?.id || null,
  });

  res.status(201).json({ success: true, data: lead, message: 'Lead created successfully.' });
});

// PUT /api/leads/:id
exports.updateLead = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const lead = await Lead.findByPk(req.params.id);
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found.' });
  }

  const { name, phone, email, source, status, notes } = req.body;

  // Check duplicate phone (excluding current lead)
  if (phone && phone !== lead.phone) {
    const existing = await Lead.findOne({ where: { phone } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A lead with this phone number already exists.' });
    }
  }

  await lead.update({ name, phone, email, source, status, notes });

  res.json({ success: true, data: lead, message: 'Lead updated successfully.' });
});

// PATCH /api/leads/:id/status
exports.updateLeadStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['New', 'Interested', 'Not Interested', 'Converted', 'Follow Up'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value.' });
  }

  const lead = await Lead.findByPk(req.params.id);
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found.' });
  }

  await lead.update({ status, lastContactedAt: new Date() });

  res.json({ success: true, data: lead, message: 'Lead status updated.' });
});

// DELETE /api/leads/:id
exports.deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByPk(req.params.id);
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found.' });
  }

  await lead.destroy();
  res.json({ success: true, message: 'Lead deleted successfully.' });
});
