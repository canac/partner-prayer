import { Ref } from 'vue';
import { query } from '../api/api';
import { Schedule } from '../types';

export default function useToggleDaySkipped({ schedule }: { schedule: Ref<Schedule | null> }) {
  async function toggleDaySkipped(dayId: number) {
    if (!schedule.value) {
      return;
    }

    const day = schedule.value.days[dayId];
    if (!day) {
      return;
    }

    day.isSkipped = !day.isSkipped;

    const data = await query(`
      mutation SkipDay($input: SkipDayInput!) {
        schedule: skipDay(input: $input) {
          days {
            dayId
            isSkipped
            partners {
              _id
              firstName
              lastName
            }
          }
        }
      }`, {
      input: {
        scheduleId: schedule.value._id,
        dayId,
        isSkipped: day.isSkipped,
      },
    });
    schedule.value.days = data.schedule.days;
  }

  return {
    toggleDaySkipped,
  };
}
