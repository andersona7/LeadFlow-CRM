const { body } = require('express-validator');

exports.registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }),
  body('email').normalizeEmail().isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.loginValidator = [
  body('email').normalizeEmail().isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.leadValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 150 }),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^[+]?[\d\s\-().]{7,20}$/).withMessage('Invalid phone number'),
  body('email').optional({ nullable: true }).isEmail().withMessage('Invalid email format'),
  body('source')
    .notEmpty().withMessage('Source is required')
    .isIn(['Call', 'WhatsApp', 'Field', 'Website', 'Referral']).withMessage('Invalid source'),
  body('status')
    .optional()
    .isIn(['New', 'Interested', 'Not Interested', 'Converted', 'Follow Up']).withMessage('Invalid status'),
];
