<template>
  <div class="skeleton d-flex justify-content-between">
    <div class="skeleton__left mb-md-2 d-none d-sm-block flex-1 mr-5">
      <b-skeleton
        class="mb-4"
        animation="wave"
        height="25px"
        width="100%"
      />
      <b-skeleton
        class="mb-4"
        animation="wave"
        height="25px"
        width="55%"
      />
      <b-skeleton
        class="mb-4"
        animation="wave"
        height="25px"
        width="85%"
      />
      <b-skeleton
        class="mb-4 d-none d-md-flex"
        animation="wave"
        height="25px"
        width="70%"
      />
      <b-skeleton
        class="mb-4 d-none d-md-flex"
        animation="wave"
        height="25px"
        width="20%"
      />
    </div>
    <div class="skeleton__right">
      <div>
        <b-skeleton
          class="mb-3"
          animation="wave"
          height="25px"
          width="100%"
        />
        <b-skeleton
          class="mb-3"
          animation="wave"
          height="25px"
          width="100%"
        />
        <b-skeleton
          class="mb-3"
          animation="wave"
          height="25px"
          width="100%"
        />
      </div>
      <div class="pt-3 pb-3">
        <b-skeleton
          class="mb-3"
          animation="wave"
          height="25px"
          width="25%"
        />
      </div>
      <div class="d-flex justify-content-between">
        <b-skeleton width="45px" height="45px" type="avatar" />
        <b-skeleton width="45px" height="45px" type="avatar" />
        <b-skeleton width="45px" height="45px" type="avatar" />
        <b-skeleton width="45px" height="45px" type="avatar" />
        <b-skeleton width="45px" height="45px" type="avatar" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotelPageTopViewSkeleton'
}
</script>

<style lang="scss" scoped>
.skeleton {
  padding: 0 0 75px;
  flex-direction: column;

  @include min-sm {
    padding: 70px 0 75px;
    flex-direction: row;
  }

  &__left {
    @include min-sm {
      width: 60%;
    }
  }

  &__right {
    @include min-sm {
      width: calc(100% / 3);
    }
  }
}
</style>
