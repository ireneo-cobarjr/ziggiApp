<template>
  <div class="auth-panel">
    <div class="q-gutter-y-md q-py-sm login">
        <span class="text-weight-bold text-h3 text-primary">Ziggi</span>
        <q-input color="grey-3" label-color="primary" outlined v-model="email" label="Email">
        <template v-slot:append>
            <q-icon name="email" color="primary" />
        </template>
        </q-input>
        <q-input color="grey-3" label-color="primary" outlined v-model="password" label="Password" type="password">
        <template v-slot:append>
            <q-icon name="lock" color="primary" />
        </template>
        </q-input>
        <q-btn color="primary" label="Log In" class="full-width" @click="login" :loading="loading" :disable="loading" />
        <div class="text-accent q-my-md">{{error}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: 'nmojica@signalsecure.com',
      password: 'd3v3l0p3r',
      error: '',
      loading: false
    }
  },
  methods: {
    login () {
      this.loading = true
      const arg = { email: this.email, password: this.password }
      this.$store.dispatch('auth/login', arg)
        .then(() => {
          this.loading = true
          this.$router.push('/')
        }).catch(() => { this.error = 'Unable to Login' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .auth-panel {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 89vh;

    .login {
        text-align: center;
        width: 320px;
    }
  }
</style>
