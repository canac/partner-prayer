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

import { onMounted } from 'vue';
import { startOfMonth } from 'date-fns';
import useLoadSchedule from '../composables/useLoadSchedule';
import MonthCalendar from './MonthCalendar.vue';
import ScheduleDay from './ScheduleDay.vue';

const activeMonth: Date = startOfMonth(new Date());

export default {
  components: { MonthCalendar, ScheduleDay },

  setup() {
    const { schedule, loadSchedule } = useLoadSchedule(activeMonth);

    onMounted(() => loadSchedule());

    return {
      activeMonth,
      schedule,
    };
  },
}
</script>
