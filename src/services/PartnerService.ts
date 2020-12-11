import { ref, Ref } from 'vue';
import { eachDayOfInterval, endOfMonth, isWeekend, startOfDay, startOfMonth } from 'date-fns';

export default class PartnerService {
  private partners: string[] = [];

  // Load the partners from the network
  async loadPartners() {
    const res = await fetch('/api/partners');
    this.partners = await res.json();
  }

  // Return an array of the partners for the provided day
  getPartnersForDay(day: Date): string[] {
    return this.getPartnerDistributionForMonth(startOfMonth(day))[day.getDate() - 1];
  }

  // Calculate which partners are assigned to which day in the given month
  // Index 0 contains the partners for the first day of the month, index 1 contains the partners for the second day of
  // the month, etc.
  getPartnerDistributionForMonth(month: Date): string[][] {
    const daysInMonth: Date[] = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
    const numWeekdays: number = daysInMonth.filter(day => !isWeekend(day)).length;
    let weekdayIndex: number = 0;
    return daysInMonth.map((day: Date): string[] => {
      if (isWeekend(day)) {
        return [];
      }

      const startIndex = Math.floor(weekdayIndex * this.partners.length / numWeekdays);
      const endIndex = Math.floor((weekdayIndex + 1) * this.partners.length / numWeekdays);
      ++weekdayIndex;

      return this.partners.slice(startIndex, endIndex);
    });
  }

  static normalizeDay(day: Date): Date {
    return startOfDay(day);
  }
}
