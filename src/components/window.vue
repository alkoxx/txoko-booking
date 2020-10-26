<template>
  <v-card
    flat
    tile
  >
    <v-window
      v-model="onboarding"
    >
      <v-window-item
        v-for="n in length"
        :key="`card-${n}`"
      >
        <v-card
          color="grey"
          height="200"
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <h1
              style="font-size: 5rem;"
              class="white--text"
            >
              Slide {{ n }}
            </h1>
          </v-row>
        </v-card>
      </v-window-item>
    </v-window>

    <v-card-actions class="justify-space-between">
      <v-btn
        text
        @click="onboarding--"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      
      <v-btn
        text
        @click="onboarding+2"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    data: () => ({
      length: 5,
      onboarding: 1,
    }),

    methods: {
      
    },
  }
</script>