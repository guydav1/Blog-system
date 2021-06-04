const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("./models/user");
const { auth, admin } = require("./middleware/auth");
const router = express.Router();

// /user/

router.get("/", auth, admin, async (req, res) => {
    const search = req.query.search || "";
    const limit = +req.query.limit % 100 || 10; // results per page
    const page = +req.query.page || 0; // current page
    User.aggregate([
        { $match: { "username": { $regex: search, $options: "i" } } },
        { $sort: {role: 1, createdAt: -1 } },
        { $unset: ['password', 'tokens']},
        {
            $facet: {
                users: [{ $skip: page * limit }, { $limit: limit }],
                totalUsers: [{ $count: "count" }],
            },
        },
    ]).then(
        results => {
            r = results[0];
            if (r.users.length > 0) {
                return res.json({ totalUsers: r.totalUsers[0].count, users: r.users });
            }

            return res.sendStatus(404);
        },
        e => {
            console.log(e);
            return res.sendStatus(500);
        }
    );
});

router.get("/all", auth, admin, async (req, res) => {
	try {
		const users = await User.find({});
        const totalUsers = await User.estimatedDocumentCount();
		return res.status(200).json({ users , totalUsers});
	} catch (e) {
		res.sendStatus(500);
	}
});

router.get("/:id", auth, admin, async (req, res) => {
	const _id = req.params.id;
	if (id.match(/^[0-9a-fA-F]{24}$/)) {
		const user = await User.findById(_id);
		if (!user) {
			return res.sendStatus(404);
		}
		return res.status(200).json({ user });
	} else {
		return res.sendStatus(403);
	}
});

router.post("/signup", async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res.sendStatus(400);
	}
	const user = await User.findOne({ username: username });

	if (user) {
		// username already in use
		return res.sendStatus(409);
	} else {
		const hashedPassword = await bcrypt.hash(password, 10);
		const role = (await User.find({})).length === 0 ? "admin" : "user";
		const user = new User({
			username,
			password: hashedPassword,
			role,
		});
		try {
			await user.save();
			const token = await user.generateAuthToken();
			return res.status(201).json({ token: token, user: { _id: user._id } });
		} catch (e) {
			return res.sendStatus(500);
		}
	}
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res.sendStatus(400);
	}
	const user = await User.findOne({ username: username });

	if (!user) {
		return res.sendStatus(404);
	}
	const match = await bcrypt.compare(password, user.password);

	if (match) {
		const token = await user.generateAuthToken();
		return res.json({ token: token, user: { _id: user._id } });
	}
	return res.sendStatus(404);
});

router.post("/logout", auth, async (req, res) => {
	try {
		// remove specific token from list to not logout from all devices
		req.user.tokens = req.user.tokens.filter(token => {
			return token.token !== req.token;
		});

		await req.user.save();

		return res.status(200).json("OK");
	} catch (e) {
		return res.sendStatus(500);
	}
});

router.post("/logoutAll", auth, async (req, res) => {
	try {
		// logout from all devices
		req.user.tokens = [];
		await req.user.save();
		return res.status(200).json("OK");
	} catch (e) {
		return res.sendStatus(500);
	}
});

router.delete("/:id", auth, admin, async (req, res) => {
	const _id = req.params.id;
	if (_id.match(/^[0-9a-fA-F]{24}$/)) {
		const user = await User.findByIdAndDelete(_id);
		if (!user) {
			return res.sendStatus(404);
		}
		return res.status(200).json("OK");
	} else {
		return res.sendStatus(403);
	}
});

router.put("/:id", auth, admin, async (req, res) => {
	const _id = req.params.id;
	const user = req.body.user;
	User.findOneAndUpdate({ _id: _id }, user, { new: true }, (err, doc) => {
		if (err) {
			return res.status(400).json({ error: err });
		}
		return res.json(doc);
	});
});

module.exports = router;
