import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        userData: {
            userId: null,
            email: null
        },
        userEvents: [],
        unsubscribe: null,
        currentDate: null,
    },
    mutations: {
        saveUserData: (state, currentUser) => {
            state.userData.userId = currentUser.uid
            state.userData.email = currentUser.email
        },
        setUserEvents: (state, userEvents) => {
            state.userEvents = userEvents
        }
    },
    actions: {
        setUserEvents: ({state, commit}, events) => {            
            const userEvents = events.filter(event => {
                                return event.userId == state.userData.userId &&
                                event.start >= new Date().toISOString().substr(0, 10)
            })
            commit('setUserEvents', userEvents)
        }
    },
    plugins: [createPersistedState()]

})