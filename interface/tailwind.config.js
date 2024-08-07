// just exists to get lsp
module.exports = {
	content: [
		`${__dirname}/src/**/*.{tsx,ts,html}`,
		`${__dirname}/../{apps,packages}/*/src/**/*.{tsx,ts,html}`,
	],
	theme: {
		extend: {
			colors: {
				mg: {
					bool: "#DC2626",
					event: "#C20000",
					string: "#DA5697",
					exec: "#2163EB",
					int: "#30F3DB",
					pure: "#008E62",
					float: "#00AE75",
					graph: "#262626",
					base: "#696969",
					enum: "#1B4DFF",
					struct: "#FACC15",
					current: "var(--mg-current)",
					focus: "#eab308",
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("@kobalte/tailwindcss"),
		require("tailwind-scrollbar"),
	],
	presets: [require("@macrograph/ui/tailwind.preset.js")],
};
