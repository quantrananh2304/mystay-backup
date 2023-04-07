<template>
  <div class="d-flex flex-column header-nav-mobile-footer px-4 pb-4">
    <img
      :src="require('@/assets/images/Logo-Reverse.svg')"
      class="w-25"
      alt=""
    >
    <p class="mb-2">
      © 2018 MyStays Hotel Management Co., Ltd.
    </p>
    <div class="d-flex">
      <a
        :href="getWebsiteLink"
        class="header-nav-mobile-footer__link mr-3"
        target="_blank"
      >
        {{ $t('headers.visit_website') }}
      </a>
      <a
        :href="getPolicyLink"
        class="header-nav-mobile-footer__link mr-3"
        target="_blank"
      >
        {{ $t('headers.private_policy') }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderNavMobileFooter',
  props: {},
  computed: {
    getPolicyLink() {
      switch (this.$i18n.locale) {
        case 'ja':
          return 'https://www.mystays.com/privacy-policy/'
        case 'en':
          return 'https://www.mystays.com/en/privacy-policy/'
        case 'ko':
          return 'https://www.mystays.com/ko-kr/privacy-policy/'
        case 'zh':
          return 'https://www.mystays.com/zh-cn/privacy-policy/'
        case 'tw':
          return 'https://www.mystays.com/zh-tw/privacy-policy/'
        default:
          break
      }
    },
    getWebsiteLink() {
      switch (this.$i18n.locale) {
        case 'ja':
          return 'https://www.mystays.com/'
        case 'en':
          return 'https://www.mystays.com/en-us/'
        case 'ko':
          return 'https://www.mystays.com/ko-kr/'
        case 'zh':
          return 'https://www.mystays.com/zh-cn/'
        case 'tw':
          return 'https://www.mystays.com/zh-tw/'
        default:
          break
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header-nav-mobile-footer {
  p {
    font-size: 12px;
    color: $text-color-gray;
  }

  a {
    font-size: 12px;
    color: $text-color-blue-2;
    font-weight: bold;
  }
}
</style>
