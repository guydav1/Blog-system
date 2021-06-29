const { query } = require("express");
const express = require("express");
const { auth, admin, hasUser } = require("./middleware/auth");
const router = express.Router();
const moment = require('moment');
const Post = require("./models/post");
const upload = require("./middleware/upload");

router.get("/", async (req, res) => {
    let { tag, search, page, limit } = req.query;
    let query = { isPublished: true }; // set default query to match published posts.
    limit = +limit % 100 || 10;
    page = +page || 0;

    if (tag) {
        query.tags = tag.toLowerCase();
    }
    if (search) {
        query.title = { $regex: search, $options: "i" };
    }

    Post.aggregate([
        { $match: query },
        { $set: { totalComments: { $size: "$comments" } } },
        { $unset: ["comments", "body"] },
        { $sort: { publishDate: -1 } },
        {
            $facet: {
                posts: [{ $skip: page * limit }, { $limit: limit }],
                totalPosts: [{ $count: "totalPosts" }],
            },
        },
    ]).then(
        ([{ posts, totalPosts }]) => {

            if (posts.length > 0) {
                return res.json({ totalPosts: totalPosts[0].totalPosts, posts });
            }

            return res.sendStatus(404);
        },
        e => {
            console.log(e);
            return res.sendStatus(500);
        }
    );

});

// Get all posts for admin panel
router.get("/all", auth, admin, async (req, res) => {
    const posts = await Post.find({});
    const totalPosts = await Post.estimatedDocumentCount({});

    if (!posts) {
        return res.sendStatus(400);
    }

    return res.json({ totalPosts, posts });
});


router.get("/:id", async (req, res) => {
    const post = await Post.findPostById(req.params.id);

    if (!post) {
        return res.sendStatus(404);
    }
    return res.json(post);
});


router.post("/upload/image", auth, admin, upload.single('image') ,async (req, res) => {

    const imageURL =  req.file.location;
    if(imageURL) return res.status(200).json(imageURL);
    return res.status(500);
},
(error, req, res, next) => {
    return res.status(400).json(error);
}
);

router.post("/add", auth, admin, async (req, res) => {
    req.body.post.tags = req.body.post.tags.map(tag => {
        return tag.toLowerCase();
    });
    const newPost = new Post(req.body.post);

    newPost.author = req.user.username;
    newPost.publishDate = newPost.isPublished ? Date.now() : undefined;
    try {
        await newPost.save(err => {
            if (err) {
                console.log(err);
            }
        });
        res.json(newPost);
    } catch (e) {
        res.send(e);
    }
});

router.delete("/:id", auth, admin, async (req, res) => {
    console.log("DELETE /:id");
    try {
        await Post.deleteOne({ _id: req.params.id });
    } catch (e) {
        return res.send(e);
    }

    return res.status(200).json("OK");
});

router.put("/:id", auth, admin, async (req, res) => {
    const allowUpdate = ['title', 'body', 'description', 'tags', 'imageURL', 'isLocked', 'isPublished']
    const _id = req.params.id;
    const updatedPost = req.body.post;
    const post = await Post.findPostById(_id);

    if (!post) {
        return res.sendStatus(404);
    }

    if (updatedPost.isPublished && !post.publishDate) {
        post.publishDate = Date.now();
    }

    try {
        for (let prop in updatedPost) {
            if (allowUpdate.includes(prop)) {
                post[prop] = updatedPost[prop];
            }
        }
        await post.save();
        return res.json(post);
    } catch (e) {
        return res.status(400).json({ error: e });
    }

});

/**************END POSTS******** */

/**************COMMENTS******** */
router.get("/all/comments", auth, admin, async (req, res) => {
    const search = req.query.search || "";
    const limit = +req.query.limit % 100 || 10; // results per page
    const page = +req.query.page || 0; // current page

    Post.aggregate([
        { $unwind: "$comments" },
        { $match: { "comments.body": { $regex: search, $options: "i" } } },

        {
            $project: {
                postId: "$_id",
                _id: 0,
                postTitle: "$title",
                _id: "$comments._id",
                author: "$comments.author",
                body: "$comments.body",
                date: "$comments.date",
            },
        },
        { $sort: { date: -1 } },

        {
            $facet: {
                comments: [{ $skip: page * limit }, { $limit: limit }],
                totalComments: [{ $count: "count" }],
            },
        },
    ]).then(
        results => {
            r = results[0];
            if (r.comments.length > 0) {
                return res.json({ totalComments: r.totalComments[0].count, comments: r.comments });
            }

            return res.sendStatus(404);
        },
        e => {
            console.log(e);
            return res.sendStatus(500);
        }
    );
});

router.delete("/comments/:id", auth, admin, async (req, res) => {
    console.log("DELETE /comments/:id");
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        await Post.updateOne({ "comments._id": id }, { $pull: { comments: { _id: id } } }).then(
            result => {
                if (result.nModified === 1) {
                    return res.json("OK");
                } else {
                    return res.sendStatus(404);
                }
            },
            () => {
                return res.sendStatus(500);
            }
        );
    }
});

router.post("/:id/comments", hasUser, async (req, res) => {
    console.log("POST /:id/comments");
    const post = await Post.findPostById(req.params.id);
    if (post && !post.isLocked) {
        const nComment = {
            author: req.user?.username || req.body.comment.author,
            body: req.body.comment.body,
            postedBy: req.user?._id
        };
        // TODO: fix returned comments, added comment is not populated...blame mongoose
        const updatedComments = await post.addCommentToPost(nComment);

        return res.json(updatedComments);
    } else {
        return res.sendStatus(400);
    }
});

// posts/comments/:id
router.put("/comments/:id", auth, admin, async (req, res) => {
    console.log("PUT /comments/:id");
    const id = req.params.id;
    const comment = req.body;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        await Post.updateOne({ "comments._id": id }, { $set: { "comments.$.body": comment.body } }).then(
            result => {
                if (result.nModified === 1 || result.n === 1) {
                    return res.status(200).json("OK");
                } else {
                    return res.sendStatus(404);
                }
            },
            err => {
                console.log(err);
                return res.sendStatus(500);
            }
        );
    }
});

//posts/all/tags
router.get("/all/tags", async (req, res) => {
    Post.aggregate([
        { $match: { 'isPublished': true } },
        { $unwind: "$tags" },
        {
            $group: {
                _id: "$tags",
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]).then(result => {
        res.json(result);
    }, err => {
        res.status(500).send(err)
    })
})

//posts/stats/all
router.get("/stats/all", auth, admin, async (req, res) => {
    /*******  POSTS******** */
    const postsToday = await Post.countDocuments({
        'date': {
            $gte: moment().startOf('day').toDate(),
            $lte: moment().endOf('day').toDate()
        }
    });
    const totalPosts = await Post.estimatedDocumentCount({});
    /*******  comments******** */
    let [{ totalComments, commentsToday }] = await Post.aggregate([

        { $unwind: "$comments" },
        {
            $facet: {
                totalComments: [{ $count: 'count' }],
                commentsToday: [
                    {
                        $match: {
                            'comments.date': {
                                $gte: moment().startOf('day').toDate(),
                                $lte: moment().endOf('day').toDate()
                            }
                        }
                    },
                    {
                        $count: 'count'
                    }]
            }
        }

    ]);
    totalComments = totalComments[0]?.count || 0;
    commentsToday = commentsToday[0]?.count || 0;

    return res.json({ postsToday, totalPosts, totalComments, commentsToday });
})


module.exports = router;
