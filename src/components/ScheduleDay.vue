<template>
  <div class="schedule-day" :class="isSkipped ? 'skipped' : (isComplete ? 'complete' : 'incomplete')">
    <div class="day-header">
      <div class="button-slot">
        <button
          class="toggle-active"
          @click="toggleDaySkipped()">
          <i class="fas fa-fw" :class="isSkipped ? 'fa-eye' : 'fa-eye-slash'" />
        </button>
      </div>
      <span class="day-title">{{ day.dayId + 1 }}</span>
      <div class="button-slot">
        <button
          class="mark-complete"
          @click="completeDay()"
          v-if="!isComplete && !isSkipped">
          <i class="fas fa-fw fa-check" />
        </button>
        <button
          class="mark-incomplete"
          @click="uncompleteDay()"
          v-if="isComplete && !isSkipped">
          <i class="fas fa-fw fa-trash" />
        </button>
      </div>
    </div>
    <div class="partner" v-for="partner in day.partners" :key="partner._id">
      {{ formatPartner(partner) }}
    </div>
  </div>
</template>

<script lang="ts">
import { Day, Partner, Schedule } from '../types';
import { computed, toRefs } from 'vue';
import useToggleDaySkipped from '../composables/useSkipDay';
import useCompleteDay from '../composables/useCompleteDay';

export default {
  props: {
    schedule: Object,
    dayId: Number,
  },

  setup(props: { schedule: Schedule, dayId: number }) {
    const { schedule, dayId } = toRefs(props);
    const day = computed((): Day | null => schedule.value.days[dayId.value] || null);
    const isSkipped = computed((): boolean => day.value.isSkipped);
    const isComplete = computed((): boolean => day.value.dayId < schedule.value.completedDays);
    const { toggleDaySkipped } = useToggleDaySkipped({ schedule })
    const { completeDay, uncompleteDay } = useCompleteDay({ schedule })

    return {
      day,
      isSkipped,
      isComplete,
      toggleDaySkipped() { toggleDaySkipped(dayId.value) },
      completeDay() { completeDay(dayId.value) },
      uncompleteDay() { uncompleteDay(dayId.value) },
    };
  },

  methods: {
    formatPartner(partner: Partner): string {
      return `${partner.firstName} ${partner.lastName}`;
    },
  }
};
</script>

<style scoped>
.schedule-day {
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

.schedule-day.skipped {
  background-color: hsl(0, 0%, 80%);
}
.schedule-day.incomplete {
  background-color: hsl(0, 50%, 80%);
}
.schedule-day.complete {
  background-color: hsl(120, 50%, 80%);
}

.schedule-day {
  --icon-font-size: 1.3em;
}
</style>
