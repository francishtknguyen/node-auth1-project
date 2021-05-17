const { findBy } = require("../users/users-model");

function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next({ status: 401, message: "You Shall Not Pass!!" });
  }
}

async function checkUsernameFree(req, res, next) {
  const { username } = req.body;
  const user = await findBy({ username });
  if (user.length < 1) {
    next();
  } else {
    next({ status: 422, message: "Username taken" });
  }
}

async function checkUsernameExists(req, res, next) {
  const { username } = req.body;
  const user = await findBy({ username });
  if (user) {
    next();
  } else {
    next({ status: 401, message: "Invalid credentials" });
  }
}

function checkPasswordLength(req, res, next) {
  if (!req.body.password || req.body.password.trim().length < 3) {
    next({ status: 422, message: "Password must be longer than 3 chars" });
  } else {
    next();
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
};
