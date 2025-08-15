const express = require("express");

const routeClient = require("./routes/client/index.route");

const app = express();
const port = 3000;

app.set("views", "./views");
app.set("view engine", "pug");

// Route Client
routeClient(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})