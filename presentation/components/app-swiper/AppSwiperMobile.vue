<template>
  <div class="swiper-mobile">
    <div class="swiper-mobile__gallery-view">
      <swiper ref="swiperViewFullScreen" :options="swiperOption">
        <swiper-slide v-for="(image, index) in hotelImageList" :key="index">
          <div class="swiper-mobile__gallery-view__image">
            <img
              v-lazy-load
              :data-src="getImageUrl(image) || image"
              class="swiper-lazy"
              alt=""
            >
          </div>
          <div class="swiper-lazy-preloader swiper-lazy-preloader-white" />
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination" />
        <div
          v-if="hotelImageList.length > 1"
          slot="button-prev"
          class="swiper-button-up"
        />
        <div
          v-if="hotelImageList.length > 1"
          slot="button-next"
          class="swiper-button-down"
        />
      </swiper>
    </div>
    <div class="swiper-mobile__close-btn" @click="$_closeGalleryView">
      <span class="icon-Icon-Close" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'

export default Vue.extend({
  name: 'AppSwiperMobile',
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    hotelImageList: {
      type: Array,
      required: true
    },
    currentSlide: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 1,
        loop: true,
        lazy: true,
        spaceBetween: 20,
        speed: 600,
        centeredSlides: false,
        slidesOffsetBefore: 0,
        direction: 'vertical',
        navigation: {
          nextEl: '.swiper-button-up',
          prevEl: '.swiper-button-down'
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        }
      }
    }
  },
  computed: {
    swiperTop() {
      return this.$refs.swiperViewFullScreen.$swiper
    }
  },
  watch: {
    currentSlide(currentSlide) {
      this.swiperTop.slideTo(currentSlide, 0)
    }
  },
  mounted() {
    // eslint-disable-next-line no-unused-expressions
    import(/* webpackChunkName: "swiper" */ 'swiper/css/swiper.css')
    this.swiperTop.slideTo(this.currentSlide, 0)
  },
  methods: {
    $_closeGalleryView() {
      this.$emit('on:closeGalleryView', this.swiperTop.activeIndex)
    },

    getImageUrl(data) {
      return data?.picture?.wordpress?.url || ''
    }
  }
})
</script>

<style lang="scss" scoped>
.swiper-mobile {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  background: white;
  @include min-sm {
    display: none;
  }
  &__gallery-view {
    height: 100%;
    &__image {
      height: 100%;
      position: relative;
    }
  }

  &__close-btn {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 50px;
    height: 50px;
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $text-color-blue;
    opacity: 0.8;
    span {
      color: white;
    }
  }
}

.swiper-container {
  height: 100%;
  .swiper-slide {
    text-align: center;
    background: $text-color-blue;
    img {
      width: 100vh;
      height: 100vw;
      -o-object-fit: contain;
      transform: rotate(90deg);
      object-fit: cover;
      transform: rotate(90deg) translateY(-100%);
      transform-origin: top left;
    }

    .swiper-lazy-preloader {
      // background: $text-color-blue;
    }
  }
}

.swiper-button-up,
.swiper-button-down {
  left: 45%;
  position: absolute;
  z-index: 20;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $text-color-blue;
  opacity: 0.8;
  outline: none;
}

.swiper-button-down {
  top: 0;
  transform: rotate(90deg);
  &:before {
    content: '\e906';
    color: white;
    font-family: icomoon;
  }
}

.swiper-button-up {
  bottom: 0;
  transform: rotate(90deg);
  &:before {
    content: '\e907';
    font-family: icomoon;
    color: white;
  }
}

.swiper-pagination {
  color: white;
  transform: rotate(90deg);
  bottom: 100px;
  left: -40%;
  width: 100%;
}
</style>
