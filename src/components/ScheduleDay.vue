<template>
  <div
    v-if="day"
    class="schedule-day"
    :class="isSkipped ? 'skipped' : isComplete ? 'complete' : 'incomplete'"
  >
    <div class="day-header">
      <div class="button-slot">
        <button class="toggle-skipped" @click="toggleDaySkipped()">
          <font-awesome-icon
            :icon="['fas', isSkipped ? 'eye' : 'eye-slash']"
            fixed-width
          />
        </button>
      </div>
      <span class="day-title">{{ day.dayId + 1 }}</span>
      <div class="button-slot">
        <button
          v-if="!isComplete && !isSkipped"
          class="mark-complete"
          @click="completeDay()"
        >
          <font-awesome-icon icon="check" fixed-width />
        </button>
        <button
          v-if="isComplete && (!isSkipped || day.partners.length > 0)"
          class="mark-incomplete"
          @click="uncompleteDay()"
        >
          <font-awesome-icon icon="trash" fixed-width />
        </button>
      </div>
    </div>
    <div v-for="partner in day.partners" :key="partner._id" class="partner">
      <router-link
        :to="{ name: 'PartnerDetail', params: { partnerId: partner._id } }"
      >
        {{ partner.fullName }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, toRefs } from 'vue';
import useCompleteDay from '../composables/useCompleteDay';
import useToggleDaySkipped from '../composables/useSkipDay';
import { Day, Schedule } from '../types';

export default defineComponent({
  props: {
    schedule: {
      type: Object as PropType<Schedule>,
      required: true,
    },
    dayId: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const { schedule, dayId } = toRefs(props);
    const day = computed(
      (): Day | null => schedule.value.days[dayId.value] || null,
    );
    const isSkipped = computed((): boolean => day.value?.isSkipped ?? false);
    const isComplete = computed(
      (): boolean => schedule.value.completedDays > (day.value?.dayId ?? 0),
    );
    const { toggleDaySkipped } = useToggleDaySkipped({ schedule });
    const { completeDay, uncompleteDay } = useCompleteDay({ schedule });

    return {
      day,
      isSkipped,
      isComplete,
      toggleDaySkipped: () => toggleDaySkipped(dayId.value),
      completeDay: () => completeDay(dayId.value),
      uncompleteDay: () => uncompleteDay(dayId.value),
    };
  },
});
</script>

<style scoped>
.schedule-day {
  padding: 0.5em 1em;
}

.day-header {
  display: flex;
  padding-bottom: 0.25em;
  font-size: var(--icon-font-size);
}

.day-header .button-slot {
  width: var(--icon-font-size);
}

.day-header button {
  padding: 0;
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
.day-header .toggle-skipped {
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

a.router-link-active {
  font-weight: bold;
}
</style>
