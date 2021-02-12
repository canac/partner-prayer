import { useResult } from '@vue/apollo-composable';
import { format } from 'date-fns';
import { Ref } from 'vue';
import { LoadScheduleQuery, useLoadScheduleQuery } from '../generated/graphql';
import { Schedule } from '../types';

export default function useLoadSchedule(month: Date): {
  schedule: Ref<Schedule | undefined>,
} {
  const { result } = useLoadScheduleQuery({
    month: format(month, 'yyyy-MM-dd'),
  });

  const schedule = useResult<LoadScheduleQuery, 'schedule'>(result);

  return {
    schedule,
  };
}
