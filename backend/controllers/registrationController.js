import * as service from '../services/registrationService.js';

const ok = (res, data, message = 'Success', status = 200) =>
  res.status(status).json({ success: true, message, data });
const fail = (res, e) =>
  res.status(e.status || 500).json({ success: false, message: e.message || 'Server error' });

// [REG-BE-02]
export const register = async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) return fail(res, { status: 400, message: 'eventId is required' });
    ok(res, await service.registerForEvent(req.user.id, eventId), 'Registered', 201);
  } catch (e) { fail(res, e); }
};