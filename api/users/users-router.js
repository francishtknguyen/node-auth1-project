const { restricted } = require("../auth/auth-middleware");

const router = require("express").Router();
const Users = require("./users-model");

router.get("/", restricted, (req, res, next) => {
  Users.find()
    .then((user) => {
      res.json(user);
    })
    .catch(next);
});

module.exports = router;
