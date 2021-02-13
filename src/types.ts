export interface PartnerRequest {
  _id: string;
  partnerId: string;
  createdAt: string;
  request: string;
}

export interface Partner {
  _id: string;
  fullName: string;
  requests: PartnerRequest[];
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
