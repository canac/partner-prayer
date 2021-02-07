<template>
  <div class="partner-schedule">
    <MonthCalendar :month="activeMonth" v-slot:default="{ index: dayId }" v-if="schedule">
      <ScheduleDay :schedule="schedule" :dayId="dayId" />
    </MonthCalendar>
  </div>
</template>

<script lang="ts">
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';

import { startOfMonth } from 'date-fns';
import useLoadSchedule from '../composables/useLoadSchedule';
import MonthCalendar from './MonthCalendar.vue';
import ScheduleDay from './ScheduleDay.vue';
import { watch, ref, Ref } from 'vue';
import { Schedule } from '../types';

const activeMonth: Date = startOfMonth(new Date());

export default {
  components: { MonthCalendar, ScheduleDay },

  setup() {
    const { schedule } = useLoadSchedule(activeMonth);

    // Clone the readonly schedule ref to make it writable
    const writableSchedule: Ref<Schedule | undefined> = ref();
    watch(() => schedule.value, () => {
      writableSchedule.value = schedule.value ? {
        ...schedule.value,
        days: schedule.value.days.map(day => ({ ...day }))
      } : schedule.value;
    });

    return {
      activeMonth,
      schedule: writableSchedule,
    };
  },
}
</script>
