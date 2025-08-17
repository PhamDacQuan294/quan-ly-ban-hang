module.exports.createPost = (req, res, next) => {
  const redirectUrl = req.query.redirect;

  console.log(redirectUrl);
  
  if (!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề!");

    return res.redirect(redirectUrl);
  }

  next();
}