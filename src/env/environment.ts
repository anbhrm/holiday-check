export class Environment {
  public static readonly GOOGLE_CALENDAR_ID_LIST = (process.env.NODE_HOLIDAY_CHECKER_GOOGLE_CALENDAR_ID || 'ja.japanese#holiday@group.v.calendar.google.com').split(';');
  public static readonly GOOGLE_SERVICE_ACCOUNT_KEY_JSON_PATH = process.env.NODE_HOLIDAY_CHECKER_GOOGLE_SERVICE_ACCOUNT_KEY_JSON_PATH || 'key.json';
  public static readonly TIMEZONE = process.env.NODE_HOLIDAY_CHECKER_TIMEZONE || undefined;
  public static readonly HOLIDAY_WEEKDAYS = (process.env.NODE_HOLIDAY_CHECKER_HOLIDAY_DOW || '0;6').split(';').map((v) => parseInt(v));
}
