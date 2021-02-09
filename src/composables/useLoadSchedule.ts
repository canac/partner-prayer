import { useResult } from '@vue/apollo-composable';
import { dateToGqlDate } from '../api/api';
import { LoadScheduleQuery, useLoadScheduleQuery } from '../generated/graphql';

export default function useLoadSchedule(month: Date) {
  const { result } = useLoadScheduleQuery( {
    month: dateToGqlDate(month),
  });

  const schedule = useResult<LoadScheduleQuery, 'schedule'>(result);

  return {
    schedule,
  };
}
