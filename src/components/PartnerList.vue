<template>
  <div class="partner-list">
    <MonthCalendar :month="activeMonth" v-slot:default="{ day }">
      <div class="day" :class="isDaySkipped(day) ? 'skipped' : (isDayCompleted(day) ? 'complete' : 'incomplete')">
        <div class="day-header">
          <div class="button-slot">
            <button
              class="toggle-active"
              @click="toggleDaySkipped(day)">
              <i class="fas fa-fw" :class="isDaySkipped(day) ? 'fa-eye' : 'fa-eye-slash'" />
            </button>
          </div>
          <span class="day-title">{{ day.getDate() }}</span>
          <div class="button-slot">
            <button
              class="mark-complete"
              @click="completeDay(day)"
              v-if="!isDayCompleted(day) && !isDaySkipped(day)">
              <i class="fas fa-fw fa-check" />
            </button>
            <button
              class="mark-incomplete"
              @click="uncompleteDay(day)"
              v-if="isDayCompleted(day) && !isDaySkipped(day)">
              <i class="fas fa-fw fa-trash" />
            </button>
          </div>
        </div>
        <div class="partner" v-for="partner in partnersByDay[day.getDate() - 1]" :key="partner._id">
          {{ formatPartner(partner) }}
        </div>
      </div>
    </MonthCalendar>
  </div>
</template>

<script lang="ts">
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';

import { addMinutes, format, isBefore, startOfDay, startOfMonth, subDays } from 'date-fns';
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
  lastCompletedDay: Date = new Date(0);
  skippedDayIds: Set<number> = new Set();
  partnersByDay: Partner[][] = [];

  async mounted() {
    const query = `
      query LoadPartnerCalendar($month: Date!) {
        lastCompletedDay
        schedule(month: $month) {
          month
          skippedDayIds
          partnersByDay {
            firstName
            lastName
          }
        }
      }`;
    const res = await fetch(import.meta.env.SNOWPACK_PUBLIC_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          month: format(this.activeMonth, 'yyyy-MM-dd'),
        },
      }),
    });
    const { data } = await res.json();
    this.lastCompletedDay = new Date(data.lastCompletedDay);
    // Convert the date from UTC on the server to local time
    this.lastCompletedDay = addMinutes(this.lastCompletedDay, this.lastCompletedDay.getTimezoneOffset());
    this.partnersByDay = data.schedule.partnersByDay;
    this.skippedDayIds = new Set(data.schedule.skippedDayIds);
  }

  isDaySkipped(day: Date): boolean {
    return this.skippedDayIds.has(day.getDate() - 1);
  }

  async toggleDaySkipped(day: Date) {
    const isSkipped = this.isDaySkipped(day);
    if (isSkipped) {
      this.skippedDayIds.delete(day.getDate() - 1);
    } else {
      this.skippedDayIds.add(day.getDate() - 1);
    }

    const query = `
      mutation SkipDay($day: Date!, $isSkipped: Boolean!) {
        skipDay(day: $day, isSkipped: $isSkipped) {
          partnersByDay {
            firstName
            lastName
          }
        }
      }`;
    const res = await fetch(import.meta.env.SNOWPACK_PUBLIC_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          day: format(day, 'yyyy-MM-dd'),
          isSkipped: !isSkipped,
        },
      }),
    });
    const { data } = await res.json();
    this.partnersByDay = data.skipDay.partnersByDay;
  }

  isDayCompleted(day: Date): boolean {
    return !isBefore(this.lastCompletedDay, day);
  }

  private setLastCompletedDay(day: Date) {
    this.lastCompletedDay = day;

    const query = `
      mutation CompleteDay($day: Date!) {
        completeDay(day: $day)
      }`;
    fetch(import.meta.env.SNOWPACK_PUBLIC_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          day: format(this.lastCompletedDay, 'yyyy-MM-dd'),
        },
      }),
    });
  }

  completeDay(day: Date) {
    this.setLastCompletedDay(day);
  }

  uncompleteDay(day: Date) {
    this.setLastCompletedDay(subDays(day, 1));
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
