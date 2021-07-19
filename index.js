const express = require('express');

const app = express();

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

const formParser = (request, response, next) => {
    if (request.method === 'POST') {
        request.on('data', (data) => {
            const parse = data.toString('utf8').split('&');
            const formData = {};
            for (let pair of parse) {
                const [key, value] = pair.split('=');
                formData[key] = value;
            }
            request.body = formData;
            next();
        });
    } else {
        next();
    }
}

app.post('/', formParser , (request, response) => {
    //parse form data
    //.on similar to addeventlistener, 
    console.log(request.body);
    response.send('acc created');
})

app.listen(3000, () => {
    console.log('listening');
});