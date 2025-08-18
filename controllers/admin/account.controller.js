const md5 = require("md5");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await Account.find(find).select("-password-token");

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false
    });

    record.role = role;
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    records: records
  });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Account.updateOne({
    _id: id
  }, {
    status: status
  });

  req.flash("success", "Cập nhật trạng thái thành công!");

  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  });

  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles
  })
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false
  });

  if(emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);

    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  } else {
    req.body.password = md5(req.body.password);

    const record = new Account(req.body);
    await record.save();

    req.flash("success", `Tạo tài khoản thành công`);

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false
  };

  try {
    const data = await Account.findOne(find).select("-password-token");

    const roles = await Role.find({
      deleted: false
    });

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  const emailExist = await Account.findOne({
    _id: { $ne: id },
    email: req.body.email,
    deleted: false
  });

  if(emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
  } else {

    if(req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    req.flash("success", "Cập nhật tài khoản thành công!");

    await Account.updateOne({ _id: id }, req.body);
  }

  res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);
}

// [DELETE] /admin/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Account.updateOne({
    _id: id
  }, {
    deleted: true,
    deletedAt: new Date()
  });

  req.flash("success", `Xoá tài khoản thành công!`);

  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}


// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const account = await Account.findOne(find);

    const role = await Role.findOne({
      _id: account.role_id
    });

    if(role) {
      account.role = role.title;
    }

    res.render("admin/pages/accounts/detail", {
      pageTitle: "Trang chi tiết",
      account: account,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}
