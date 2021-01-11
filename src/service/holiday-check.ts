import { google } from 'googleapis';
import * as rm from 'typed-rest-client/RestClient';
import { CalendarEvent } from '../model/calendar-event';
import moment from 'moment-timezone';
import { Environment } from '../env/environment';

export class HolidayCheck {
  private accessToken = '';
  private calendarIdList: string[] = [];

  private constructor() {
    // block
  }

  private async init(option: HolidayCheckerOption) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.accessToken = await this.getGoogleAccessToken(option.googleServiceAccountKeyJsonPath);
    this.calendarIdList = option.googleCalendarIdList;
  }

  public static async instance(option: HolidayCheckerOption): Promise<HolidayCheck> {
    const instance = new HolidayCheck();
    await instance.init(option);

    return instance;
  }

  public isHoliday = async (currentDate: string): Promise<boolean> => {
    const restClient: rm.RestClient = new rm.RestClient('', 'https://www.googleapis.com');
    let holidayName: string | undefined;

    if (Environment.HOLIDAY_WEEKDAYS.includes(moment(currentDate).weekday())) {
      holidayName = 'Weekday';
    } else {
      for (const calendarId of this.calendarIdList) {
        const calendarEvent = await restClient.get<CalendarEvent>(`/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
          additionalHeaders: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          queryParameters: {
            params: {
              timeMin: `${currentDate}T00:00:00.000Z`,
              timeMax: `${currentDate}T23:59:59.999Z`,
            },
          },
        });
        if (calendarEvent.result !== null && calendarEvent.result !== undefined && calendarEvent.result.items.length > 0) {
          const item = calendarEvent.result.items.pop();
          if (item) {
            holidayName = item.summary;
          }
        }
      }
    }

    if (holidayName !== undefined) {
      console.info(`${currentDate} is a holiday(${holidayName}). `);
      return true;
    } else {
      console.info(`${currentDate} is not a holiday.`);
      return false;
    }
  };

  private getGoogleAccessToken = async (googleServiceAccountKeyJsonPath: string): Promise<string> => {
    const auth = new google.auth.GoogleAuth({
      keyFile: googleServiceAccountKeyJsonPath,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const accessToken = await auth.getAccessToken();
    if (accessToken === null || accessToken === undefined) {
      throw Error('Failed to get an access token.');
    } else {
      return accessToken;
    }
  };
}

interface HolidayCheckerOption {
  googleCalendarIdList: string[];
  googleServiceAccountKeyJsonPath: string;
}
