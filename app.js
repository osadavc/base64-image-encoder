const express = require("express");
const multer = require("multer");
const base64Img = require("base64-img");
const mime = require("mime-types");
const path = require("path");

const app = express();
const PORT = 8080 || process.env.PORT;

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({
  storage: storage,
}).single("photo");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/result", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      if (req.file) {
        base64Img.base64(
          `${__dirname}/public/uploads/${req.file.filename}`,
          function (err, data) {
            if (err) {
              res.send(err);
            } else {
              res.render("result", {
                data,
              });
            }
          }
        );
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`The server is running in http://localhost:${PORT}`);
});
