import globals from "globals";
import { defineConfig } from "eslint/config";
import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js'

export default defineConfig([
	js.configs.recommended,
  { 
		files: ["**/*.js"], 
			languageOptions: { 
				sourceType: "commonjs", 
				globals: {...globals.node },
				ecmaVersion: 'latest',
			},
			plugins: {
				'@stylistic/js': stylisticJs
			},
			rules: {
				'@stylistic/js/indent': ['error', 2],
				'@stylistic/js/quotes': ['error', 'single'],
				'@stylistic/js/semi': ['error', 'never'],
			} 
		},
		{
			ignores: ['dist/**'],
		},
  //{ //files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
]);
