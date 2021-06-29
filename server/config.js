const express = require("express");
const { auth, admin } = require("./middleware/auth");
const router = express.Router();
const Config = require("./models/config");
const upload = require("./middleware/upload");

router.get("/", async (req, res) => {
    let config = await Config.findOne({});
    if (!config) {
        config = new Config();
        try {
            await config.save();
        } catch (pokeball) {
            res.send(pokeball);
        }
    }

    return res.status(200).json(config);
});

router.put("/", auth, admin, async (req, res) => {
    const config = (await Config.findOne({})) || new Config();

    config.social = req.body.social || config.social;
    config.footerAboutSection = req.body.footerAboutSection || config.footerAboutSection;
    config.pages.contact = req.body.contact || config.pages.contact;
    config.pages.about = { ...config.pages.about, ...req.body.about };

    if (req.body.sidebarAbout === "") { // to allow delete side bar about
        config.sideBar.about = undefined;
    }
    else {
        config.sideBar.about = req.body.sidebarAbout ?? config.sideBar.about;
    }

    try {
        await config.save();
        res.status(200).json(config);
    } catch (e) {
        console.log(e);
        res.send(e);
    }
});

router.delete("/footerlogo", auth, admin, async (req, res) => {
    const config = await Config.findOne({});
    if (!config) {
        return res.sendStatus(404);
    }
    config.footerLogo = undefined;

    try {
        await config.save();
        res.status(200).json(config);
    } catch (e) {
        console.log(e);
        res.send(e);
    }
});

router.post(
    "/upload/image",
    auth,
    admin,
    upload.single("image"),
    async (req, res) => {
        console.log("POST /config/upload/image");
        const field = req.query.field;
        const config = await Config.findOne({});
        if (!config) {
            return res.sendStatus(404);
        }

        if (field == "footer") {
            config.footerLogo = req.file.location;
        } else if (field == "general") {
            config.defaultImageUrl = req.file.location;
        } else if (field == "sidebar") {
            config.sideBar.imageUrl = req.file.location;
        } else if (field == "about") {
            config.pages.about.image = req.file.location;
        } else {
            throw Error("no such field");
        }

        await config.save();
        return res.status(200).json(config);
    },
    (error, req, res, next) => {
        return res.status(400).json(error);
    }
);

router.delete("/upload/image", auth, admin, async (req, res) => {
    try {
        const config = await Config.findOne({});
        const field = req.query.field;
        if (!config) {
            return res.sendStatus(404);
        }

        if (field == "footer") {
            config.footerLogo = undefined;
        } else if (field == "general") {
            config.defaultImageUrl = undefined;
        } else if (field == "sidebar") {
            config.sideBar.imageUrl = undefined;
        } else if (field == "about") {
            config.pages.about.image = undefined;
        } else {
            throw Error("no such field");
        }

        await config.save();
        return res.status(200).json(config);
    } catch (e) {
        return res.status(400).json(e);
    }
});

module.exports = router;
