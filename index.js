const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./Routes/admin/auth');

const app = express();

//using this will apply middleware parser to every route handler
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({keys: ['a98b7cde67fg5h4i2jk']}));

app.use(authRouter);

app.listen(3000, () => {
    console.log('listening');
});