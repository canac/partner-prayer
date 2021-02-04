import { Ref } from 'vue';
import { query } from '../api/api';
import { Schedule } from '../types';

export default function useCompleteDay({ schedule }: { schedule: Ref<Schedule | null> }) {
  async function setLastCompletedDay(dayId: number) {
    if (!schedule.value) {
      return;
    }

    schedule.value.completedDays = dayId + 1;

    const data = await query(`
      mutation CompleteDay($input: CompleteDayInput!) {
        schedule: completeDay(input: $input) {
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
        completedDays: schedule.value.completedDays,
      }
    });
    schedule.value.days = data.schedule.days;
  }

  function completeDay(dayId: number): Promise<void> {
    return setLastCompletedDay(dayId);
  }

  function uncompleteDay(dayId: number) {
    return setLastCompletedDay(dayId - 1);
  }

  return {
    completeDay,
    uncompleteDay,
  };
}
