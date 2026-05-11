// Flat config (ESLint new format)
import jest from 'eslint-plugin-jest';

export default [
	{
		languageOptions: {
			ecmaVersion: 2021,
			sourceType: 'module',
			globals: {
				jest: 'readonly'
			}
		},

		plugins: {
			jest
		},

		rules: {
			'jest/no-disabled-tests': 'warn',
			'jest/no-conditional-expect': 'error',
			'jest/no-identical-title': 'error'
		}
	}
];
