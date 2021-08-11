/* eslint-disable import/no-extraneous-dependencies */
import replace from '@rollup/plugin-replace';

export default {
  mount: {
    public: { url: '/', static: true },
    src: '/_dist_',
    'node_modules/@fortawesome/fontawesome-free/webfonts': {
      url: '/webfonts',
      static: true,
    },
  },
  plugins: ['@snowpack/plugin-vue', '@snowpack/plugin-dotenv'],
  packageOptions: {
    rollup: {
      plugins: [
        replace({
          preventAssignment: true,
          __VUE_OPTIONS_API__: false,
          __VUE_PROD_DEVTOOLS__: false,
        }),
      ],
    },
  },
};
