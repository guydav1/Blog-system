const mongoose = require("mongoose");

const { Schema } = mongoose;

const configSchema = new Schema(
	{
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
	},
	{ collection: "config" }
);

// socialSchema.statics.findSocialById = async function (id) {
//     if (id.match(/^[0-9a-fA-F]{24}$/)) {
//         const social = await social.findById(id);
//         if (!social) return null
//         return social;
//     }
//     else {
//         return null;
//     }
// }

const Config = mongoose.model("Config", configSchema);

module.exports = Config;
