import { useResult } from '@vue/apollo-composable';
import { format } from 'date-fns';
import { Ref, computed } from 'vue';
import { LoadScheduleQuery, useLoadScheduleQuery } from '../generated/graphql';
import { Schedule } from '../types';

export default function useLoadSchedule(month: Date): {
  schedule: Ref<Schedule | undefined>;
} {
  const { result } = useLoadScheduleQuery({
    month: format(month, 'yyyy-MM-dd'),
  });

  const schedule = useResult<LoadScheduleQuery, 'schedule'>(result);

  return {
    // Dynamically add the partnerId to each partner request
    schedule: computed(
      () =>
        schedule.value && {
          ...schedule.value,
          days: schedule.value.days.map((day) => ({
            ...day,
            partners: day.partners.map((partner) => ({
              ...partner,
              requests: partner.requests.map((request) => ({
                ...request,
                partnerId: partner._id,
              })),
            })),
          })),
        },
    ),
  };
}
