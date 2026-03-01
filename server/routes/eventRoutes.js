const express = require('express');
const router = express.Router();
const { getEvents, createEvent, updateEvent, getEventLogs } = require('../controllers/eventController');

router.route('/').get(getEvents).post(createEvent);
router.route('/:id').put(updateEvent);
router.route('/:id/logs').get(getEventLogs);

module.exports = router;
