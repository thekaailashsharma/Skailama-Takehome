const Event = require('../models/Event');
const EventLog = require('../models/EventLog');
const Profile = require('../models/Profile');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const diffEvent = require('../utils/diffEvent');

const getEvents = asyncHandler(async (req, res) => {
  const { profileId, timezone } = req.query;

  let query = {};

  if (profileId) {
    const profile = await Profile.findById(profileId);
    if (!profile) {
      throw new ApiError(404, 'Profile not found');
    }
    query.profiles = profileId;
  }

  if (timezone) {
    query.timezone = timezone;
  }

  const events = await Event.find(query)
    .populate('profiles', 'name')
    .sort({ startTime: 1 });

  res.json({ events });
});

const createEvent = asyncHandler(async (req, res) => {
  const { profiles, timezone, startTime, endTime } = req.body;

  if (!profiles || profiles.length === 0) {
    throw new ApiError(400, 'At least one profile is required');
  }
  if (!timezone) {
    throw new ApiError(400, 'Timezone is required');
  }
  if (!startTime || !endTime) {
    throw new ApiError(400, 'Start and end times are required');
  }
  if (new Date(endTime) <= new Date(startTime)) {
    throw new ApiError(400, 'End time must be after start time');
  }

  const uniqueProfiles = [...new Set(profiles)];

  const existingProfiles = await Profile.find({ _id: { $in: uniqueProfiles } });
  if (existingProfiles.length !== uniqueProfiles.length) {
    throw new ApiError(400, 'One or more profiles not found');
  }

  const event = await Event.create({
    profiles: uniqueProfiles,
    timezone,
    startTime,
    endTime,
  });
  const populated = await Event.findById(event._id).populate('profiles', 'name');

  res.status(201).json({ event: populated });
});

const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const existing = await Event.findById(id).populate('profiles', 'name');
  if (!existing) {
    throw new ApiError(404, 'Event not found');
  }

  const newStart = updates.startTime ? new Date(updates.startTime) : existing.startTime;
  const newEnd = updates.endTime ? new Date(updates.endTime) : existing.endTime;
  if (newEnd <= newStart) {
    throw new ApiError(400, 'End time must be after start time');
  }

  if (updates.profiles) {
    updates.profiles = [...new Set(updates.profiles)];
    const existingProfiles = await Profile.find({ _id: { $in: updates.profiles } });
    if (existingProfiles.length !== updates.profiles.length) {
      throw new ApiError(400, 'One or more profiles not found');
    }
  }

  const changes = diffEvent(existing, updates);

  if (updates.profiles) existing.profiles = updates.profiles;
  if (updates.timezone) existing.timezone = updates.timezone;
  if (updates.startTime) existing.startTime = updates.startTime;
  if (updates.endTime) existing.endTime = updates.endTime;

  await existing.save();

  if (changes.length > 0) {
    const profileChange = changes.find(c => c.field === 'profiles');
    if (profileChange) {
      const docs = await Profile.find({ _id: { $in: existing.profiles } });
      profileChange.newValue = docs.map(d => d.name);
    }
    await EventLog.create({ eventId: id, changes });
  }

  const updated = await Event.findById(id).populate('profiles', 'name');
  res.json({ event: updated });
});

const getEventLogs = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  const logs = await EventLog.find({ eventId: id }).sort({ createdAt: -1 });
  res.json({ logs });
});

module.exports = { getEvents, createEvent, updateEvent, getEventLogs };
