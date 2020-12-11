<template>
  <div class="partner-list">
    <div v-for="partners in incompleteDays" :key="partners" class="day">
      <p v-for="partner in partners" :key="partner">
        {{ partner }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import {
  addDays, getDate, eachDayOfInterval, eachMonthOfInterval,
  endOfMonth, isWeekend, startOfDay, startOfMonth, subDays,
} from 'date-fns';
import PartnerService from '../services/PartnerService';
import { Vue } from 'vue-class-component';

export default class PartnerList extends Vue {
  lastCompletedDay: Date = subDays(startOfDay(new Date()), 3);

  partnerService: PartnerService = new PartnerService();

  mounted() {
    this.partnerService.loadPartners();
  }

  calculatePartnersInRange(start: Date, end: Date) {
    return eachDayOfInterval({ start, end }).map(day => this.partnerService.getPartnersForDay(day));
  }

  get incompleteDays() {
    const firstIncompleteDay = addDays(this.lastCompletedDay, 1);
    return eachDayOfInterval({ start: firstIncompleteDay, end: startOfDay(new Date()) })
      .map(day => this.partnerService.getPartnersForDay(day));
  }
};
</script>

<style scoped>
.day {
  border: 1px solid black;
  padding: 0.5em;
  margin: 0.5em;
}
</style>
