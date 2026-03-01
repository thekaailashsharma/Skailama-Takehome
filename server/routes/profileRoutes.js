const express = require('express');
const router = express.Router();
const { getProfiles, createProfile } = require('../controllers/profileController');

router.route('/').get(getProfiles).post(createProfile);

module.exports = router;
