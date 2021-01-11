export interface CalendarEvent {
  kind: string;
  etag: string;
  summary: string;
  updated: string;
  timeZone: string;
  accessRole: string;
  defaultReminders: string[];
  nextSyncToken: string;
  items: CalendarEventItem[];
}

interface CalendarEventItem {
  summary: string;
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  creator: Creator;
  organizer: Organizer;
  start: Date;
  end: Date;
  transparency: string;
  iCalUID: string;
  sequence: string;
  reminders: Reminder;
}

interface Creator {
  email: string;
  displayName: string;
}

interface Organizer {
  email: string;
  displayName: string;
  self: boolean;
}

interface Date {
  date: string;
}

interface Reminder {
  useDefault: boolean;
}
