import DefaultDayMap from '../helpers/DefaultDayMap';
import reactive from '../helpers/reactive';
import { isWeekend } from 'date-fns';

class SkippedDays extends DefaultDayMap<boolean> {
  constructor(entries?: Iterable<[Date, boolean]>) {
    super((day: Date) => isWeekend(day), entries);
  }
}

export type Settings = {
  lastCompletedDay: Date;
  skippedDays: SkippedDays;
}

export type Partial<T> = {
  [Key in keyof T]?: T[Key];
}

export type SerializedSettings = {
  lastCompletedDay: string;
  skippedDays: {
    [key: string]: boolean;
  }
}

export default class SettingsService {
  @reactive
  private settings: Settings;

  constructor() {
    this.settings = {
      lastCompletedDay: new Date(0),
      skippedDays: new SkippedDays(),
    }
    this.loadSettings();
  }

  async loadSettings() {
    const res = await fetch('/api/settings');
    const settings = await res.json() as SerializedSettings;
    this.settings.lastCompletedDay = new Date(settings.lastCompletedDay);
    this.settings.skippedDays = new SkippedDays(Object.entries(settings.skippedDays).map(([day, isSkipped]) => [new Date(day), isSkipped]));
  }

  getSettings(): Settings {
    return this.settings;
  }

  setSettings(changedSettings: Partial<Settings>) {
    Object.assign(this.settings, changedSettings);

    let serializedSettings: Partial<SerializedSettings> = {};
    if (changedSettings.lastCompletedDay) {
      serializedSettings.lastCompletedDay = changedSettings.lastCompletedDay.toISOString();
    }
    if (changedSettings.skippedDays) {
      serializedSettings.skippedDays = Object.fromEntries([...changedSettings.skippedDays.entries()].map(([day, isSkipped]) => [day.toISOString(), isSkipped]));
    }

    fetch('/api/settings', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(serializedSettings),
    })
  }
};

export const settingsServiceSingleton = new SettingsService();
