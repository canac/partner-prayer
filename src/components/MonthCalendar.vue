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
      <slot :day="day" :index="index" v-for="(day, index) in days" :key="day.getDate()" />
    </div>
  </div>
</template>

<script lang="ts">
import { eachDayOfInterval, endOfMonth, format, getDay, startOfMonth } from 'date-fns';
import { computed, PropType, toRefs } from 'vue';

export default {
  props: {
    month: Date as PropType<Date>,
  },

  setup(props) {
    const { month } = toRefs(props);

    const dayOffset = computed((): number => getDay(startOfMonth(month.value)));
    const monthTitle = computed((): string => format(month.value, 'MMMM yyyy'));
    const days = computed((): Date[] => eachDayOfInterval({
      start: startOfMonth(month.value),
      end: endOfMonth(month.value),
    }));

    return {
      dayOffset,
      monthTitle,
      days,
    };
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
  grid-auto-rows: 1fr;
  grid-gap: 2px;
}

.date-grid :first-child {
  grid-column: var(--day-offset);
}
</style>
