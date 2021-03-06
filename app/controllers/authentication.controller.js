/*
 * @Date           : 2020-09-09 23:56:34
 * @FilePath       : /node-quasar-fullstack/app/controllers/authentication.controller.js
 * @Description    :
 */
const db = require("../models");
const Authentication = db.authentication;
const Authentication_description = require("../description/authentication.description");
const MESSAGE_CODE = require("../config/code.config");
const getPagination = (page, size) => {
  const limit = size ? +size : 20;
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};
const logger=  require("log4js").getLogger()

// Create and Save a new Authentication
exports.create = (req, res) => {
  // Validate request
  // console.log("------jinnnian----");
  // console.log(req.body);
  if (!req.body.name) {
    res. send({
      code: MESSAGE_CODE.ERROR_PARAMETER_WRONG,
      message: "参数非法!"
    });
    return;
  }

  // Create a Authentication
  const authentication = new Authentication({
    name: req.body.name,
    module:req.body.module,
    api_method:req.body.api_method,
    api_path:req.body.api_path,
    effective:req.body.effective,
    description: req.body.description,
  });

  // Save Authentication in the database
  authentication
    .save(authentication)
    .then(data => {
      res.send({
        code: MESSAGE_CODE.SUCCESS,
        message: "",
        data
      });
    })
    .catch(err => {
      res.send({
        code: MESSAGE_CODE.ERROR_SERVER_WRONG,
        message: err.message || "服务器处理失败."
      });
    });
};

// Retrieve all authentication from the database.
exports.findAll = (req, res) => {
  const { page, size, name } = req.query;
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  const { limit, offset } = getPagination(page, size);

  Authentication.paginate(condition, { offset, limit,sort:{ updatedAt: -1 } })
    .then(data => {
     
      res.send({
        code: MESSAGE_CODE.SUCCESS,
        message: "1",
        data: {
          total: data.totalDocs,
          data: data.docs,
          // totalPages: data.totalPages,
          currentPage: data.page,
          pageSize: data.limit
          // row_data:data
        }
      });
      logger.info({res, code: MESSAGE_CODE.SUCCESS, message: "1"})
    })
    .catch(err => {
      res.send({
        code: MESSAGE_CODE.ERROR_SERVER_WRONG,
        message: err.message || "服务器处理失败."
      });
    });
};

// Find a single Authentication with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Authentication.findById(id)
    .then(data => {
      if (!data)
        res.send({
          code: MESSAGE_CODE.ERROR_NOT_FOUND,
          message: "数据不存在 id " + id
        });
      else {
        res.send({
          code: MESSAGE_CODE.SUCCESS,
          message: "",
          data
        });
      }
    })
    .catch(err => {
      res.send({
        code: MESSAGE_CODE.ERROR_SERVER_WRONG,
        message: "服务器处理失败 id=" + id
      });
    });
};

// Update a Authentication by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.send({
      code: MESSAGE_CODE.ERROR_PARAMETER_WRONG,
      message: "参数非法!"
    });
  }

  const id = req.params.id;

  Authentication.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.send({
          code: MESSAGE_CODE.ERROR_NOT_FOUND,
          message: `数据不存在 id=${id} `
        });
      } else
        res.send({
          code: MESSAGE_CODE.SUCCESS,
          message: ""
        });
    })
    .catch(err => {
      res.send({
        code: MESSAGE_CODE.ERROR_SERVER_WRONG,
        message: "服务器处理失败 id=" + id
      });
    });
};

// Delete a Authentication with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Authentication.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.send({
          code: MESSAGE_CODE.ERROR_NOT_FOUND,
          message: `数据不存在 id=${id}.`
        });
      } else {
        res.send({
          code: MESSAGE_CODE.SUCCESS,
          message: ""
        });
      }
    })
    .catch(err => {
      res.send({
        code: MESSAGE_CODE.ERROR_SERVER_WRONG,
        message: "服务器处理失败 id=" + id
      });
    });
};

// Delete all authentication from the database.
exports.deleteAll = (req, res) => {
  Authentication.deleteMany({})
    .then(data => {
      res.send({
        code: MESSAGE_CODE.SUCCESS,
        message: `删除成功,数量：${data.deletedCount} `
      });
    })
    .catch(err => {
      res.send({
        code: MESSAGE_CODE.ERROR_SERVER_WRONG,
        message: err.message || "服务器处理失败."
      });
    });
};

// Find all published authentication
exports.findAllPublished = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  Authentication.paginate({ published: true }, { offset, limit })
    .then(data => {
      res.send({
        code: MESSAGE_CODE.SUCCESS,
        message: "",
        date: {
          total: data.totalDocs,
          data: data.docs,
          // totalPages: data.totalPages,
          currentPage: data.page,
          pageSize: data.limit
        }
      });
    })
    .catch(err => {
      res.send({
        code: MESSAGE_CODE.ERROR_SERVER_WRONG,
        message: err.message || "服务器处理失败."
      });
    });
};

// 返回字段信息说明

exports.fieldDescription = (req, res) => {
  res.send({
    code: MESSAGE_CODE.SUCCESS,
    message: "",
    data: {
      description: Authentication_description.field_description
    }
  });
};

// 根据传入数量快速mock 数据
exports.fastMockData = (req, res) => {
  const { num } = req.query;
};
