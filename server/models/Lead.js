const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: { len: [2, 150] },
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      is: /^[+]?[\d\s\-().]{7,20}$/i,
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: { isEmail: true },
  },
  source: {
    type: DataTypes.ENUM('Call', 'WhatsApp', 'Field', 'Website', 'Referral'),
    allowNull: false,
    defaultValue: 'Call',
  },
  status: {
    type: DataTypes.ENUM('New', 'Interested', 'Not Interested', 'Converted', 'Follow Up'),
    allowNull: false,
    defaultValue: 'New',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  },
  lastContactedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'leads',
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['source'] },
    { fields: ['createdAt'] },
    { fields: ['phone'], unique: true },
  ],
});

// Associations
Lead.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });
User.hasMany(Lead, { foreignKey: 'assignedTo', as: 'leads' });

module.exports = Lead;
