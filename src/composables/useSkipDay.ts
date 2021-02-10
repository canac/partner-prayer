import { Ref } from 'vue';
import { useSkipDayMutation } from '../generated/graphql';
import { Schedule } from '../types';

export default function useToggleDaySkipped({ schedule }: { schedule: Ref<Schedule> }): {
  toggleDaySkipped: (dayId: number) => Promise<void>,
} {
  const { mutate } = useSkipDayMutation({});

  async function toggleDaySkipped(dayId: number): Promise<void> {
    const day = schedule.value.days[dayId];
    if (!day) {
      return;
    }

    await mutate({
      input: {
        scheduleId: schedule.value._id,
        dayId,
        isSkipped: !day.isSkipped,
      },
    });
  }

  return {
    toggleDaySkipped,
  };
}
