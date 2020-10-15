import Vue from 'vue'
import App from './App.vue'
import router from './routes/index'
import vuetify from './plugins/vuetify';
import vueTextareaAutosize from 'vue-textarea-autosize';
import vueRouter from 'vue-router'


import firebase from 'firebase/app';
import 'firebase/firestore';

Vue.use(vueTextareaAutosize)
Vue.use(vueRouter)

const firebaseConfig = {
  apiKey: "AIzaSyCjACjZOJOiGPJRVxkKUO1k6e4A7QxLwdw",
  authDomain: "txoko-booking.firebaseapp.com",
  databaseURL: "https://txoko-booking.firebaseio.com",
  projectId: "txoko-booking",
  storageBucket: "txoko-booking.appspot.com",
  messagingSenderId: "88667486462",
  appId: "1:88667486462:web:7f6df64e03e067cf2fcdaf"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

Vue.config.productionTip = false

new Vue({
  vuetify,
  firebase,
  router,
  vueTextareaAutosize,
  render: h => h(App)
}).$mount('#app')
