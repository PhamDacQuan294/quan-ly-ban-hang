const homeRouter = require("./home.route");
const productRouter = require("./product.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  
  app.use("/", homeRouter);

  app.use("/products", productRouter);
  
}