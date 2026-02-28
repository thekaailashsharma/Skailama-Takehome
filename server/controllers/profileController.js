const Profile = require('../models/Profile');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const getProfiles = asyncHandler(async (req, res) => {
  const profiles = await Profile.find().sort({ name: 1 });
  res.json({ profiles });
});

const createProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, 'Profile name is required');
  }

  const profile = await Profile.create({ name: name.trim() });
  res.status(201).json({ profile });
});

module.exports = { getProfiles, createProfile };
