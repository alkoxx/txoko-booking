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
              @click="login"
            >
              Login
            </v-btn>
            <v-btn
              x-large
              block
              color="secondary"
              @click="socialLogin"
            >
              Sign in with google 
              <v-icon right>
                mdi-google
              </v-icon>
            </v-btn>
            <p>
              <router-link to="/sign-up">
                Create account
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
      login(){
        firebase.auth().signInWithEmailAndPassword(this.email,this.password).then(
          () => {
            const currentUser = firebase.auth().currentUser            
            this.$store.commit('saveUserData', currentUser)
            this.$router.replace('calendar')
          },
        (err) => {
          alert('Oops. ' + err.message)
        });
      },
      socialLogin(){
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(() => {
          this.$router.replace('calendar')
        }).catch((err) =>{
          alert('Ooops...' + err.message)
        })
      }
    }
}
</script>