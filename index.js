const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./Repositories/users');
const cookieSession = require('cookie-session');

const app = express();

//using this will apply middleware parser to every route handler
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({keys: ['a98b7cde67fg5h4i2jk']}));

//watch for get requests, with a path of ./
app.get('/signup', (request, response) => {
    response.send(`
    <div>
        your id is ${request.session.userId}
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="confirm password" />
            <button>Sign Up</button>
        </form>
    </div>
    `);
});

app.post('/signup', async(request, response) => {
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
app.get('/signout', async(request, response) => {
    request.session = null;
    response.send('You are logged out');
});

//sign in page
app.get('/signin', async(request, response) => {
    response.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <button>Sign In</button>
        </form>
    </div>
    `);
});

app.post('/signin', async(request, response) => {
    const {email, password} = request.body;
    const user = await usersRepo.getOneAttribute({email});

    if (!user) return response.send('Email not found');
    const isValidPass = await usersRepo.comparePass(user.password, password);
    if (!isValidPass) return response.send('Password is incorrect');

    request.session.userId = user.id;
    response.send('You are signed in');
});

app.listen(3000, () => {
    console.log('listening');
});