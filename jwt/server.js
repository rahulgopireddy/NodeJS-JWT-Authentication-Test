const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const { expressjwt } = require("express-jwt");
const bodyparser = require("body-parser");
var jwt = require("jsonwebtoken");
const secretKey = "My super secret key ";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const jwtMw = expressjwt({
  secret: secretKey,
  algorithms: ["HS256"],
});
let users = [
  {
    id: 1,
    username: "Rahul",
    password: "123",
  },
  {
    id: 2,
    username: "Paul",
    password: "456",
  },
];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  for (let user of users) {
    if (username == user.username && password == user.password) {
      let token = jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: "3m" }
      );
      res.json({
        success: true,
        err: null,
        token,
      });
      break;
    } else {
      res.status(401).json({
        success: false,
        token: null,
        err: "Username or password is incorrect",
      });
    }
  }
  // for (let user of users) {
  //   if (username == user.username && password == user.password) {
  //     let token = jwt.sign(
  //       { id: user.id, username: user.username },
  //       secretKey,
  //       { expiresIn: "7d" }
  //     );
  //     res.json({
  //       success: true,
  //       err: null,
  //       token,
  //     });
  //     break;
  //   } else {
  //     res.status(401).json({
  //       success: false,
  //       token: null,
  //       err: "Username or password is incorrect",
  //     });
  //   }
  // }
});

app.get("/api/dashboard", jwtMw, (req, res) => {
  res.json({
    success: true,
    myContent: "secret content logged by people in case ",
  });
});

app.get("/api/settings", jwtMw, (req, res) => {
  res.json({
    success: true,
    myContent: "Settings content (protected route)",
  });
});

app.use(function (err, req, res, next) {
  if (err.name === "Unauthorized Error") {
    res.status(401).json({
      success: false,
      officialError: err,
      err: "Username or password is incorrect2",
    });
  } else {
    next(err);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});
