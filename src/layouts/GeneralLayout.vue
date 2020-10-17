<template>
  <div>
    <v-app-bar
      dense
      dark
    > 
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Txoko booking</v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon @click="logout">
          mdi-logout
        </v-icon>
      </v-btn>
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
              <v-list-item-title>My events</v-list-item-title>              
            </v-list-item-content>
          </template>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>April 10...</v-list-item-title>       
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
        <router-view />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import firebase from 'firebase/app';

export default {
    name: 'GeneralLayout',
    data: () => ({
      drawer: false,
    }),
    methods: {
      logout: function(){
        firebase.auth().signOut().then(() => {
          this.$router.replace('login')
        })
      }
    }
}
</script>