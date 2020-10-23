import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        userData: {
            userId: null,
            username: null
        },
        userEvents: []
    },
    mutations: {
        saveUserData: (state, currentUser) => {
            const username = currentUser.email.split('@')[0]
            state.userData.userId = currentUser.uid
            state.userData.username = username
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


            console.log(userEvents)
            commit('setUserEvents', userEvents)
        }
    }

})