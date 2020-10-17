<template>
  <v-card
    max-width="400"
    class="mx-auto"
  >
    <v-card-text>
      <v-form
        ref="signUpForm"
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
              @click="signUp"
            >
              Sign up
            </v-btn>
            <p>
              <router-link to="/login">
                Back to login
              </router-link>
            </p>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import firebase from 'firebase';

export default {
    name: 'SignUp',
    data() {
        return {
            email: '',
            password: '',            
            error: null,
            show1: false
        }
    },
    methods: {
      signUp(){
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
          function(user){
            alert('Account created ' + user);
        },
        function (err){
          alert('Oops. ' + err.message)
        });
      }
    }
}
</script>