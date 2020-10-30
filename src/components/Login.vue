<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      cols="12"
      sm="8"
      md="8"
    >
      <v-card class="elevation-12">
        <v-window v-model="step">
          <v-window-item>
            <v-row class="fill-height">
              <v-col
                cols="12"
                md="8"
              >
                <v-card-text class="mt-12">
                  <h1 class="text-center display-2 light-blue--text text--darken-1">
                    Sign in
                  </h1>
                  <div
                    class="text-center mt-4"                    
                  >
                    <v-btn
                      fab
                      color="black"
                      outlined
                      @click="socialLogin"
                    >
                      <v-icon>
                        mdi-google
                      </v-icon>
                    </v-btn>
                  </div>
                  <v-form>
                    <v-text-field
                      v-model="email"
                      label="Email"
                      name="Email"
                      prepend-icon="mdi-email"
                      type="text"
                      color="light-blue darken-1"
                      required
                    />
                    <v-text-field
                      v-model="password"
                      label="Password"
                      name="Password"
                      prepend-icon="mdi-lock"
                      :append-icon="showPass?'mdi-eye':'mdi-eye-off'"
                      :type="showPass ? 'text' : 'password'"
                      color="light-blue darken-1"
                      required
                      @click:append="showPass = !showPass"
                    />
                  </v-form>
                </v-card-text>
                <div class="text-center mt-3">
                  <v-btn
                    rounded
                    color="light-blue darken-1"
                    dark
                    @click="login"
                  >
                    SIGN IN
                  </v-btn>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="4"
                class="light-blue darken-1"
              >
                <v-card-text class="white--text mt-12">
                  <h1 class="text-center text-h4">
                    Start booking !
                  </h1>
                  <h5 class="text-center">
                    If you are new, enter your personal details and create an account
                  </h5>
                </v-card-text>
                <div class="text-center mt-3">
                  <v-btn
                    rounded
                    outlined                    
                    dark
                    @click="step++"
                  >
                    SIGN UP
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item>
            <v-row class="fill-height">
              <v-col
                cols="12"
                md="4"
                class="light-blue darken-1"
              >
                <v-card-text class="white--text mt-12">
                  <h1 class="text-center text-h4">
                    Welcome back !
                  </h1>
                  <h5 class="text-center">
                    If you already have an account login with your credentials
                  </h5>
                </v-card-text>
                <div class="text-center mt-3">
                  <v-btn
                    rounded
                    outlined                    
                    dark
                    @click="step--"
                  >
                    SIGN IN
                  </v-btn>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="8"
              >
                <v-card-text class="mt-12">
                  <h1
                    class="text-center display-2 light-blue--text text--darken-1"
                  >
                    Create account
                  </h1>
                  <div
                    class="text-center mt-4"                    
                  >
                    <v-btn
                      fab
                      color="black"
                      outlined
                      @click="socialLogin"
                    >
                      <v-icon>
                        mdi-google
                      </v-icon>
                    </v-btn>
                  </div>
                  <v-form>                    
                    <v-text-field
                      v-model="email"
                      label="Email"
                      name="Email"
                      prepend-icon="mdi-email"
                      type="text"
                      color="light-blue darken-1"
                      required
                    />
                    <v-text-field
                      v-model="password"
                      label="Password"
                      name="Password"
                      prepend-icon="mdi-lock"
                      :append-icon="showPass?'mdi-eye':'mdi-eye-off'"
                      :type="showPass ? 'text' : 'password'"
                      color="light-blue darken-1"
                      required
                      @click:append="showPass = !showPass"
                    />
                  </v-form>
                </v-card-text>
                <div class="text-center mt-3">
                  <v-btn
                    rounded
                    color="light-blue darken-1"
                    dark
                    @click="signUp"
                  >
                    SIGN UP
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import firebase from 'firebase';
import {db} from '../main';
import randomColor from '../utils/colorMaker'

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',            
            error: null,
            showPass: false,
            step: 0
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
          this.saveUser()
          const currentUser = firebase.auth().currentUser            
          this.$store.commit('saveUserData', currentUser)
          this.$router.replace('calendar')
        }).catch((err) =>{
          alert('Ooops...' + err.message)
        })
      },
      signUp(){
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
          () => {            
            this.saveUser()
            this.$router.replace('calendar')
        },
        function (err){
          alert('Oops. ' + err.message)
        });
      },
      async saveUser(){
        const currentUser = firebase.auth().currentUser
        this.$store.commit('saveUserData', currentUser)
        try {
          await db.collection('users').doc(currentUser.uid).set({
            color: randomColor(),
            email: currentUser.email
          })
        } catch (error) {
          console.log(error)
        }               
      }
    }
}
</script>