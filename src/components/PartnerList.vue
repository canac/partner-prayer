<template>
  <div class="partner-list">
    <MonthCalendar :month="activeMonth" v-slot:default="{ day }">
      <div class="day" :class="isDayCompleted(day) ? 'complete' : 'incomplete'">
        <button
          @click="completeDay(day)"
          v-if="!isDayCompleted(day) && getDayPartners(day).length > 0">
          Complete
        </button>
        <div class="partner" v-for="partner in getDayPartners(day)" :key="partner">
          {{ partner }}
        </div>
      </div>
    </MonthCalendar>
  </div>
</template>

<script lang="ts">
import { isBefore, startOfDay, subDays } from 'date-fns';
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

  getDayPartners(day: Date): string[] {
    return partnerService.getPartnersForDay(day);
  }

  completeDay(day: Date) {
    this.lastCompletedDay = day;
  }
};
</script>

<style scoped>
.day {
  padding: 1em;
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
