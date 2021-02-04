import { Ref, ref } from 'vue'
import { dateToGqlDate, query } from '../api/api';
import { Schedule } from '../types';

export default function useLoadSchedule(month: Date) {
  const schedule: Ref<Schedule | null> = ref(null);

  async function loadSchedule() {
    const data = await query(`
      query LoadSchedule($month: Date!) {
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
      month: dateToGqlDate(month),
    });
    schedule.value = data.schedule;
  }

  return {
    schedule,
    loadSchedule,
  };
}
