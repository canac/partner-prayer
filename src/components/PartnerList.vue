<template>
  <div class="partner-list">
    <MonthCalendar :month="activeMonth" v-slot:default="{ day, index: dayId }">
      <div class="day" :class="isDaySkipped(dayId) ? 'skipped' : (isDayCompleted(dayId) ? 'complete' : 'incomplete')">
        <div class="day-header">
          <div class="button-slot">
            <button
              class="toggle-active"
              @click="toggleDaySkipped(dayId)">
              <i class="fas fa-fw" :class="isDaySkipped(dayId) ? 'fa-eye' : 'fa-eye-slash'" />
            </button>
          </div>
          <span class="day-title">{{ day.getDate() }}</span>
          <div class="button-slot">
            <button
              class="mark-complete"
              @click="completeDay(dayId)"
              v-if="!isDayCompleted(dayId) && !isDaySkipped(dayId)">
              <i class="fas fa-fw fa-check" />
            </button>
            <button
              class="mark-incomplete"
              @click="uncompleteDay(dayId)"
              v-if="isDayCompleted(dayId) && !isDaySkipped(dayId)">
              <i class="fas fa-fw fa-trash" />
            </button>
          </div>
        </div>
        <div class="partner" v-for="partner in days[dayId]?.partners || []" :key="partner._id">
          {{ formatPartner(partner) }}
        </div>
      </div>
    </MonthCalendar>
  </div>
</template>

<script lang="ts">
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';

import { ref, onMounted, Ref } from 'vue';
import { startOfMonth } from 'date-fns';
import { dateToGqlDate, query } from '../api/api';
import MonthCalendar from './MonthCalendar.vue';

type Day = {
  isSkipped: boolean;
  dayId: number;
  partners: Partner[];
}

type Partner = {
  firstName: string;
  lastName: string;
}

const activeMonth: Date = startOfMonth(new Date());
const scheduleId: Ref<string> = ref('');
const completedDays: Ref<number> = ref(0);
const skippedDayIds: Ref<Set<number>> = ref(new Set());
const days: Ref<Day[]> = ref([]);

async function loadData() {
  const data = await query(`
    query LoadPartnerCalendar($month: Date!) {
      schedule(month: $month) {
        _id
        completedDays
        days {
          isSkipped
          dayId
          partners {
            firstName
            lastName
          }
        }
      }
    }`, {
    month: dateToGqlDate(activeMonth),
  });
  scheduleId.value = data.schedule._id;
  completedDays.value = data.schedule.completedDays;
  days.value = data.schedule.days;
  skippedDayIds.value = new Set(days.value.filter(day => day.isSkipped).map(day => day.dayId));
}

function isDaySkipped(dayId: number): boolean {
  return skippedDayIds.value.has(dayId);
}

async function toggleDaySkipped(dayId: number) {
  const isSkipped = isDaySkipped(dayId);
  if (isSkipped) {
    skippedDayIds.value.delete(dayId);
  } else {
    skippedDayIds.value.add(dayId);
  }

  const data = await query(`
    mutation SkipDay($input: SkipDayInput!) {
      schedule: skipDay(input: $input) {
        days {
          partners {
            firstName
            lastName
          }
        }
      }
    }`, {
    input: {
      scheduleId: scheduleId.value,
      dayId,
      isSkipped: !isSkipped,
    },
  });
  days.value = data.schedule.days;
}

function isDayCompleted(dayId: number): boolean {
  return dayId < completedDays.value;
}

async function setLastCompletedDay(dayId: number) {
  completedDays.value = dayId + 1;

  const data = await query(`
    mutation CompleteDay($input: CompleteDayInput!) {
      schedule: completeDay(input: $input) {
        days {
          partners {
            firstName
            lastName
          }
        }
      }
    }`, {
    input: {
      scheduleId: scheduleId.value,
      completedDays: completedDays.value,
    }
  });
  days.value = data.schedule.days;
}

function completeDay(dayId: number) {
  setLastCompletedDay(dayId);
}

function uncompleteDay(dayId: number) {
  setLastCompletedDay(dayId - 1);
}

function formatPartner(partner: Partner): string {
  return `${partner.firstName} ${partner.lastName}`;
}

export default {
  components: { MonthCalendar },

  setup() {
    onMounted(() => loadData());

    return {
      activeMonth,
      scheduleId,
      completedDays,
      skippedDayIds,
      days,
    };
  },

  methods: {
    isDaySkipped,
    toggleDaySkipped,
    isDayCompleted,
    setLastCompletedDay,
    completeDay,
    uncompleteDay,
    formatPartner,
  }
}
</script>

<style scoped>
.partner-list {
  --icon-font-size: 1.3em;
}

.day {
  padding: 0.5em 1em;
}

.day-header {
  padding-bottom: 0.25em;
  display: flex;
  font-size: var(--icon-font-size);
}

.day-header .button-slot {
  width: var(--icon-font-size);
}

.day-header button {
  border: none;
  background-color: transparent;
  font-size: inherit;
}

.day-header .mark-complete {
  color: hsl(120, 50%, 50%);
}
.day-header .mark-incomplete {
  color: hsl(0, 50%, 50%);
}
.day-header .toggle-active {
  color: #999999;
}

.day-header .day-title {
  flex: 1;
  color: #666666;
  text-align: center;
}

.partner {
  padding: 0.25em 0;
}

.day.skipped {
  background-color: hsl(0, 0%, 80%);
}
.day.incomplete {
  background-color: hsl(0, 50%, 80%);
}
.day.complete {
  background-color: hsl(120, 50%, 80%);
}
</style>
