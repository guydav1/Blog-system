const mongoose = require("mongoose");

const { Schema } = mongoose;
const sanitizeHtml = require('sanitize-html');

const configSchema = new Schema(
	{
		footerLogo: String,
		footerAboutSection:
		{
			type: [{
				title: String,
				body: String
			}],
			default: [
				{ title: 'Header 1', body: 'This is the footer text. <br> You can edit it on the admin settings' }
			]
		}

		,
		social: [
			{
				name: {
					type: String,
					required: true,
				},
				icon: {
					type: String,
					required: true,
				},
				url: String,
			},
		],
		defaultImageUrl: String,
		sideBar: {
			 imageUrl: String,
			about: String,
		},
		pages: {
			contact: {
				phone: String,
				address: String,
				email: String,
				googleMapURL: String
			},
			about: {
				paragraph1: String,
				paragraph2: String,
				image: String,
			}
		}

	},
	{ collection: "config" }
);


configSchema.pre('save', function (next) {
    //sanitize fields.
	if (this.isModified('footerAboutSection')) {
		this.footerAboutSection = this.footerAboutSection.map(footer => {
			footer.title = sanitizeHtml(footer.title);
			footer.body = sanitizeHtml(footer.body);
			return footer;
		})
    } 

    next();
})


const Config = mongoose.model("Config", configSchema);

module.exports = Config;
