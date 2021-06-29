const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const Post = require("./models/post");
const { auth, admin } = require("./middleware/auth");
const router = express.Router();
const upload = require("./middleware/upload");
// /user/

router.get("/", auth, admin, async (req, res) => {
	const search = req.query.search || "";
	const limit = +req.query.limit % 100 || 10; // results per page
	const page = +req.query.page || 0; // current page
	User.aggregate([
		{ $match: { "username": { $regex: search, $options: "i" } } },
		{ $sort: { role: 1, createdAt: -1 } },
		{ $unset: ['password', 'tokens'] },
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
		return res.status(200).json({ users, totalUsers });
	} catch (e) {
		res.sendStatus(500);
	}
});
router.get("/:username", async (req, res) => {
	const user = await User.findOne({ username: req.params.username }, { tokens: 0, password: 0, _id: 0 });
	if (!user) {
		return res.sendStatus(404);
	}
	if (user.isEmailPrivate) {
		user.email = undefined;
	}

	return res.json(user);
})

//:username/comments
router.get("/:username/comments", async (req, res) => {
	const { _id } = await User.findOne({ username: req.params.username }, "_id");
	if (!_id) {
		return res.sendStatus(404);
	}
	const userComments = await Post.aggregate([
		{ $unwind: "$comments" },
		{ $sort: { 'comments.date': -1 } },
		{ $match: { "comments.postedBy": _id } },
		{ $project: { comments: 1, title: 1, publishDate: 1 } },
		{ $unset: ['comments.postedBy'] },
		{ $limit: 10 },

	]);

	res.json(userComments)
});

router.post("/", auth, admin, async (req, res) => {
	const { username, password, role, email } = req.body;
	if (!username || !password || !role || !email) {
		return res.sendStatus(400);
	}
	const user = await User.findOne({ username: username });

	if (user) {
		// username already in use
		return res.status(403).json('user already exist');
	} else {
		const user = new User({
			username,
			password,
			role,
			email
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

router.post("/register", async (req, res) => {
	const { username, password, email } = req.body;
	if (!username || !password || !email) {
		return res.sendStatus(400);
	}

	const user = await User.findOne({ username: username });

	if (user) {
		// username already in use
		return res.status(403).json('user already exist');
	} else {
		const role = "user";
		const user = new User({
			username,
			password,
			email,
			role,
		});
		try {
			await user.save();
			const token = await user.generateAuthToken();
			return res.status(201).json({ token, user });
		} catch (e) {
			return res.send(e);
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
		return res.json({ token: token, user: user });
	}
	return res.sendStatus(404);
});

// Get user information by token.
router.get("/login/token", auth, async (req, res) => {
	return res.json({ token: req.token, user: req.user });
})

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

router.put("/me", auth, async (req, res) => {
	const user = req.user
	const { password, email, bio, profilePicture, isEmailPrivate } = req.body.user;
	try {
		user.email = email || user.email;
		user.profilePicture = profilePicture || user.profilePicture;
		if (typeof isEmailPrivate === 'boolean') {
			user.isEmailPrivate = isEmailPrivate;
		}

		if (typeof bio === 'string') user.bio = bio

		if (password) {
			user.password = password;
		}
		await user.save();
		return res.json(user);

	} catch (e) {
		return res.status(400).json({ error: e });

	}

})

router.put("/:id", auth, admin, async (req, res) => {
	const _id = req.params.id;
	const { username, role, password, email } = req.body.user;
	try {
		if (_id.match(/^[0-9a-fA-F]{24}$/)) {
			const user = await User.findById(_id);

			user.username = username;
			user.role = role;
			user.email = email || user.email;

			if (password) {
				user.password = password;
			}

			await user.save();

			return res.json(user);
		}
	}
	catch (e) {
		return res.status(400).json({ error: e });
	}
});


router.post('/me/avatar', auth, upload.single('image'), async (req, res) => {
	console.log("POST /user/me/avatar");

	req.user.profilePicture = req.file.location;
	await req.user.save();

	return res.status(200).json(req.user);
}, (error, req, res, next) => {
	return res.status(400).json(error);
})

router.post('/me/cover', auth, upload.single('image'), async (req, res) => {
	console.log("POST /user/me/cover");

	req.user.coverPicture = req.file.location;
	await req.user.save();

	return res.status(200).json(req.user);
}, (error, req, res, next) => {
	return res.status(400).json(error);
})

router.delete('/me/avatar', auth, async (req, res) => {
	req.user.profilePicture = undefined;
	try {
		await req.user.save();
		return res.status(200).json(req.user);
	}
	catch (e) {
		return res.status(400).json(e);
	}
})

router.delete('/me/cover', auth, async (req, res) => {
	req.user.coverPicture = undefined;
	try {
		await req.user.save();
		return res.status(200).json(req.user);
	}
	catch (e) {
		return res.status(400).json(e);
	}
})

module.exports = router;
