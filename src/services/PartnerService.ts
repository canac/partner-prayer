import reactive from '../helpers/reactive';
import DaySet from '../helpers/DaySet';
import Memoizer from '../helpers/Memoizer';
import { eachDayOfInterval, endOfMonth, startOfDay, startOfMonth } from 'date-fns';

function serializeDate(day: Date): number {
  return day.getTime();
}

export default class PartnerService {
  @reactive
  private partners: string[] = [];

  @reactive
  private skippedDays: DaySet = new DaySet();

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
    const numDays: number = daysInMonth.filter(day => !this.isDaySkipped(day)).length;
    let dayIndex: number = 0;
    return daysInMonth.map((day: Date): string[] => {
      if (this.isDaySkipped(day)) {
        return [];
      }

      const startIndex = Math.floor(dayIndex * this.partners.length / numDays);
      const endIndex = Math.floor((dayIndex + 1) * this.partners.length / numDays);
      ++dayIndex;

      return this.partners.slice(startIndex, endIndex);
    });
  }

  // Determine whether this day should be allocated partners or whether it should be skipped
  isDaySkipped(day: Date): boolean {
    return this.skippedDays.has(day);
  }

  // Set the skipped status of the specified date
  setDaySkipped(day: Date, isSkipped: boolean) {
    if (isSkipped) {
      this.skippedDays.add(day);
    } else {
      this.skippedDays.delete(day);
    }

    // The partner distributions must be recalculated now
    this.dayMemoizer.reset();
    this.monthMemoizer.reset();
  }

  static normalizeDay(day: Date): Date {
    return startOfDay(day);
  }
}
