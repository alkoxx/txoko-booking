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
            @click="next(1)"
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
              v-if="currentlyEditing != null && hasPermission(selectedEvent)"
              icon
              @click="
                deleteEvent(selectedEvent)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-toolbar-title v-html="Object.entries(selectedEvent).length === 0 ? 'Add Event' : selectedEvent.name" />
            <v-spacer />
            <v-btn
              icon
              @click="cancelDialog"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
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
                value="BREAKFAST"
                label="BREAKFAST"
              />
              <v-switch
                v-model="eventData.name"
                value="LUNCH"
                label="LUNCH"
              />
              <v-switch
                v-model="eventData.name"
                value="DINNER"
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

            <v-card-actions v-if="hasPermission(selectedEvent)">
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
          :event-color="getEventColor"
          @click:event="showEvent"
          @click:date="showDialog"
          @change="updateRange"
        >
          <template #event="{ event }">
            <div
              class="text-center"
            >              
              <strong>{{ event.name }}</strong> - {{ userEmail }} 
            </div>            
          </template>
        </v-calendar>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
  import {db} from '../main';
  //import firebase from 'firebase';

  export default {
    data: () => ({
      focus: '',
      type: 'month',      
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      curerntMonth: null,
      events: [],
      eventData: {
        name: '',
        color: '',
        userId: '',
        start: new Date().toISOString().substr(0, 10)
      },
      dateMenu: false,
      name: null,
      details: null,
      color: '#197602',
      currentlyEditing: null,
      dialog: false,
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1']
    }),
    computed: {
      userEmail(){
        return this.$store.state.userData.email
      }
    },
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
      async updateEvent(selEv){
        try {
          if(this.eventData.name != null && this.eventData.start != null && !this.eventExists()){
            await db.collection('events').doc(selEv.id).update({
              name: this.eventData.name,
              start: this.eventData.start
            })
          }else{
            console.log('Already exists or missing data')
          }
        } catch (error) {
          console.log(error)
        }
        this.cancelDialog()
      },
      async addEvent(){
        try {
          //TODO: Add validation
          if(this.eventData.name != null && this.eventData.start != null && !this.eventExists() ){
            const userId = this.$store.state.userData.userId
            //Get user data
            const docRef = db.collection('users').doc(userId)
            const doc = await docRef.get()

            this.eventData.userId = userId
            this.eventData.color = doc.data().color

            await db.collection('events').add(
              this.eventData
            );
          }else{
            console.log('Already exists or missing data')
          }
          this.eventData.start = null;
          this.eventData.name = null;
        } catch (error) {
          console.log(error);
        }
      },
      async deleteEvent(selEv){
        try {
          await db.collection('events').doc(selEv.id).delete();          
        } catch (error) {
          console.log(error)
        }
        this.cancelDialog();
      },
      async getEvents(){
        const events = [];
        try {
          //TODO: Use vuex to save unsuscribe function and call it when log out
          const unsubscribe = await db.collection('events').onSnapshot(snapshot => {
            events.length = 0
            snapshot.forEach(doc => {
              let eventData = doc.data();
              eventData.id = doc.id;
              events.push(eventData);              
            })
            this.$store.dispatch('setUserEvents', events)
          })
          this.$store.state.unsubscribe = unsubscribe
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
      next (n) {
        this.$refs.calendar.next(n)
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
      },
      updateRange({ start }){
        this.$store.state.currentDate = start
      },
      getEventColor(event){
        return event.color
      },
      hasPermission(event){
        return this.$store.state.userData.userId === event.userId
      },
      eventExists(){
        const existingEvent = this.events.filter( event => event.name === this.eventData.name && event.start === this.eventData.start)
        return existingEvent.length > 0
      }
    },
  }
</script>