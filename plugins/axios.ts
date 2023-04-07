import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { AxiosResponse } from 'axios'
import { Plugin } from '@nuxt/types'
import triplaApiFn from './api/triplaApi'
import devMystayFn from './api/devMystays'
import mystaysFn from './api/mystays'

declare module 'vue/types/vue' {
  interface Vue {
    langFormat(lang: string): void
    $triplaApi: NuxtAxiosInstance
    $mystaysApi: NuxtAxiosInstance
    $api: NuxtAxiosInstance
  }
}

declare module '@nuxt/types' {
  interface Context {
    $triplaApi: NuxtAxiosInstance
    $mystaysApi: NuxtAxiosInstance
    $api: NuxtAxiosInstance
    $axios: NuxtAxiosInstance
    $cookiz: any
    i18n: any
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $triplaApi: NuxtAxiosInstance
    $mystaysApi: NuxtAxiosInstance
    $api: NuxtAxiosInstance
    $axios: NuxtAxiosInstance
    $cookiz: any
    i18n: any
  }
}

const axiosPlugin: Plugin = (ctx, inject) => {
  // axios
  ctx.$axios.setBaseURL('')
  ctx.$axios.onResponse((resp: AxiosResponse | any) => {
    return resp.data
  })

  // tripla
  triplaApiFn(ctx, inject)

  // dev mystays api
  devMystayFn(ctx, inject)

  // mystays.com api
  mystaysFn(ctx, inject)
}

export default axiosPlugin
