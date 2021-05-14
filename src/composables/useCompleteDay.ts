import { Ref } from 'vue';
import { useCompleteDayMutation } from '../generated/graphql';
import { Schedule } from '../types';

export default function useCompleteDay({
  schedule,
}: {
  schedule: Ref<Schedule>;
}): {
  completeDay: (dayId: number) => Promise<void>;
  uncompleteDay: (dayId: number) => Promise<void>;
} {
  const { mutate } = useCompleteDayMutation({});

  async function setLastCompletedDay(dayId: number): Promise<void> {
    await mutate({
      input: {
        scheduleId: schedule.value._id,
        completedDays: dayId + 1,
      },
    });
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
