<template>
  <v-container>
    <v-app-bar
      dense
      dark
      color="light-blue darken-4"
    > 
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Txoko booking</v-toolbar-title>
      
      <v-spacer />

      <div class="white--text">
        {{ this.$store.state.userData.email }}
      </div>
      <v-toolbar-items>
        <v-btn icon>
          <v-icon @click="logout">
            mdi-logout
          </v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
 
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list
        nav
        dense
      >        
        <v-list-group no-action>
          <template #prependIcon>
            <v-icon small>
              mdi-calendar
            </v-icon>
          </template>
          <template #activator>
            <v-list-item-content>
              <v-list-item-title>My future events</v-list-item-title>              
            </v-list-item-content>
          </template>

          <v-list-item>
            <v-list-item-content>
              <template v-for="(userEvent, key) in this.$store.state.userEvents">
                <v-list-item-title
                  :key="key"
                  @click="moveCalendar(userEvent.start)"
                >
                  {{ userEvent.start }} {{ userEvent.name }}
                </v-list-item-title>
              </template>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
          
        <v-list-group no-action>
          <template #prependIcon>
            <v-icon small>
              mdi-bell-ring
            </v-icon>
          </template>
          <template #activator>
            <v-list-item-content>
              <v-list-item-title>Notifications</v-list-item-title>              
            </v-list-item-content>
          </template>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>New event...</v-list-item-title>    
              <v-list-item-subtitle>New event...</v-list-item-subtitle>       
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-row>        
      <v-col>
        <calendar ref="calendarLayout" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from 'firebase/app';
import calendar from '../components/Calendar';

export default {
    name: 'GeneralLayout',
    components: {
      calendar,
    },
    data: () => ({
      drawer: false,      
    }),
    methods: {
      logout: function(){
        this.$store.state.unsubscribe()
        firebase.auth().signOut().then(() => {
          this.$router.replace('login')
        })
      },
      moveCalendar: function(eventDate) {
        const curDate = this.$store.state.currentDate
        const evDate = new Date(eventDate)
        let months = (evDate.getFullYear() - curDate.year) * 12;
        months -= curDate.month;
        months += evDate.getMonth() + 1;
        months <= 0 ? 0 : months;
        this.$refs.calendarLayout.next(months)
      }
    }
}
</script>