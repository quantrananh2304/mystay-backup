<template>
  <div class="confirm-stay-overview-skeleton">
    <div class="mb-3">
      <b-skeleton animation="fade" width="85%" height="25px" class="mb-3" />
      <b-skeleton animation="fade" width="55%" height="25px" class="mb-3" />
      <b-skeleton animation="fade" width="70%" height="25px" class="mb-3" />
      <b-skeleton animation="fade" width="80%" height="25px" class="mb-3" />
    </div>
    <div class="mt-5">
      <b-skeleton animation="fade" width="100%" height="25px" class="mb-4" />
      <b-skeleton animation="fade" width="100%" height="25px" class="mb-4" />
      <b-skeleton animation="fade" width="100%" height="25px" class="mb-4" />
      <b-skeleton animation="fade" width="100%" height="25px" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmStayOverviewSkeleton'
}
</script>

<style lang="scss" scoped>
.confirm-stay-overview-skeleton {
  border: 1px solid #dddee0;
  border-top: none;
  border-radius: 0 0 4px 4px;
  padding: 30px;
}
</style>
