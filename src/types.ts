export interface Partner {
  _id: string;
  fullName: string;
}

export interface Day {
  _id: string;
  dayId: number;
  isSkipped: boolean;
  partners: Partner[];
}

export interface Schedule {
  _id: string;
  completedDays: number;
  days: Day[];
}
