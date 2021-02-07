import { Ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { Schedule } from '../types';

type SkipDayVars = {
  input: {
    scheduleId: string;
    dayId: number;
    isSkipped: boolean;
  }
}

export default function useToggleDaySkipped({ schedule }: { schedule: Ref<Schedule> }) {
  const { mutate } = useMutation<{ schedule: Schedule }, SkipDayVars>(gql`
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
    }`
  );

  async function toggleDaySkipped(dayId: number): Promise<void> {
    const day = schedule.value.days[dayId];
    if (!day) {
      return;
    }

    day.isSkipped = !day.isSkipped;

    const { data } = await mutate({
      input: {
        scheduleId: schedule.value._id,
        dayId,
        isSkipped: day.isSkipped,
      },
    });
    if (data?.schedule) {
      schedule.value.days = data.schedule.days;
    }
  }

  return {
    toggleDaySkipped,
  };
}
