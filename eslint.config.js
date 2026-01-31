import { defineConfig } from 'eslint/config';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import ts from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig(
  {
    files: ['src/**/*.{js,mjs,cjc,ts,vue}', './*.{js,ts}'],
    extends: [
      ...ts.configs['recommended'],
      ...vue.configs['flat/recommended'],
      stylistic.configs.customize({
        indent: 2,
        quotes: 'single',
        semi: true,
        commaDangle: 'always-multiline',
        severity: 'warn',
        braceStyle: '1tbs',
        quoteProps: 'as-needed',
        arrowParens: true,
      }),
    ],
    plugins: {
      /** Вместо prettier */
      '@stylistic': stylistic,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parser: vueParser,
      parserOptions: {
        parser: ts.parser,
      },
    },
    rules: {
      'vue/max-attributes-per-line': [
        'warn',
        {
          singleline: {
            max: 5,
          },
          multiline: {
            max: 1,
          },
        },
      ],
      'vue/html-indent': ['warn', 2],
      'vue/block-order': ['warn', {
        order: [
          'template',
          'script:not([setup])',
          'script',
          'style:not([scoped])',
          'style[scoped]',
        ],
      }],
      'vue/no-undef-components': 'error',
      'vue/component-name-in-template-casing': ['warn', 'PascalCase', {
        registeredComponentsOnly: false,
        ignores: [],
      }],
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
);
