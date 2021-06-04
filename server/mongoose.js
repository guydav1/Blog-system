const mongoose = require('mongoose');

mongoose.connect(process.env.mongoUrl,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })