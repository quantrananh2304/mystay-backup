<template>
  <div class="summary-change-skeleton">
    <b-skeleton animation="fade" width="30%" height="30px" class="mb-4 mt-2" />
    <b-skeleton animation="fade" width="55%" class="mb-4" height="42px" />
    <b-skeleton
      animation="fade"
      width="98%"
      class="mb-4"
      :height="isMobile ? '18px' : '23px'"
    />
    <b-skeleton
      animation="fade"
      width="98%"
      class="mb-2"
      :height="isMobile ? '18px' : '23px'"
    />
  </div>
</template>

<script>
export default {
  name: 'SummaryChargeSkeleton'
}
</script>

<style>
</style>
