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
    <div
      class="date-grid"
      :style="{ '--day-offset': dayOffset + 1 }"
    >
      <slot
        v-for="(day, index) in days"
        :key="day.getDate()"
        :day="day"
        :index="index"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  eachDayOfInterval, endOfMonth, format, getDay, startOfMonth,
} from 'date-fns';
import {
  PropType, computed, defineComponent, toRefs,
} from 'vue';

export default defineComponent({
  props: {
    month: {
      type: Date as PropType<Date>,
      required: true,
    },
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
  },
});
</script>

<style scoped>
.month-calendar {
  font-family: Arial, Helvetica, sans-serif;
}

.month-title {
  padding-bottom: 0.5em;
  font-size: 1.5em;
  text-align: center;
}

.weekday-titles {
  padding-bottom: 0.5em;
  color: #666666;
  text-align: center;
}

.weekday-titles, .date-grid {
  display: grid;
  grid-auto-rows: 1fr;
  grid-gap: 2px;
  grid-template-columns: repeat(7, 1fr);
}

.date-grid :first-child {
  grid-column: var(--day-offset);
}
</style>
