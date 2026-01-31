import path from 'node:path';
import { fileURLToPath } from 'node:url';
import webpack from 'webpack';
import { VueLoaderPlugin } from 'vue-loader';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadValidEnv = (mode) => {
  dotenv.config({
    path: [
      path.resolve(__dirname, '.env'),
      path.resolve(__dirname, `.env.${mode}`),
    ],
    override: true,
  });

  let {
    APP_BASE_URL,
    OPENWEATHERMAP_API_KEY,
    OPENWEATHERMAP_API_BASE_URL,
    OPENWEATHERMAP_ICON_BASE_URL,
  } = process.env;

  if (!APP_BASE_URL) APP_BASE_URL = '/';
  if (!OPENWEATHERMAP_API_KEY) throw new Error('Не указан env параметр OPENWEATHERMAP_API_KEY');
  if (!OPENWEATHERMAP_API_BASE_URL) throw new Error('Не указан env параметр OPENWEATHERMAP_API_BASE_URL');
  if (!OPENWEATHERMAP_ICON_BASE_URL) throw new Error('Не указан env параметр OPENWEATHERMAP_ICON_BASE_URL');

  return {
    APP_BASE_URL,
    OPENWEATHERMAP_API_KEY,
    OPENWEATHERMAP_API_BASE_URL,
    OPENWEATHERMAP_ICON_BASE_URL,
  };
};

/** @return {import('webpack').Configuration} */
const config = (_, argv) => {
  const isProd = argv.mode === 'production';
  const isDev = argv.mode == 'development';

  const env = loadValidEnv(argv.mode);

  return {
    mode: argv.mode,
    devtool: isProd ? false : 'source-map',
    devServer: {
      port: 3000,
      open: true,
      hot: true,
    },

    entry: path.resolve(__dirname, 'src', 'main.ts'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true,
      publicPath: env.APP_BASE_URL,
    },
    resolve: {
      extensions: ['.ts', '.js', '.vue'],
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
    },

    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            configFile: 'tsconfig.app.json',
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
        favicon: path.resolve(__dirname, 'public', 'favicon.ico'),
      }),
      new webpack.DefinePlugin({
        // Доступные env переменные
        'import.meta.env.APP_BASE_URL': JSON.stringify(env.APP_BASE_URL),
        'import.meta.env.OPENWEATHERMAP_API_KEY': JSON.stringify(env.OPENWEATHERMAP_API_KEY),
        'import.meta.env.OPENWEATHERMAP_API_BASE_URL': JSON.stringify(env.OPENWEATHERMAP_API_BASE_URL),
        'import.meta.env.OPENWEATHERMAP_ICON_BASE_URL': JSON.stringify(env.OPENWEATHERMAP_ICON_BASE_URL),

        // Флаги компиляции Vue https://vuejs.org/api/compile-time-flags
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(isDev),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(isDev),
      }),
    ],
  };
};

export default config;
