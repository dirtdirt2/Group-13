import sequelize from '../config/db.js';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// [REG-BE-02] Register a participant for an event
export const registerForEvent = async (participantId, eventId) => {
  const t = await sequelize.transaction();
  try {
    const event = await Event.findByPk(eventId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!event) throw { status: 404, message: 'Event not found' };

    const existing = await Registration.findOne({
      where: { participantId, eventId }, transaction: t,
    });
    if (existing && existing.status === 'registered')
      throw { status: 409, message: 'Already registered' };

    let reg;
    if (existing) {
      existing.status = 'registered';
      reg = await existing.save({ transaction: t });
    } else {
      reg = await Registration.create({ participantId, eventId }, { transaction: t });
    }
    await t.commit();
    return reg;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};