import { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
  interface Vue {
    $scrollBody: typeof toggleScrollBody
  }
}

const toggleScrollBody = {
  disable: () => {
    const el = document.body
    el.classList.add('no-scroll')
    el.style.overflowY = 'hidden'
  },

  enable: () => {
    const el = document.body
    el.classList.remove('no-scroll')
    el.style.overflowY = 'auto'
  }
}

const scrollBody: Plugin = (_context, inject) => {
  inject('scrollBody', toggleScrollBody)
}

export default scrollBody
