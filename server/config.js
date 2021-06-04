const express = require('express');
const { auth, admin } = require('./middleware/auth')
const router = express.Router();
const Config = require("./models/config");

router.get('/', async (req, res) => {
    const config = await Config.findOne({})
    if (!config) {
        return res.sendStatus(404);
    }

    return res.status(200).json(config);
})

router.put('/', auth, admin, async (req, res) => {

    const config = await Config.findOne({});

    config.defaultImageUrl = req.body.defaultImageUrl || config.defaultImageUrl;
    config.social = req.body.social || config.social;
    config.sideBar = req.body.sideBar || config.sideBar;

    try {
        await config.save();
        res.status(200).json(config)
    } catch (e) {
        console.log(e);
        res.send(e)
    }
})

module.exports = router;