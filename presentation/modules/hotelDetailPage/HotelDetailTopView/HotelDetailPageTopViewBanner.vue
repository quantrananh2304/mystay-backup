<template>
  <div class="hotel-detail-top-view-banner">
    <div
      v-if="!isHotelDetailV2Loading"
      class="hotel-detail-top-view-banner__image"
      @click="$_onShowGallery"
    >
      <LazyLoadImage
        :img-url="imageOverview"
        :image-width="940"
        :image-height="580"
      />
    </div>
    <div class="hotel-detail-top-view-banner__overview">
      <span class="icon-Icon-Gallery" />
      <span>1 / {{ totalImage }}</span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
export default Vue.extend({
  name: 'HotelDetailPageTopViewBanner',
  props: {
    totalImage: {
      type: Number,
      required: true
    },
    firstImage: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imageOverview: this.firstImage
    }
  },
  computed: {
    ...mapState({
      isHotelDetailV2Loading: state =>
        state.hotelDetail.isHotelDetailV2Loading
    })
  },
  watch: {
    firstImage(imageOverview) {
      this.imageOverview = imageOverview
    }
  },
  methods: {
    $_onShowGallery() {
      this.$emit('on:showGallery')
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-detail-top-view-banner {
  position: relative;
  @include min-sm {
    display: none;
  }

  &__overview {
    position: absolute;
    padding: 8px 20px 8px 15px;
    color: white;
    font-size: 11px;
    display: flex;
    align-items: center;
    top: 10px;
    left: auto;
    right: 10px;
    border-radius: 3px;
    background: $text-color-blue;

    span {
      &:first-child {
        margin-right: 10px;
        font-size: 18px;
      }
    }
  }
}
</style>
