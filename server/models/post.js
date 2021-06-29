const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');


const { Schema } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    comments: [{
        body: String,
        date: {
            type: Date,
            default: Date.now
        },
        author: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    date: { type: Date, default: Date.now },
    publishDate: { type: Date },
    isLocked: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    tags: { type: [String], },
    imageURL: String,
    description: {
        type: String,
        required: true
    },
});

const safeBodyConfig = {
    allowedTags: ['ul', 'ol', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'img', 'a', "blockquote", "li", "b", "br", "code", "em", "i", "small", "strong", "sub", "sup", "u"],
    allowedAttributes: {
        a: ['href', 'name', 'target', 'title'],
        img: ['src', 'width', 'height', 'alt'],
        '*': ['style']
    },
    allowedStyles: {
        '*': {
            'padding-left': [/^([0-9]|[1-9][0-9]|1[01][0-9]|120)(px)$/],
            'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
            'background-color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
            'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
            'font-size': [/^(8|10|12|14|18|24|36)(?:px|em|%|pt)$/]
        },
        'ul': {
            'list-style-type': [/^square$/, /^circle$/,]
        },
        'ol': {
            'list-style-type': [/^lower-alpha$/, /^lower-greek$/, /^lower-roman$/, /^upper-alpha$/, /^upper-roman$/,]
        },
        'span': { 'text-decoration': [/^underline$/, /^line-through$/] }
    }
}
const safeDescriptionConfig = Object.assign({}, safeBodyConfig);
safeDescriptionConfig.allowedTags = safeDescriptionConfig.allowedTags.filter(t => t !== 'img');


postSchema.pre('save', function (next) {
    //sanitize fields.
    this.body = sanitizeHtml(this.body, safeBodyConfig);
    this.description = sanitizeHtml(this.description, safeDescriptionConfig);
    this.title = sanitizeHtml(this.title);
    this.author = sanitizeHtml(this.author);

    //convert tags to lowercase and remove duplicates
    if (this.isModified('tags')) {
        this.tags = [...new Set(
            this.tags
                .map(tag => tag.toLowerCase().trim())
                .filter(tag => tag !== '')
        )];
    }

    next();
})

postSchema.methods.addCommentToPost = async function (comment) {
    comment.body = sanitizeHtml(comment.body);
    comment.author = sanitizeHtml(comment.author);

    this.comments.push(comment);
    await this.save();

    return this.comments;
}

postSchema.statics.findPostById = async function (id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const post = await Post.findById(id).populate({ path: 'comments.postedBy', select: 'username -_id' });
        if (!post) return null
        return post;
    }
    else {
        return null;
    }
}


const Post = new mongoose.model('Post', postSchema);
module.exports = Post;
