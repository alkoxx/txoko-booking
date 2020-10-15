<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
        </v-toolbar>
      </v-sheet>

      <!-- Add event dialog -->
      <v-dialog
        v-model="dialog"
        width="500"
        @click:outside="cancelDialog"
      >
        <v-card>
          <v-toolbar
            :color="selectedEvent.color"
            dark
          >
            <v-btn
              icon
              @click="deleteEvent(selectedEvent)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-toolbar-title v-html="Object.entries(selectedEvent).length === 0 ? 'Add Event' : selectedEvent.name" />
          </v-toolbar>

          <v-container
            v-if="currentlyEditing != null || Object.entries(selectedEvent).length === 0"
          >
            <v-form
              @submit.prevent="addEvent"
            >
              <v-menu
                ref="dateMenu"
                v-model="dateMenu"
                :close-on-content-click="false"
                :return-value.sync="eventData.start"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="eventData.start"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="eventData.start"
                  no-title
                  scrollable
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="dateMenu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dateMenu.save(eventData.start)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <v-switch
                v-model="eventData.name"
                value="breakfast"
                label="BREAKFAST"
              />
              <v-switch
                v-model="eventData.name"
                value="lunch"
                label="LUNCH"
              />
              <v-switch
                v-model="eventData.name"
                value="dinner"
                label="DINNER"
              />

              <v-card-actions>
                <v-spacer />
                <v-btn
                  v-if="currentlyEditing == null"
                  type="submit"
                  color="green darken-1"
                  text
                  @click.stop="dialog = false"
                >
                  Save
                </v-btn>
                <v-btn
                  v-else
                  text
                  color="green darken-1"
                  @click="updateEvent(selectedEvent)"
                >
                  Update
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-container>
          
          <v-container v-else>
            <v-card-text>{{ eventData.start }}</v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="green darken-1"
                text
                @click="currentlyEditing = selectedEvent.id"
              >
                Edit
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-dialog>

      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          type="month"
          color="primary"
          :events="events"
          event-color="blue"
          @click:event="showEvent"
          @click:date="showDialog"
        />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
  import {db} from '../main';

  export default {
    data: () => ({
      focus: '',
      type: 'month',      
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      eventData: {
        name: '',
        start: new Date().toISOString().substr(0, 10)
      },
      dateMenu: false,
      name: null,
      details: null,
      color: '#197602',
      currentlyEditing: null,
      dialog: false,
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    }),
    created(){
      this.getEvents();
    },
    methods: {
      editEvent(selEv){
        this.currentlyEditing = selEv.id
      },
      showEvent({ nativeEvent, event }){
        this.selectedEvent = event
        this.updateEventData(event)
        this.currentlyEditing = null

        this.dialog = true;
        nativeEvent.stopPropagation()
      },
      showEventOld ({ nativeEvent, event }) {
        console.log(event)
        console.log(nativeEvent)
        
        const open = () => {
          this.selectedEvent = event
          this.updateEventData(event)
          this.currentlyEditing = null
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }
        
        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }
        nativeEvent.stopPropagation()        
      },
      async updateEvent(selEv){
        try {
            await db.collection('events').doc(selEv.id).update({
            name: this.eventData.name
          })
        } catch (error) {
          console.log(error)
        }
        this.cancelDialog()
        this.getEvents()
      },
      async addEvent(){
        try {
          //TODO: Add validation
          if(this.eventData.name != null){
            await db.collection('events').add(
              this.eventData
            );
          }
          this.eventData.start = null;
          this.eventData.name = null;
        } catch (error) {
          console.log(error);
        }
        this.getEvents();
      },
      async deleteEvent(selEv){
        try {
          await db.collection('events').doc(selEv.id).delete();          
        } catch (error) {
          console.log(error)
        }
        this.cancelDialog();
        this.getEvents();
      },
      async getEvents(){
        const events = [];
        try {
          const snapshot = await db.collection('events').get();
          snapshot.forEach(doc => {
            let eventData = doc.data();
            eventData.id = doc.id;
            events.push(eventData);
          })
        } catch (error) {
          console.log(error);
        }
        this.events = events
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showDialog({date}){
        this.eventData.start = date;
        this.dialog = true;
      },
      cancelDialog(){
        this.dialog = false
        setTimeout(() => {
            this.currentlyEditing = null;
            this.selectedEvent = {};
          }, 100)        
      },
      updateEventData(event){
        this.eventData.name = event.name
        this.eventData.start = event.start
      } 
    },
  }
</script>