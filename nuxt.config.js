import { resolve } from 'path'
import webpack from 'webpack'

export default {
  mode: 'universal',

  // env
  env: {
    MYSTAYS_BASE_URL: process.env.MYSTAYS_BASE_URL,
    TRIPLA_BASE_URL: process.env.TRIPLA_BASE_URL,
    SESSION_URL: process.env.SESSION_URL,
    PUBLIC_KEY: process.env.PUBLIC_KEY,
    PAYMENT_URL: process.env.PAYMENT_URL,
    SECRET: process.env.SECRET,
    KEY: process.env.KEY,
    GLOBAL_HOTEL_ID: process.env.GLOBAL_HOTEL_ID
  },

  // router

  router: {
    middleware: ['triplaClientSession', 'mystaysDevToken', 'auth']
  },

  /*
   ** Headers of the page
   */
  server: {
    port: 8081, // default: 3000
    host: '0.0.0.0' // default: localhost
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=no'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */

  loading: false,
  components: ['~presentation/'],
  /*
   ** Global CSS
   */
  css: ['~/assets/scss/global.scss'],
  /*
   ** Plugins to load before mounting the App
   */

  alias: {
    '@components': resolve(__dirname, './presentation/components'),
    '@modules': resolve(__dirname, './presentation/modules')
  },

  plugins: [
    'plugins/axios.ts',
    'plugins/repositories/repositories.ts',
    'plugins/langFormat.ts',
    'plugins/dateTimeFormat.ts',
    'plugins/language.ts',
    '~/mixins/index',
    'plugins/currency.ts',
    'plugins/scrollBody.ts',
    'plugins/vuelidate.ts',
    'plugins/filters.ts',
    'plugins/icons.ts',
    'plugins/constants.ts',
    'plugins/pageRoute.ts',
    // { src: '~plugins/sw.js', ssr: false },
    {
      src: '~plugins/baiduMapCluster.ts',
      ssr: false
    },
    {
      src: '~plugins/vueIdle.js',
      ssr: false
    },
    {
      src: '~plugins/baiduMap.ts',
      ssr: false
    },
    {
      src: '~/plugins/localStorage.ts',
      ssr: false
    },
    {
      src: '~plugins/vue2GoogleMap.js'
    }
  ],
  pwa: {
    manifest: {
      name: 'MYSTAYS',
      short_name: 'Mystays',
      lang: 'en-US',
      useWebmanifestExtension: false,
      background_color: '#232e48',
      start_url: '/',
      theme_color: '#ffd25d',
      orientation: 'portrait',
      display: 'standalone',
      description:
        'MYSTAYS Hotels & Resorts | Your Hotel in Japan| Official Booking Website',
      gcm_sender_id: '103953800507',
      gcm_user_visible_only: true
    },
    icon: {
      purpose: 'maskable',
      sizes: [144, 152, 192, 384, 512]
    },
    cleanupOutdatedCaches: true,
    workbox: {
      // importScripts: [
      //   'custom-sw.js'
      // ],
      // cachingExtensions: '@/plugins/workbox-range-request.js',
      cacheNames: 'mystays-workbox-v1',
      runtimeCaching: [
        {
          urlPattern: '/.*',
          handler: 'networkFirst',
          method: 'GET',
          strategyOptions: {
            cacheName: 'mystays-api-cache',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: 'https://endpoint.tripla.ai/.*',
          handler: 'networkFirst',
          method: 'GET',
          strategyOptions: {
            cacheName: 'enpoint',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: 'https://endpoint.tripla.ai/.*',
          handler: 'networkFirst',
          method: 'POST',
          strategyOptions: {
            cacheName: 'enpoint',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: 'https://d1vhtuaxtr1kgn.cloudfront.net/.*',
          handler: 'networkFirst',
          method: 'GET',
          strategyOptions: {
            cacheName: 'enpoint',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        // {
        //   urlPattern: 'https://d2ahiw9kb7is19.cloudfront.net/.*',
        //   handler: 'networkFirst',
        //   method: 'GET',
        //   strategyOptions: {
        //     cacheName: 'enpoint',
        //     cacheableResponse: {
        //       statuses: [0, 200]
        //     }
        //   }
        // },
        {
          urlPattern: 'https://triplaapi.mystays.com/.*',
          handler: 'networkFirst',
          method: 'GET',
          strategyOptions: {
            cacheName: 'enpoint',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: 'https://cdn0.tripla.ai/.*',
          handler: 'networkFirst',
          method: 'GET',
          strategyOptions: {
            cacheName: 'room-plan-image',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
      /* workbox options */
    }
  },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/router',
    '@nuxtjs/pwa',
    [
      '@nuxtjs/dotenv',
      {
        path: './env/',
        filename: `.env.${process.env.ENV_FILE}`
      }
    ]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/i18n',
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    'nuxt-clipboard2',
    'vue-social-sharing/nuxt',
    '@nuxtjs/pwa',
    [
      'nuxt-lazy-load',
      {
        directiveOnly: true
      }
    ],
    [
      'cookie-universal-nuxt',
      {
        alias: 'cookiz'
      }
    ],
    '@nuxtjs/gtm'
  ],

  i18n: {
    locales: [
      {
        code: 'ja',
        iso: 'ja-JP',
        file: 'ja.json'
      },
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.json'
      },
      {
        code: 'ko',
        iso: 'ko-KR',
        file: 'ko.json'
      },
      {
        code: 'tw',
        iso: 'zh-TW',
        file: 'tw.json'
      },
      {
        code: 'zh',
        file: 'cn.json'
      }
    ],
    defaultLocale: 'ja',
    langDir: 'locales/',
    lazy: true,
    strategy: 'no_prefix',
    vueI18n: {
      fallbackLocale: 'ja'
    }
  },

  gtm: {
    id: 'GTM-THDNVBM',
    enabled: process.env.NODE_ENV === 'production',
    debug: false,
    layer: 'dataLayer',
    variables: {},
    pageTracking: false,
    pageViewEventName: 'nuxtRoute',

    autoInit: true,
    scriptId: 'gtm-script',
    scriptDefer: false,
    scriptURL: 'https://www.googletagmanager.com/gtm.js',
    crossOrigin: false,

    noscript: true,
    noscriptId: 'gtm-noscript',
    noscriptURL: 'https://www.googletagmanager.com/ns.html'
  },

  bootstrapVue: {
    components: [
      'BAlert',
      'BCollapse',
      'BSkeleton',
      'BSkeletonImg',
      'BButton',
      'BCard',
      'BFormGroup',
      'BFormRadioGroup',
      'BFormTextarea',
      'BSpinner',
      'BModal',
      'BTooltip',
      'BToast'
    ],
    directivePlugins: ['VBTooltipPlugin', 'VBTogglePlugin']
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^vue2-google-maps($|\/)/],
    plugins: [
      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale$/,
        /ja|en-us|ko|zh-cn|zh-tw/
      )
    ],
    babel: {
      presets: [
        [
          require.resolve('@nuxt/babel-preset-app'),
          {
            browsers: ['IE 11', 'last 2 version']
          }
        ]
      ],
      plugins: ['@babel/plugin-proposal-optional-chaining'],
      compact: true
    },
    extractCSS: true,
    optimizeCSS: true,
    html: {
      minify: {
        minifyURLs: true,
        removeComments: true,
        removeEmptyElements: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true
      }
    },
    extend(config) {
      config.externals = {
        canvg: 'canvg',
        html2canvas: 'html2canvas',
        dompurify: 'dompurify'
      }
      config.resolve.symlinks = false
    }
  },
  styleResources: {
    scss: ['./assets/scss/styleResource.scss']
  }
}
