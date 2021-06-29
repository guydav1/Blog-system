const dotenv = require('dotenv');
dotenv.config({path:__dirname+'/.env'});
const cors = require('cors');
const express = require("express");
const app = express();
const port = process.env.PORT|| 8080; // default port to listen

require('./mongoose')

const emailRoute = require('./email')
const postsRoute = require('./posts')
const configRoute = require('./config')
const userRoute = require('./user');


app.use(express.json());

app.use(cors());
app.use('/api/email', emailRoute)
app.use('/api/user', userRoute)
app.use('/api/posts', postsRoute)
app.use('/api/config', configRoute)
app.use('/', express.static('dist/Blog-System'))
app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, {root: 'dist/Blog-System'});
});


// start the Express server
app.listen(port, () => {
    console.log(`server started with port ${port}`);
});
