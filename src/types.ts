export interface Partner {
  firstName: string;
  lastName: string;
}

export interface Day {
  isSkipped: boolean;
  dayId: number;
  partners: Partner[];
}

export interface Schedule {
  _id: string;
  completedDays: number;
  days: Day[];
}
