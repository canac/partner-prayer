import { Ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { Schedule } from '../types';

type CompleteDayVars = {
  input: {
    scheduleId: string;
    completedDays: number;
  }
}

export default function useCompleteDay({ schedule }: { schedule: Ref<Schedule> }) {
  const { mutate } = useMutation<{ schedule: Schedule }, CompleteDayVars>(gql`
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
    }`
  );

  async function setLastCompletedDay(dayId: number): Promise<void> {
    schedule.value.completedDays = dayId + 1;

    const { data } = await mutate({
      input: {
        scheduleId: schedule.value._id,
        completedDays: schedule.value.completedDays,
      },
    });
    if (data?.schedule) {
      schedule.value.days = data.schedule.days;
    }
  }

  function completeDay(dayId: number): Promise<void> {
    return setLastCompletedDay(dayId);
  }

  function uncompleteDay(dayId: number): Promise<void> {
    return setLastCompletedDay(dayId - 1);
  }

  return {
    completeDay,
    uncompleteDay,
  };
}
