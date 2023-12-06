const express = require('express');
const EmailController = require('@v1/controllers/admin/email-controller');
const router = express.Router();

//template
router.post('/template/save', EmailController.templateSave);
router.get('/template/list', EmailController.templates);
router.get('/template/get/:id', EmailController.template);
router.delete('/template/delete/:id', EmailController.templateDelete);

module.exports = router;
