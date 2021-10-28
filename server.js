const express = require("express");
const path = require("path");
const app = express();
const { PORT,BUILD_PATH } = require("./src/config");

app.use(express.static(path.join(__dirname, BUILD_PATH?BUILD_PATH:"dist_stag")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname,  BUILD_PATH?BUILD_PATH:"dist_stag", "index.html"));
});
app.listen(PORT?PORT:5000,()=>{
  console.log("Admin up on port:: ",PORT?PORT:5000)
});
