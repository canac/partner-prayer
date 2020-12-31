import reactive from '../helpers/reactive';
import Memoizer from '../helpers/Memoizer';
import { settingsServiceSingleton } from './SettingsService';
import { eachDayOfInterval, endOfMonth, isSameMonth, isWeekend, startOfDay, startOfMonth } from 'date-fns';

function serializeDate(day: Date): number {
  return day.getTime();
}

function reviveDate(time: number): Date {
  return new Date(time);
}

export default class PartnerService {
  @reactive
  private partners: string[] = [];

  private dayMemoizer: Memoizer<Date, string[], number>;
  private monthMemoizer: Memoizer<Date, string[][], number>;

  constructor() {
    this.loadPartners();

    this.dayMemoizer = new Memoizer((day: Date) => this.calculatePartnersForDay(day), serializeDate, reviveDate);
    this.monthMemoizer = new Memoizer((day: Date) => this.calculatePartnerDistributionForMonth(day), serializeDate, reviveDate);
  }

  // Load the partners from the network
  async loadPartners() {
    const res = await fetch('/api/partners');
    this.partners = await res.json();

    // Clear the memoization cache because the partner list changed
    this.dayMemoizer.evictAll();
    this.monthMemoizer.evictAll();
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
    return settingsServiceSingleton.getSettings().skippedDays.get(day);
  }

  // Set the skipped status of the specified date
  setDaySkipped(day: Date, isSkipped: boolean) {
    const skippedDays = settingsServiceSingleton.getSettings().skippedDays;
    skippedDays.set(day, isSkipped);
    settingsServiceSingleton.setSettings({ skippedDays });

    // Recalculate all days and months that are in the month that was updated
    const predicate = (cachedDay: Date) => isSameMonth(day, cachedDay);
    this.dayMemoizer.evictSome(predicate);
    this.monthMemoizer.evictSome(predicate);
  }

  static normalizeDay(day: Date): Date {
    return startOfDay(day);
  }
}
