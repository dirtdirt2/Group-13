import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Participant from './Participant.js';
import Event from './Event.js';

const Registration = sequelize.define('Registration', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: {
    type: DataTypes.ENUM('registered', 'cancelled'),
    defaultValue: 'registered',
  },
}, {
  timestamps: true,
  indexes: [{ unique: true, fields: ['participantId', 'eventId'] }],
});

Participant.hasMany(Registration, { foreignKey: 'participantId' });
Registration.belongsTo(Participant, { foreignKey: 'participantId' });
Event.hasMany(Registration, { foreignKey: 'eventId' });
Registration.belongsTo(Event, { foreignKey: 'eventId' });

export default Registration;