const express = require('express');
const MediaController = require('@v1/controllers/media/index');
const router = express.Router();

router.get(`/${process.env.CLOUD_NAME}/uid/:id/:file`, MediaController.get);

module.exports = router;
