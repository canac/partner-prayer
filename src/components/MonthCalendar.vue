<template>
  <div class="month-calendar">
    <div class="month-title">
      {{ monthTitle }}
    </div>
    <div class="weekday-titles">
      <div>Su</div>
      <div>Mo</div>
      <div>Tu</div>
      <div>We</div>
      <div>Th</div>
      <div>Fr</div>
      <div>Sa</div>
    </div>
    <div class="date-grid" :style="{ '--day-offset': dayOffset + 1 }">
      <div class="date" v-for="day in days" :key="day.getDate()">
        <slot :day="day" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { eachDayOfInterval, endOfMonth, format, getDay, startOfMonth } from 'date-fns';
import { Vue, Options } from 'vue-class-component';

@Options({
  props: {
    month: Date,
  },
})
export default class MonthCalendar extends Vue {
  month: Date;

  get dayOffset(): number {
    return getDay(startOfMonth(this.month));
  }

  get monthTitle(): string {
    return format(this.month, 'MMMM yyyy')
  }

  get days(): Date[] {
    return eachDayOfInterval({
      start: startOfMonth(this.month),
      end: endOfMonth(this.month)
    });
  }
};
</script>

<style scoped>
.month-calendar {
  font-family: Arial, Helvetica, sans-serif;
}

.month-title {
  font-size: 1.5em;
  text-align: center;
  padding-bottom: 0.5em;
}

.weekday-titles {
  color: #666666;
  text-align: center;
  padding-bottom: 0.5em;
}

.weekday-titles, .date-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.date-grid :first-child {
  grid-column: var(--day-offset);
}
</style>
