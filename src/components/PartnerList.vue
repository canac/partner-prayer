<template>
  <div class="partner-list">
    <div class="day" v-for="day in incompleteDays" :key="day.id">
      <div class="day-name">
        {{ formatDay(day.day) }}
      </div>
      <div class="partners">
        <div class="partner" v-for="partner in day.partners" :key="partner">
          {{ partner }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  addDays, getDate, eachDayOfInterval, eachMonthOfInterval,
  endOfMonth, format, isWeekend, startOfDay, startOfMonth, subDays,
} from 'date-fns';
import PartnerService from '../services/PartnerService';
import { Vue } from 'vue-class-component';

export default class PartnerList extends Vue {
  lastCompletedDay: Date = subDays(startOfDay(new Date()), 3);

  partnerService: PartnerService = new PartnerService();

  calculatePartnersInRange(start: Date, end: Date) {
    return eachDayOfInterval({ start, end }).map(day => this.partnerService.getPartnersForDay(day));
  }

  get incompleteDays() {
    const firstIncompleteDay = addDays(this.lastCompletedDay, 1);
    return eachDayOfInterval({ start: firstIncompleteDay, end: startOfDay(new Date()) })
      .map((day, index) => ({ partners: this.partnerService.getPartnersForDay(day), day, id: index }));
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
</style>
