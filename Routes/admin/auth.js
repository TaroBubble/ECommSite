//route handlers
const express = require("express");
const { check, validationResult } = require("express-validator");

const usersRepo = require("../../Repositories/users");
const signupTemp = require("../../Views/admin/auth/signup");
const signinTemp = require("../../Views/admin/auth/signin");
const {
  requireEmail,
  requirePass,
  requirePassConfirm,
} = require("./validator");

const router = express.Router();

router.get("/signup", (request, response) => {
  response.send(signupTemp({ request }));
});

router.post(
  "/signup",
  [requireEmail, requirePass, requirePassConfirm],
  async (request, response) => {
    const errors = validationResult(request);
    console.log(errors);

    const { email, password, passwordConfirmation } = request.body;

    //create user in repo/db, fix create to return the id
    const user = await usersRepo.create({ email, password });
    //store id as user cookie
    request.session.userId = user.id;

    response.send("acc created");
  }
);

//sign out page
router.get("/signout", async (request, response) => {
  request.session = null;
  response.send("You are logged out");
});

//sign in page
router.get("/signin", async (request, response) => {
  response.send(signinTemp());
});

router.post("/signin", async (request, response) => {
  const { email, password } = request.body;
  const user = await usersRepo.getOneAttribute({ email });

  if (!user) return response.send("Email not found");
  const isValidPass = await usersRepo.comparePass(user.password, password);
  if (!isValidPass) return response.send("Password is incorrect");

  request.session.userId = user.id;
  response.send("You are signed in");
});

module.exports = router;
