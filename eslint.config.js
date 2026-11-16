import js from '@eslint/js';
import globals from 'globals';
export default [
 {ignores:['node_modules/','dist/','test-results/','playwright-report/']},
 js.configs.recommended,
 {languageOptions:{globals:{...globals.browser,...globals.node},ecmaVersion:'latest',sourceType:'module'},rules:{'no-unused-vars':['error',{argsIgnorePattern:'^_'}]}},
];
