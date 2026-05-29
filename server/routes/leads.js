const router = require('express').Router();
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');
const { leadValidator } = require('../validators');

router.use(protect);

router.route('/')
  .get(getLeads)
  .post(leadValidator, createLead);

router.route('/:id')
  .get(getLeadById)
  .put(leadValidator, updateLead)
  .delete(deleteLead);

router.patch('/:id/status', updateLeadStatus);

module.exports = router;
