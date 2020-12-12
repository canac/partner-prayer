import reactive from '../helpers/reactive';
import Memoizer from '../helpers/Memoizer';
import { eachDayOfInterval, endOfMonth, isWeekend, startOfDay, startOfMonth } from 'date-fns';

function serializeDate(day: Date): number {
  return day.getTime();
}

export default class PartnerService {
  @reactive
  private partners: string[] = [];

  private dayMemoizer: Memoizer<Date, string[], number> = new Memoizer((day: Date) => this.calculatePartnersForDay(day), serializeDate);
  private monthMemoizer: Memoizer<Date, string[][], number> = new Memoizer((day: Date) => this.calculatePartnerDistributionForMonth(day), serializeDate);

  constructor() {
    this.loadPartners();
  }

  // Load the partners from the network
  async loadPartners() {
    const res = await fetch('/api/partners');
    this.partners = await res.json();

    // Clear the memoization cache because the partner list changed
    this.dayMemoizer.reset();
    this.monthMemoizer.reset();
  }

  // Run calculatePartnersForDay, using the memoized result if available
  getPartnersForDay(day: Date): string[] {
    return this.dayMemoizer.get(PartnerService.normalizeDay(day));
  }

  // Run getPartnerDistributionForMonth, using the memoized result if available
  getPartnerDistributionForMonth(day: Date): string[][] {
    return this.monthMemoizer.get(PartnerService.normalizeDay(day));
  }

  // Return an array of the partners for the provided day
  private calculatePartnersForDay(day: Date): string[] {
    return this.getPartnerDistributionForMonth(startOfMonth(day))[day.getDate() - 1];
  }

  // Calculate which partners are assigned to which day in the given month
  // Index 0 contains the partners for the first day of the month, index 1 contains the partners for the second day of
  // the month, etc.
  private calculatePartnerDistributionForMonth(month: Date): string[][] {
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
