const { query } = require("express");
const express = require("express");
const { auth, admin } = require("./middleware/auth");
const router = express.Router();
const Post = require("./models/post");


router.get("/", async (req, res) => {
    // sintizer
    let { tag, search, page, limit } = req.query;
    let query = { isPublished: true };
    limit = +limit % 100 || 10;
    page = +page || 0;


    if (tag) {
        query.tags = tag.toLowerCase();
    }
    if (search) {
        query.title = { $regex: search, $options: "i" };
        console.log(query.title);
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


/*

⢀⡴⠑⡄⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
⠸⡇⠀⠿⡀⠀⠀⠀⣀⡴⢿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠑⢄⣠⠾⠁⣀⣄⡈⠙⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⢀⡀⠁⠀⠀⠈⠙⠛⠂⠈⣿⣿⣿⣿⣿⠿⡿⢿⣆⠀⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⢀⡾⣁⣀⠀⠴⠂⠙⣗⡀⠀⢻⣿⣿⠭⢤⣴⣦⣤⣹⠀⠀⠀⢀⢴⣶⣆ 
⠀⠀⢀⣾⣿⣿⣿⣷⣮⣽⣾⣿⣥⣴⣿⣿⡿⢂⠔⢚⡿⢿⣿⣦⣴⣾⠁⠸⣼⡿ 
⠀⢀⡞⠁⠙⠻⠿⠟⠉⠀⠛⢹⣿⣿⣿⣿⣿⣌⢤⣼⣿⣾⣿⡟⠉⠀⠀⠀⠀⠀  <----- VICTORIA LMAO
⠀⣾⣷⣶⠇⠀⠀⣤⣄⣀⡀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀ 
⠀⠉⠈⠉⠀⠀⢦⡈⢻⣿⣿⣿⣶⣶⣶⣶⣤⣽⡹⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⠉⠲⣽⡻⢿⣿⣿⣿⣿⣿⣿⣷⣜⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⣶⣮⣭⣽⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⠿⠿⠿⠿⠛⠉ NICE

⣿⣷⡁⢆⠈⠕⢕⢂⢕⢂⢕⢂⢔⢂⢕⢄⠂⣂⠂⠆⢂⢕⢂⢕⢂⢕⢂
⣿⣿⡷⠊⡢⡹⣦⡑⢂⢕⢂⢕⢂⢕⢂⠕⠔⠌⠝⠛⠶⠶⢶⣦⣄⢂⢕
⣿⠏⣠⣾⣦⡐⢌⢿⣷⣦⣅⡑⠕⠡⠐⢿⠿⣛⠟⠛⠛⠛⠛⠡⢷⡈⢂
⣡⣾⣿⣿⣿⣿⣦⣑⠝⢿⣿⣿⣿⣿⣿⡵⢁⡟⢻⣤
⣿⣿⡿⢟⣛⣻⣿⣿⣿⣦⣬⣙⣻⣿⣿⣷⣿⣿⢟⢝⢕⢕⢕⢕⢽⣿⣿
⣿⠵⠚⠉⢀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣗⢕⢕⢕⢕⢕⢕⣽⣿⣿
⣂⣠⣴⣾⡿⡿⡻⡻⣿⣿⣴⣿⣿⣿⣿⣿⣿⣷⣵⣵⣵⣷⣿⣿⣿⣿⣿
⠻⣿⡿⡫⡪⡪⡪⡪⣺⣿⣿⣿⣿⣿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⡁⠹⡪⡪⡪⡪⣪⣾⣿⣿⣿⣿⠋⠐⢉⢍⢄⢌⠻⣿⣿⣿⣿⣿⣿⣿⣿
⡘⢄⠙⣾⣾⣾⣿⣿⣿⣿⣿⣿⡀⢐⢕⢕⢕⢕⢕⡘⣿⣿⣿⣿⣿⣿⠏
⢊⢂⢣⠹⣿⣿⣿⣿⣿⣿⣿⣿⣧⢐⢕⢕⢕⢕⢕⢅⣿⣿⣿⣿⡿⢋⢜
⠁⠕⢝⡢⠈⠻⣿⣿⣿⣿⣿⣿⣿⣷⣕⣑⣑⣑⣵⣿⣿⣿⡿⢋⢔⢕⣿
⡂⡀⢑⢕⡅⠂⠄⠉⠛⠻⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢋⢔⢕⢕⣿⣿
⠪⣂⠁⢕⠆⠄⠂⠄⠁⡀⠂⡀⠄⢈⠉⢍⢛⢛⢛⢋⢔⢕⢕⢕⣽⣿⣿ 
*/


// FOR DEVELOPMENT ONLY
router.post("/add/x", async (req, res) => {
    await req.body.posts.forEach(async post => {
        post.tags = post.tags.map(tag => tag.toLowerCase());
        const newPost = new Post(post);
        try {
            await newPost.save(err => {
                if (err) {
                    console.log(err);
                }
            });
        } catch (e) {
            return res.send(e);
        }
    });
    return res.sendStatus(200);
});
/////////////////////

router.post("/add", auth, admin, async (req, res) => {
    req.body.post.tags.map(tag => {
        return tag.toLowerCase();
    });

    // req.body.post.description = sanitizeHtml(req.body.post.description, {})
    const newPost = new Post(req.body.post);
    newPost.publishDate = newPost.isPublished ? Date.now() : null;
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
    const _id = req.params.id;
    const post = req.body.post;

    if (post.isPublished) {
        post.publishDate = Date.now();
    }

    Post.findOneAndUpdate({ _id: _id }, post, { new: true }, (err, doc) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        return res.json(doc);
    });
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
    //REGEX CHECK IF ID IS REAL OBJECTID
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

router.post("/:id/comments", async (req, res) => {
    console.log("POST /:id/comments");
    const post = await Post.findPostById(req.params.id);
    if (post && !post.isLocked) {
        const nComment = {
            author: req.body.comment.author,
            body: req.body.comment.body,
        };

        const updatedComments = await post.addCommentToPost(nComment);

        return res.json(updatedComments);
    } else {
        return res.sendStatus(400);
    }
});

// posts/comments/:id
router.put("/comments/:id", auth, admin, async (req, res) => {
    console.log("PUT /comments/:id");
    //REGEX CHECK IF ID IS REAL OBJECTID
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
    console.log("GET /all/tags");
    Post.aggregate([
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




module.exports = router;
