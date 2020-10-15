<template>
  <v-card
    max-width="400"
    class="mx-auto"
  >
    <v-card-text>
      <v-form
        ref="loginForm"
      >
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="email"
              label="E-mail"
              required
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="password"
              :append-icon="show1?'eye':'eye-off'"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Password"
              @click:append="show1 = !show1"
            />
          </v-col>
          <v-spacer />
          <v-col
            class="d-flex"
            cols="12"
            sm="3"
            xsm="12"
            align-end
          >
            <v-btn
              x-large
              block
              color="success"
            >
              Login
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',            
            error: null,
            show1: false
        }
    },
    methods: {
        submit(){
            return true
        }
    }
}
</script>