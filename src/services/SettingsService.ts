import reactive from '../helpers/reactive';

export type Settings = {
  lastCompletedDay: Date;
}

export type PartialSettings = {
  [Key in keyof Settings]?: Settings[Key];
}

export type SerializedSettings = {
  lastCompletedDay: string;
}

export default class SettingsService {
  @reactive
  private settings: Settings;

  constructor() {
    this.settings = {
      lastCompletedDay: new Date(0),
    }
    this.loadSettings();
  }

  async loadSettings() {
    const res = await fetch('/api/settings');
    const settings = await res.json() as SerializedSettings;
    this.settings.lastCompletedDay = new Date(settings.lastCompletedDay);
  }

  getSettings(): Settings {
    return this.settings;
  }

  setSettings(changedSettings: PartialSettings) {
    Object.assign(this.settings, changedSettings);

    fetch('/api/settings', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(changedSettings),
    })
  }
};
