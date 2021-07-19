const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./Repositories/users');

const app = express();

//using this will apply middleware parser to every route handler
app.use(bodyParser.urlencoded({extended: true}));

//watch for get requests, with a path of ./
app.get('/', (request, response) => {
    response.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="confirm password" />
            <button>Sign Up</button>
        </form>
    </div>
    `);
});

app.post('/', async(request, response) => {
    //parse form data
    //.on similar to addeventlistener, 
    console.log(request.body);
    const {email, password, passwordConfirmation} = request.body;

    const existingUser = await usersRepo.getOneAttribute({email: email});
    if (existingUser) return response.send('Email is already associated with a different account');
    if (password !== passwordConfirmation) return response.send('Passwords must match');
    response.send('acc created');
});

app.listen(3000, () => {
    console.log('listening');
});