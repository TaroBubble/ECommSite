//route handlers
const express = require('express');
const usersRepo = require('../../Repositories/users');
const signupTemp = require('../../Views/admin/auth/signup');
const signinTemp = require('../../Views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (request, response) => {
    response.send(signupTemp({request}));
});

router.post('/signup', async(request, response) => {
    //parse form data
    //.on similar to addeventlistener, 
    console.log(request.body);
    const {email, password, passwordConfirmation} = request.body;

    const existingUser = await usersRepo.getOneAttribute({email: email});
    if (existingUser) return response.send('Email is already associated with a different account');
    if (password !== passwordConfirmation) return response.send('Passwords must match');

    //create user in repo/db, fix create to return the id
    const user = await usersRepo.create({email, password});
    //store id as user cookie
    request.session.userId = user.id;
    response.send('acc created');
});

//sign out page
router.get('/signout', async(request, response) => {
    request.session = null;
    response.send('You are logged out');
});

//sign in page
router.get('/signin', async(request, response) => {
    response.send(signinTemp());
});

router.post('/signin', async(request, response) => {
    const {email, password} = request.body;
    const user = await usersRepo.getOneAttribute({email});

    if (!user) return response.send('Email not found');
    const isValidPass = await usersRepo.comparePass(user.password, password);
    if (!isValidPass) return response.send('Password is incorrect');

    request.session.userId = user.id;
    response.send('You are signed in');
});

module.exports = router;