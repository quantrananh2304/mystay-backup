<template>
  <div class="row">
    <div class="col">
      <b-skeleton-img aspect="940:580" />
    </div>
    <div class="col">
      <b-skeleton-img aspect="940:580" />
    </div>
    <div class="col">
      <b-skeleton-img aspect="940:580" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotelDetailSwiperSkeleton'
}
</script>

<style lang="scss" scoped>
.col {
  padding: 0 8px;
}
</style>
