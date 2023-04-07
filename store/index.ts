export const strict = false
// const debug = process.env.NODE_ENV !== 'production'
// export const plugins = debug ? [createLogger({})] : []
export const namespaced = true

import { Context } from '@nuxt/types'
import { checkLanguage } from '~/shared/helper/checkLanguage'

export const state = () => ({
  lang: '',
  clientSession: '',
  mystaysDevToken: ''
})

export const actions: any = {
  nuxtServerInit({ commit }: any, { query }: Context) {
    if (checkLanguage(query.language)) {
      const { shortLang } = checkLanguage(query.language)
      this.$i18n.setLocale(shortLang).then(() => {
        this.$triplaApi.setHeader(
          'tripla-locale',
          this.$langFormat(this.$i18n.locale)
        )
      })
    }
  },

  setSession({ commit }: any, session: string) {
    commit('SET_CLIENT_SESSION', session)
  },

  setMystaysDevToken({ commit }: any, mystaysDevToken: string) {
    commit('SET_MYSTAYS_DEV_TOKEN', mystaysDevToken)
  }
}

export const mutations = {
  ['SET_LANG'](state: any, lang: string) {
    state.lang = lang || 'ja'
  },
  SET_CLIENT_SESSION(state: any, session: string) {
    state.clientSession = session
  },
  SET_MYSTAYS_DEV_TOKEN(state: any, mystaysDevToken: string) {
    state.mystaysDevToken = mystaysDevToken
  }
}
