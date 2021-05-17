const bcrypt = require("bcryptjs");
const router = require("express").Router();
const Users = require("../users/users-model");
const {
  checkUsernameFree,
  checkPasswordLength,
  checkUsernameExists,
} = require("./auth-middleware");

router.post(
  "/register",
  checkUsernameFree,
  checkPasswordLength,
  (req, res, next) => {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 8);
    Users.add({ username, password: hash })
      .then((user) => {
        const { username, user_id } = user;
        res.json({ user_id, username });
      })
      .catch(next);
  }
);

router.post("/login", checkUsernameExists, (req, res, next) => {
  const { username, password } = req.body;
  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.json({
          message: `welcome ${user.username}`,
        });
      } else {
        next({
          status: 401,
          message: "Invalid credentials",
        });
      }
    })
    .catch(next);
});

router.get("/logout", (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        next({ message: err.message });
      } else {
        res.json({ status: 200, message: "logged out" });
      }
    });
  } else {
    next({ status: 200, message: "no session" });
  }
});

module.exports = router;
