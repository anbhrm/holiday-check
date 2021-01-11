#!/usr/bin/env node
import { HolidayCheck } from './service/holiday-check';
import moment from 'moment-timezone';
import { Environment } from './env/environment';

let returnCode = 0;
(async (): Promise<number> => {
  let targetDate: moment.Moment;
  if (process.argv.length > 2) {
    targetDate = moment(process.argv.pop());
  } else {
    targetDate = moment();
  }
  if (Environment.TIMEZONE !== undefined) {
    targetDate.tz(Environment.TIMEZONE);
  }
  const check = await HolidayCheck.instance({
    googleCalendarIdList: Environment.GOOGLE_CALENDAR_ID_LIST,
    googleServiceAccountKeyJsonPath: Environment.GOOGLE_SERVICE_ACCOUNT_KEY_JSON_PATH,
  });
  return (await check.isHoliday(targetDate.format('YYYY-MM-DD'))) ? 1 : 0;
})()
  .then((value) => {
    returnCode = value;
  })
  .catch((reason) => {
    console.error('System error.');
    console.error(reason);
    returnCode = -1;
  })
  .finally(() => {
    process.exit(returnCode);
  });
