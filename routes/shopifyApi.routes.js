module.exports = app => {
  const shopifyApi = require("../controllers/shopifyApi.controller.js");
  var router = require("express").Router();
  router.get("/getProducts", shopifyApi.getProducts);
  router.post("/getProductDetail", shopifyApi.getProductDetail)
  router.post("/createCheckOut", shopifyApi.createCheckOut)
  router.post("/updateCheckOut", shopifyApi.updateCheckOut)
  app.use("/shopifyAPI", router);
};
