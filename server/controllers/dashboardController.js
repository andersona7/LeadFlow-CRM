const { Op, fn, col, literal } = require('sequelize');
const Lead = require('../models/Lead');
const asyncHandler = require('../utils/asyncHandler');
const sequelize = require('../config/database');

// GET /api/dashboard/stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
  // Status breakdown
  const statusCounts = await Lead.findAll({
    attributes: ['status', [fn('COUNT', col('id')), 'count']],
    group: ['status'],
    raw: true,
  });

  // Source breakdown
  const sourceCounts = await Lead.findAll({
    attributes: ['source', [fn('COUNT', col('id')), 'count']],
    group: ['source'],
    raw: true,
  });

  // Monthly trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyTrend = await Lead.findAll({
    attributes: [
      [fn('DATE_TRUNC', 'month', col('createdAt')), 'month'],
      [fn('COUNT', col('id')), 'count'],
    ],
    where: { createdAt: { [Op.gte]: sixMonthsAgo } },
    group: [fn('DATE_TRUNC', 'month', col('createdAt'))],
    order: [[fn('DATE_TRUNC', 'month', col('createdAt')), 'ASC']],
    raw: true,
  });

  // Recent leads (last 5)
  const recentLeads = await Lead.findAll({
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  // Totals
  const totalLeads = await Lead.count();
  const thisMonth = new Date();
  thisMonth.setDate(1); thisMonth.setHours(0, 0, 0, 0);
  const leadsThisMonth = await Lead.count({ where: { createdAt: { [Op.gte]: thisMonth } } });

  // Build status map
  const statusMap = {};
  statusCounts.forEach(({ status, count }) => { statusMap[status] = parseInt(count); });

  res.json({
    success: true,
    data: {
      totals: {
        all: totalLeads,
        thisMonth: leadsThisMonth,
        new: statusMap['New'] || 0,
        interested: statusMap['Interested'] || 0,
        notInterested: statusMap['Not Interested'] || 0,
        converted: statusMap['Converted'] || 0,
        followUp: statusMap['Follow Up'] || 0,
      },
      conversionRate: totalLeads > 0
        ? (((statusMap['Converted'] || 0) / totalLeads) * 100).toFixed(1)
        : 0,
      statusBreakdown: statusCounts,
      sourceBreakdown: sourceCounts,
      monthlyTrend,
      recentLeads,
    },
  });
});
