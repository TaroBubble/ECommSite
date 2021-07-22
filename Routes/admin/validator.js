const {check, validationResult} = require('express-validator');
const usersRepo = require("../../Repositories/users");

module.exports = {
    requireEmail : check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be valid Email')
        .custom(async (email) => {
        const existingUser = await usersRepo.getOneAttribute({ email: email });
        if (existingUser)
            throw new Error(
            "Email is already associated with a different account"
            );
        }),
    requirePass: check("password")
        .trim()
        .isLength({ min: 5, max: 20 })
        .withMessage('Must be between 5 and 20 characters long inclusive'),
    requirePassConfirm: check("passwordConfirmation")
        .trim()
        .isLength({ min: 5, max: 20 })
        .withMessage('Must be between 5 and 20 characters long inclusive')
        .custom((passwordConfirmation, {req}) => {
        if (passwordConfirmation !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        })
}