const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require('path');
const s3 = new aws.S3();


aws.config.update({
	region: process.env.AWS_S3_REGION,
});

const upload = multer({
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
			return cb(new Error("file must be jpg/jpeg/png"));
		}
		cb(undefined, true);
	},
	storage: multerS3({
		acl: 'public-read',
		s3: s3,
		bucket: process.env.AWS_S3_BUCKET,
		contentType: multerS3.AUTO_CONTENT_TYPE,
		cacheControl: 'max-age=31536000',
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (req, file, cb) {
			cb(null, Date.now().toString() + path.extname(file.originalname));
		},
	}),

	limits: {
		fileSize: 1500000, //1mega -> 1million bytes
	},
});

module.exports = upload;
