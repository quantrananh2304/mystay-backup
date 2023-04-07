<template>
  <div class="guest-detail__info">
    <GuestDetailInfoTop />
    <GuestDetailGuestInfo />
    <GuestDetailAdditional />
  </div>
</template>

<script>
export default {
  name: 'GuestDetailInfo'
}
</script>

<style lang="scss" scoped>
.guest-detail__info {
  width: 100%;

  @include min-xl {
    width: 656px;
  }
}
</style>
