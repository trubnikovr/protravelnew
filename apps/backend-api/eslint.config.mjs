import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
  {
    files: [
      'src/modules/order-flight/application/**/*.ts',
      'src/modules/order-flight/domain/**/*.ts',
      'src/modules/order-flight/infrastructure/**/*.ts',
      'src/entrypoints/mobile/order-flight/**/*.ts',
    ],
    ignores: ['**/*.spec.ts', '**/*.schema.ts', '**/*.dto.ts'],
    rules: {
      'max-lines-per-function': [
        'error',
        {
          max: 15,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
    },
  },
);
