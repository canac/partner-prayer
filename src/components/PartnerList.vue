<template>
  <div class="partner-list">
    <MonthCalendar :month="activeMonth" v-slot:default="{ day }">
      <div class="day" :class="isDayCompleted(day) ? 'complete' : 'incomplete'">
        <div class="day-header">
          <div class="button-slot">
            <button
              class="toggle-active"
              @click="toggleDayActive(day)">
              <i class="fas" :class="isDayActive(day) ? 'fa-eye-slash' : 'fa-eye'" />
            </button>
          </div>
          <span class="day-title">{{ day.getDate() }}</span>
          <div class="button-slot">
            <button
              class="mark-complete"
              @click="completeDay(day)"
              v-if="!isDayCompleted(day) && getDayPartners(day).length > 0">
              <i class="fas fa-check" />
            </button>
            <button
              class="mark-incomplete"
              @click="uncompleteDay(day)"
              v-if="isDayCompleted(day) && getDayPartners(day).length > 0">
              <i class="fas fa-trash" />
            </button>
          </div>
        </div>
        <div class="partner" v-for="partner in getDayPartners(day)" :key="partner">
          {{ partner }}
        </div>
      </div>
    </MonthCalendar>
  </div>
</template>

<script lang="ts">
import '@fortawesome/fontawesome-free/js/fontawesome.js';
import '@fortawesome/fontawesome-free/js/solid.js';

import { isBefore, isWeekend, startOfDay, subDays } from 'date-fns';
import PartnerService from '../services/PartnerService';
import MonthCalendar from './MonthCalendar.vue';
import { Options, Vue } from 'vue-class-component';

const partnerService: PartnerService = new PartnerService();

@Options({
  components: {
    MonthCalendar,
  },
})
export default class PartnerList extends Vue {
  activeMonth: Date = new Date();

  lastCompletedDay: Date = subDays(startOfDay(new Date()), 3);

  isDayCompleted(day: Date): boolean {
    return !isBefore(this.lastCompletedDay, day);
  }

  isDayActive(day: Date): boolean {
    return !isWeekend(day);
  }

  getDayPartners(day: Date): string[] {
    return partnerService.getPartnersForDay(day);
  }

  toggleDayActive(day: Date) {
  }

  completeDay(day: Date) {
    this.lastCompletedDay = day;
  }

  uncompleteDay(day: Date) {
    this.lastCompletedDay = subDays(day, 1);
  }
};
</script>

<style scoped>
.day {
  padding: 0.5em 1em;
}

.day-header {
  padding-bottom: 0.25em;
  display: flex;
  font-size: 1.3em;
}

.day-header .button-slot {
  width: 1.7em;
}

.day-header button {
  border: none;
  background-color: transparent;
  font-size: inherit;
}

.day-header .mark-complete {
  color: hsl(120, 50%, 50%);
}
.day-header .mark-incomplete {
  color: hsl(0, 50%, 50%);
}
.day-header .toggle-active {
  color: #999999;
}

.day-header .day-title {
  flex: 1;
  color: #666666;
  text-align: center;
}

.partner {
  padding: 0.25em 0;
}

.day.incomplete {
  background-color: hsl(0, 50%, 80%);
}
.day.complete {
  background-color: hsl(120, 50%, 80%);
}
</style>
