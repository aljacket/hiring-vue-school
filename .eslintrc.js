module.exports = {
	env: {
		es2021: true,
	},
	extends: [
		// add more generic rulesets here, such as:
		'plugin:vue/vue3-recommended',
	],
	rules: {
		// override/add rules settings here, such as:
		'vue/max-attributes-per-line': ['off'],
		'vue/html-indent': ['off'],
		'vue/singleline-html-element-content-newline': ['off'],
		'vue/html-self-closing': ['off'],
		'prefer-const': ['warn'],
		'no-const-assign': ['warn'],
		'no-var': ['warn'],
	},
}
