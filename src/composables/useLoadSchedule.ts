import { useQuery, useResult } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { dateToGqlDate } from '../api/api';
import { Schedule } from '../types';

type ScheduleResult = {
  schedule: Schedule;
}

type ScheduleVars = {
  month: string;
}

export default function useLoadSchedule(month: Date) {
  const { result } = useQuery<ScheduleResult, ScheduleVars>(gql`
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
    }
  `, {
    month: dateToGqlDate(month),
  });

  const schedule = useResult(result);

  return {
    schedule,
  };
}
