<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="2">
          <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>John Leider</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
        </v-col>
        <v-col cols="10">
          <Calendar />
        </v-col>
      </v-row>
    </v-container>
    
  </v-app>
</template>

<script>
import Calendar from './components/Calendar'

export default {
  name: 'App',

  components: {
    Calendar,
  },

  data: () => ({
    //
  }),
};
</script>
