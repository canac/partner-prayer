export type Schedule = {
  _id: string;
  completedDays: number;
  days: Day[];
}

export type Day = {
  isSkipped: boolean;
  dayId: number;
  partners: Partner[];
}

export type Partner = {
  firstName: string;
  lastName: string;
}
