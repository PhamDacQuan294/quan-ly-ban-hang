const ProductCategory = require("../../models/product-category.model");
const filterStatusHelper = require("../../helpers/filterStatus");

const systemConfig = require("../../config/system");

const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false
  };

  if(req.query.status) {
    find.status = req.query.status;
  }
  
  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
    filterStatus: filterStatus,
  });
}

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const redirectUrl = req.query.redirect;

  await ProductCategory.updateOne({
    _id: id
  }, {
    status: status
  });

  req.flash("success", "Cập nhật trạng thái thành công!");

  res.redirect(redirectUrl);
}

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  const redirectUrl = req.query.redirect;

  switch (type) {
    case "active":
      await ProductCategory.updateMany({ _id: { $in: ids }}, { status: "active"});
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
      break;
    case "inactive":
      await ProductCategory.updateMany({ _id: { $in: ids }}, { status: "inactive"});
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
      break;
    case "delete-all":
      await ProductCategory.updateMany({ _id: { $in: ids }}, {
        deleted: true,
        deletedAt: new Date()
      });
      req.flash("success", `Xoá thành công ${ids.length} sản phẩm!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await ProductCategory.updateOne({ _id: id }, {
          position: position
        });
      }
      req.flash("success", `Thay đổi vị trí thành công ${ids.length} sản phẩm!`);
      break;
    default:
      break;
  }

  res.redirect(redirectUrl);
}

// [PATCH] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  const redirectUrl = req.query.redirect;

  await ProductCategory.updateOne({
    _id: id
  }, {
    deleted: true,
    deletedAt: new Date()
  });

  req.flash("success", `Xoá sản phẩm thành công!`);

  res.redirect(redirectUrl);
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords
  })
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if(req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  };

  const record = new ProductCategory(req.body);
  await record.save();

  req.flash("success", "Tạo danh mục thành công!");

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
} 

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false
    });

    const records = await ProductCategory.find({
      deleted: false
    });

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords
    })
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id

  req.body.position = parseInt(req.body.position);

  await ProductCategory.updateOne({ _id: id }, req.body);

  req.flash("success", "Cập nhật danh mục thành công!");

  res.redirect(`${systemConfig.prefixAdmin}/products-category/edit/${id}`);
}

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const productCategory = await ProductCategory.findOne(find);

    let parentName = "";

    if(productCategory.parent_id) {
      const findParent = {
        _id: productCategory.parent_id
      };
      const parent = await ProductCategory.findOne(findParent);
      parentName = parent.title;
    }

    res.render("admin/pages/products-category/detail", {
      pageTitle: productCategory.title,
      productCategory: productCategory,
      parentName: parentName
    })
  } catch (error) {
    console.log(error);
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
}