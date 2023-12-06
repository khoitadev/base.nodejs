const createError = require('http-errors');
const EmailTemplateModel = require('@v1/models/email-template-model');
const AdminModel = require('@v1/models/admin-model');

class EmailController {
  static async templates(req, res, next) {
    try {
      let { limit = 20, page = 1, language, content, keyword, createdBy } = req.query;
      if (!language) language = 'vi';
      page = +page;
      limit = +limit;
      let options = { language };
      if (content) options.content = new RegExp(content, 'img');
      if (keyword) options.keyword = new RegExp(keyword, 'img');

      if (createdBy) {
        let admin = await AdminModel.findOne({ name: new RegExp(createdBy, 'img') });
        if (!admin)
          return res.status(200).json({
            count: 0,
            list: [],
          });
        options.createdBy = admin._id;
      }
      let skip = limit * page - limit;
      let templates = await EmailTemplateModel.find(options)
        .skip(skip)
        .limit(limit)
        .sort({
          createdAt: -1,
        })
        .populate(['createdBy']);
      let count = await EmailTemplateModel.countDocuments(options);

      return res.status(200).json({
        count,
        list: templates,
      });
    } catch (error) {
      console.log('error -:- ', error);
      return next(createError.BadRequest(error.message));
    }
  }
  static async templateSave(req, res, next) {
    let { id } = req.body;
    req.body.createdBy = req.payload.id;
    try {
      let template;
      if (id) {
        template = await EmailTemplateModel.findOneAndUpdate({ _id: id }, req.body);
      } else template = await EmailTemplateModel.create(req.body);

      return res.status(201).json(template);
    } catch (error) {
      console.log('error -:- ', error);
      return next(createError.BadRequest(error.message));
    }
  }
  static async template(req, res, next) {
    try {
      let template = await EmailTemplateModel.findOne({ _id: req.params.id });
      if (!template) return next(createError.NotFound('template-not-found'));
      return res.status(200).json(template);
    } catch (error) {
      console.log('error -:- ', error);
      return next(createError.BadRequest(error.message));
    }
  }
  static async templateDelete(req, res, next) {
    try {
      let template = await EmailTemplateModel.findOne({ _id: req.params.id });
      if (!template) return next(createError.NotFound('template-not-found'));

      let remove = await EmailTemplateModel.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          status: 'delete',
        },
      );

      return res.status(204).json(remove);
    } catch (error) {
      console.log('error -:- ', error);
      return next(createError.BadRequest(error.message));
    }
  }
}
module.exports = EmailController;
