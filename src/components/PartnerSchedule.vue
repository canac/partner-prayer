<template>
  <div class="partner-schedule">
    <MonthCalendar
      v-if="schedule"
      v-slot="{ index: dayId }"
      :month="activeMonth"
    >
      <ScheduleDay :schedule="schedule" :day-id="dayId" />
    </MonthCalendar>
    <router-view />
  </div>
</template>

<script lang="ts">
import { startOfMonth } from 'date-fns';
import { defineComponent } from 'vue';
import useLoadSchedule from '../composables/useLoadSchedule';
import MonthCalendar from './MonthCalendar.vue';
import ScheduleDay from './ScheduleDay.vue';

const activeMonth: Date = startOfMonth(new Date());

export default defineComponent({
  components: { MonthCalendar, ScheduleDay },

  setup() {
    const { schedule } = useLoadSchedule(activeMonth);

    return {
      activeMonth,
      schedule,
    };
  },
});
</script>

<style scoped>
.partner-schedule {
  display: flex;
}

.partner-detail {
  min-width: 20vw;
  padding-left: 1em;
}
</style>
