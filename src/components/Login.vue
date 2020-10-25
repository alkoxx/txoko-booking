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
        <v-window :v-model="window">
          <v-window-item :value="1">
            <v-row>
              <v-col
                cols="12"
                md="8"
              >
                <v-card-text class="mt-12">
                  <h1>Sign in</h1>
                  <div
                    class="text-center"
                    mt-4
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
                      color="teal accent-3"
                      required
                    />
                    <v-text-field
                      v-model="password"
                      label="Password"
                      name="Password"
                      prepend-icon="mdi-lock"
                      :append-icon="showPass?'mdi-eye':'mdi-eye-off'"
                      :type="showPass ? 'text' : 'password'"
                      color="teal accent-3"
                      required
                      @click:append="showPass = !showPass"
                    />
                  </v-form>
                </v-card-text>
                <div class="text-center mt-3">
                  <v-btn
                    rounded
                    color="teal accent-3"
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
                class="teal accent-3"
              >
                <v-card-text class="white--text mt-12">
                  <h1 class="text-center text-h4">
                    Hello, Friends !
                  </h1>
                  <h5 class="text-center">
                    Enter your personal details
                  </h5>
                </v-card-text>
                <div class="text-center mt-3">
                  <v-btn
                    rounded
                    outlined                    
                    dark
                    @click="window++"
                  >
                    SIGN UP
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item :value="2" />
        </v-window>
      </v-card>
    </v-col>
    <v-card-text>
      <v-row>
        <v-col
          class="d-flex justify-center"            
        >            
          <p>
            <router-link to="/sign-up">
              Create account
            </router-link>
          </p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-row>
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
            showPass: false,
            window: 1
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