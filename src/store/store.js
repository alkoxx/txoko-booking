import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        userData: {
            userId: null,
            username: null
        }
    },
    mutations: {
        saveUserData: (state, currentUser) => {
            const username = currentUser.email.split('@')[0]
            state.userData.userId = currentUser.uid
            state.userData.username = username
        }
}

})