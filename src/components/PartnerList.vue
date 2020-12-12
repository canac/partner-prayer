<template>
  <div class="partner-list">
    <div class="day" v-for="day in visibleDays" :key="day.id">
      <div class="day-name">
        {{ formatDay(day.day) }}
      </div>
      <div class="partners">
        <div
          class="partner"
          :class="{ complete: day.completed, incomplete: !day.completed }"
          v-for="partner in day.partners"
          :key="partner"
        >
          {{ partner }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  addDays, getDate, eachDayOfInterval, eachMonthOfInterval,
  endOfMonth, format, isBefore, isWeekend, startOfDay, startOfMonth, subDays,
} from 'date-fns';
import PartnerService from '../services/PartnerService';
import { Vue } from 'vue-class-component';

type DayInfo = {
  id: number;
  partners: string[];
  day: Date;
  completed: boolean;
};

export default class PartnerList extends Vue {
  lastCompletedDay: Date = subDays(startOfDay(new Date()), 3);
  numVisibleDays: number = 10;

  partnerService: PartnerService = new PartnerService();

  calculatePartnersInRange(start: Date, end: Date) {
    return eachDayOfInterval({ start, end }).map(day => this.partnerService.getPartnersForDay(day));
  }

  get visibleDays(): DayInfo[] {
    return eachDayOfInterval({
      start: subDays(startOfDay(new Date()), this.numVisibleDays),
      end: startOfDay(new Date())
    }).map((day, index): DayInfo => {
      return {
        id: index,
        partners: this.partnerService.getPartnersForDay(day),
        day,
        completed: !isBefore(this.lastCompletedDay, day),
      };
    });
  }

  formatDay(day: Date) {
    return format(day, 'EEEE, MMMM d');
  }
};
</script>

<style scoped>
.partner-list {
  font-family: Arial, Helvetica, sans-serif;
}

.day {
  border-bottom: 1px solid black;
  margin-bottom: 3em;
}

.day-name {
  color: gray;
  font-size: 1.3em;
  padding-bottom: 0.5em;
  text-align: center;
}

.partners {
  display: flex;
  flex-wrap: wrap;
}

.partner {
  width: 10em;
  height: 3em;
  margin: 0.3em;
  background-color: #dddddd;
  font-size: 1.6em;
  display: flex;
  justify-content: center;
  align-items: center;
}

.partner.incomplete {
  background-color: hsl(0, 50%, 80%);
}
.partner.complete {
  background-color: hsl(120, 50%, 80%);
}
</style>
