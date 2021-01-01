<template>
  <div class="partner-list">
    <MonthCalendar :month="activeMonth" v-slot:default="{ day }">
      <div class="day" :class="isDaySkipped(day) ? 'skipped' : (isDayCompleted(day) ? 'complete' : 'incomplete')">
        <div class="day-header">
          <div class="button-slot">
            <button
              class="toggle-active"
              @click="toggleDaySkipped(day)">
              <i class="fas fa-fw" :class="isDaySkipped(day) ? 'fa-eye' : 'fa-eye-slash'" />
            </button>
          </div>
          <span class="day-title">{{ day.getDate() }}</span>
          <div class="button-slot">
            <button
              class="mark-complete"
              @click="completeDay(day)"
              v-if="!isDayCompleted(day) && !isDaySkipped(day)">
              <i class="fas fa-fw fa-check" />
            </button>
            <button
              class="mark-incomplete"
              @click="uncompleteDay(day)"
              v-if="isDayCompleted(day) && !isDaySkipped(day)">
              <i class="fas fa-fw fa-trash" />
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
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';

import { isBefore, startOfDay, subDays } from 'date-fns';
import PartnerService from '../services/PartnerService';
import { settingsServiceSingleton } from '../services/SettingsService';
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

  get lastCompletedDay(): Date {
    return settingsServiceSingleton.getSettings().lastCompletedDay;
  }

  isDaySkipped(day: Date): boolean {
    return partnerService.isDaySkipped(day);
  }

  toggleDaySkipped(day: Date) {
    partnerService.setDaySkipped(day, !this.isDaySkipped(day));
  }

  isDayCompleted(day: Date): boolean {
    return !isBefore(this.lastCompletedDay, day);
  }

  completeDay(day: Date) {
    settingsServiceSingleton.setSettings({
      lastCompletedDay: day,
    });
  }

  uncompleteDay(day: Date) {
    settingsServiceSingleton.setSettings({
      lastCompletedDay: subDays(day, 1),
    });
  }

  getDayPartners(day: Date): string[] {
    return partnerService.getPartnersForDay(day);
  }
};
</script>

<style scoped>
.partner-list {
  --icon-font-size: 1.3em;
}

.day {
  padding: 0.5em 1em;
}

.day-header {
  padding-bottom: 0.25em;
  display: flex;
  font-size: var(--icon-font-size);
}

.day-header .button-slot {
  width: var(--icon-font-size);
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

.day.skipped {
  background-color: hsl(0, 0%, 80%);
}
.day.incomplete {
  background-color: hsl(0, 50%, 80%);
}
.day.complete {
  background-color: hsl(120, 50%, 80%);
}
</style>
