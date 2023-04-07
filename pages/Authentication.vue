<template>
  <div class="authentication">
    <div class="container">
      <div class="authentication__form">
        <div class="authentication__form__input">
          <input
            v-model="password"
            type="password"
            placeholder="Enter password"
            @keyup.enter="onSubmit"
          >
        </div>
        <div class="authentication__form__button">
          <button @click.enter="onSubmit">
            Submit
          </button>
        </div>
      </div>
      <div v-if="error" class="authentication__error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import SecureLS from 'secure-ls'
import { STATIC_PASSWORD } from '../shared/constants'
export default {
  name: 'Authentication',
  data() {
    return {
      password: '',
      error: ''
    }
  },
  methods: {
    ...mapActions({
      submitPassword: 'submitPassword'
    }),
    onSubmit() {
      //   this.submitPassword(this.password);
      const ls = new SecureLS({
        isCompression: false
      })
      if (this.password === STATIC_PASSWORD) {
        ls.set('auth-password', this.password)

        setTimeout(() => {
          const redirectUrl = this.$route.fullPath.split('redirectUrl=')
          this.$router.push(
            `${redirectUrl[1] ? decodeURIComponent(redirectUrl[1]) : '/'}`
          )
        })
      } else {
        this.error = 'Please enter correct password!'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.authentication {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #232e48;

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
  }
  &__form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;

    @include min-sm {
      flex-direction: row;
    }

    &__input {
      height: 45px;
      margin-bottom: 20px;

      @include min-sm {
        margin-right: 10px;
      }

      input {
        width: 100%;
        outline: none;
        padding: 0 50px 0 10px;
        height: 48px;
        border-radius: 4px;
        border: none;
      }
    }

    &__button {
      height: 48px;
      display: flex;
      justify-content: center;

      button {
        width: 50%;
        height: 100%;
        padding: 0 20px;
        background: #ffd25d;
        border: none;
        border-radius: 4px;
        font-weight: bold;

        @include min-sm {
          width: 100%;
        }
      }
    }
  }

  &__error {
    margin-top: 10px;
    color: rgb(168, 5, 10);
  }
}
</style>
