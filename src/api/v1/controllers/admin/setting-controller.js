const createError = require('http-errors');
const settingValidate = require('@v1/validations/setting-validate');
const LanguageModel = require('@v1/models/language-model');
const SettingModel = require('@v1/models/setting-model');

class SettingController {
  static async languages(req, res, next) {
    try {
      let { limit, page, name, locale } = req.query;
      if (!limit) limit = 20;
      if (!page) page = 1;

      let options = {};
      if (name) options.$text = { $search: name };
      if (locale) options.locale = locale;

      let skip = limit * page - limit;
      let languages = await LanguageModel.find(options).skip(skip).limit(limit).sort({
        sort: 1,
        updatedAt: -1,
      });

      let count = await LanguageModel.countDocuments(options);

      return res.status(200).json({
        count,
        list: languages,
      });
    } catch (error) {
      console.log('error -:- ', error);
      return next(createError.BadRequest(error.message));
    }
  }

  static async languageSave(req, res, next) {
    try {
      let { name, locale, id, image, sort = 1 } = req.body;
      let data = {
        name,
        locale,
        image,
        sort,
        createdBy: req.payload.id,
      };

      await settingValidate.languageSave.validateAsync(data);
      let language;
      if (id) {
        language = await LanguageModel.findOneAndUpdate({ _id: id }, data);
      } else language = await LanguageModel.create(data);

      return res.status(201).json(language);
    } catch (error) {
      console.log('error -:- ', error);
      return next(createError.BadRequest(error.message));
    }
  }

  static async languageDelete(req, res, next) {
    try {
      let { id } = req.params;

      let language = await LanguageModel.findOne({ _id: id });
      if (!language) return next(createError.NotFound('language-not-found'));

      let deleteOne = await LanguageModel.deleteOne({ _id: id });

      return res.status(204).json(deleteOne);
    } catch (error) {
      console.log('error -:- ', error);
      return next(createError.BadRequest(error.message));
    }
  }

  static async settingSave(req, res, next) {
    try {
      let setting = await SettingModel.create({});
      return res.status(201).json(setting);
    } catch (error) {
      console.log('error -:- ', error);
      return next(createError.BadRequest(error.message));
    }
  }
}

module.exports = SettingController;
