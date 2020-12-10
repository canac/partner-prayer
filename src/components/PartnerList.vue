<template>
  <div class="partner-list">
    <p v-for="partner in todaysPartners" :key="partner">
      {{ partner }}
    </p>
  </div>
</template>

<script lang="ts">
import { getDate, eachDayOfInterval, endOfMonth, isWeekend, startOfMonth } from 'date-fns';
import { Vue } from 'vue-class-component';

export default class PartnerList extends Vue {
  partners: string[] = [];

  beforeCreate() {
    fetch('/api/partners').then(async (res) => {
      this.partners = await res.json();
    });
  }

  // Return a map of partners indexed by their prayer day
  get partnersByDay(): Map<number, string[]> {
    const today = new Date();

    const daysThisMonth = eachDayOfInterval({ start: startOfMonth(today), end: endOfMonth(today) });
    const numWeekdays = daysThisMonth.filter(day => !isWeekend(day)).length
    let weekdayIndex = 0;
    return new Map(
      daysThisMonth.map((day, index) => {
        let partners: string[]
        if (isWeekend(day)) {
          partners = [];
        } else {
          const startIndex = Math.floor(weekdayIndex * this.partners.length / numWeekdays);
          const endIndex = Math.floor((weekdayIndex + 1) * this.partners.length / numWeekdays);
          partners = this.partners.slice(startIndex, endIndex),
          ++weekdayIndex;
        }

        return [index + 1, partners];
      }
    ));
  }

  // Return today's partners to pray for
  get todaysPartners() {
    return this.partnersByDay.get(getDate(new Date()));
  }
};
</script>
