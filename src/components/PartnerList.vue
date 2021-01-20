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
        <div class="partner" v-for="partner in partnersByDay[dayId]" :key="partner._id">
          {{ formatPartner(partner) }}
        </div>
      </div>
    </MonthCalendar>
  </div>
</template>

<script lang="ts">
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';

import { startOfMonth } from 'date-fns';
import { dateToGqlDate, query } from '../api/api';
import MonthCalendar from './MonthCalendar.vue';
import { Options, Vue } from 'vue-class-component';

type Partner = {
  _id: string;
  firstName: string;
  lastName: string;
}

@Options({
  components: {
    MonthCalendar,
  },
})
export default class PartnerList extends Vue {
  activeMonth: Date = startOfMonth(new Date());
  completedDays: number = 0;
  skippedDayIds: Set<number> = new Set();
  partnersByDay: Partner[][] = [];

  async mounted() {
    const data = await query(`
      query LoadPartnerCalendar($month: Date!) {
        schedule(month: $month) {
          month
          completedDays
          skippedDays
          partnersByDay {
            firstName
            lastName
          }
        }
      }`, {
      month: dateToGqlDate(this.activeMonth),
    });
    this.completedDays = data.schedule.completedDays;
    this.partnersByDay = data.schedule.partnersByDay;
    this.skippedDayIds = new Set(data.schedule.skippedDays);
  }

  isDaySkipped(dayId: number): boolean {
    return this.skippedDayIds.has(dayId);
  }

  async toggleDaySkipped(dayId: number) {
    const isSkipped = this.isDaySkipped(dayId);
    if (isSkipped) {
      this.skippedDayIds.delete(dayId);
    } else {
      this.skippedDayIds.add(dayId);
    }

    const data = await query(`
      mutation SkipDay($input: SkipDayInput!) {
        skipDay(input: $input) {
          partnersByDay {
            firstName
            lastName
          }
        }
      }`, {
      input: {
        month: dateToGqlDate(this.activeMonth),
        dayId,
        isSkipped: !isSkipped,
      },
    });
    this.partnersByDay = data.skipDay.partnersByDay;
  }

  isDayCompleted(dayId: number): boolean {
    return dayId < this.completedDays;
  }

  private async setLastCompletedDay(dayId: number) {
    this.completedDays = dayId + 1;

    const data = await query(`
      mutation CompleteDay($input: CompleteDayInput!) {
        completeDay(input: $input) {
          partnersByDay {
            firstName
            lastName
          }
        }
      }`, {
      input: {
        month: dateToGqlDate(this.activeMonth),
        completedDays: this.completedDays,
      }
    });
    this.partnersByDay = data.completeDay.partnersByDay;
  }

  completeDay(dayId: number) {
    this.setLastCompletedDay(dayId);
  }

  uncompleteDay(dayId: number) {
    this.setLastCompletedDay(dayId - 1);
  }

  formatPartner(partner: Partner): string {
    return `${partner.firstName} ${partner.lastName}`;
  }
};
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
