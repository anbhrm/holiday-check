# holiday-check

[![npm version](https://badge.fury.io/js/holiday-check.svg)](https://badge.fury.io/js/holiday-check)
![build](https://github.com/anbhrm/holiday-check/workflows/build/badge.svg)

[Google Calendar API](https://developers.google.com/calendar)を利用し、指定日付が祝休日であるかをチェックする機能を提供します。  
「定期実行で平日に回しているシェルだけど祝日は処理をスキップさせたい」等のケースで使う事を想定した作りになっています。

## 利用方法

### 共通

GCPの[コンソール](https://console.cloud.google.com/)からGoogle Calendar APIを有効化します。  
その後、API実行に使用するサービスアカウントを作成し、秘密鍵をJSONタイプで保存しておきます。

### CLI実行

CLIツールとして利用する場合、コマンドを実行するディレクトリ直下に事前の手順で作成した秘密鍵を`key.json`として配置し、下記コマンドを実行します。

```shell script
# インストールしない場合
npx holiday-check

# インストールする場合
npm install -g holiday-check
holiday-check
```

実行時の日付が平日の場合は`0`が、休日の場合は`1`が戻り値として返却されます。  
また、任意の日付をチェックする場合は第一引数に`YYYY-MM-DD`形式で渡すことでその日付がチェック対象となります。


環境変数で一部挙動の設定することが出来ます。  
環境変数の一覧は下記の通りです。

| 変数名                                                    | デフォルト値                                      | 説明                                                         |
| --------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| NODE_HOLIDAY_CHECKER_GOOGLE_CALENDAR_ID                   | `ja.japanese#holiday@group.v.calendar.google.com` | 祝日として判定するGoogleカレンダーのIDを指定します。デフォルトは日本の祝日カレンダーが設定されています。複数設定する場合は`;`区切りとします。個人のカレンダーも利用可能です。(サービスアカウントに対象カレンダーの参照権限が付与されている前提) |
| NODE_HOLIDAY_CHECKER_GOOGLE_SERVICE_ACCOUNT_KEY_JSON_PATH | `key.json`                                        | サービスアカウントの鍵ファイルのパスを設定します。フルパスも指定可能です。 |
| NODE_HOLIDAY_CHECKER_TIMEZONE                             | なし                                              | 実行日付を取得する際にタイムゾーンを固定したい場合に`Asia/Tokyo`の様にタイムゾーンを設定します。指定をしない場合は実行環境のタイムゾーンに依存します。 |
| HOLIDAY_WEEKDAYS                                          | `0;6`                                             | 休日として扱う曜日を設定します。デフォルトは土日が休日に設定されています。 |

シェルスクリプトへの組み込み例
```shell script
#!/bin/bash

export NODE_HOLIDAY_CHECKER_GOOGLE_CALENDAR_ID="ja.japanese#holiday@group.v.calendar.google.com;xxxxxxxxxx@group.calendar.google.com"
export NODE_HOLIDAY_CHECKER_GOOGLE_SERVICE_ACCOUNT_KEY_JSON_PATH="/etc/holiday-check/key.json"
holiday-check
if [ $? = 1 ]; then
  echo "祝日のため、処理を終了します"
  exit 0
fi
```

### ライブラリ利用

ライブラリとして利用する場合は`npm install holiday-check`等でインストールの上、下記の例を参考に処理を実装してください。

```typescript
// インポート
import {HolidayCheck} from "holiday-check";

...

// インスタンス化
const holidayCheck = await HolidayCheck.instance({
  // 祝日情報を取得するGoogleカレンダーのID(複数可)
  googleCalendarIdList: ['ja.japanese#holiday@group.v.calendar.google.com'],

  // Google APIを実行するためのサービスアカウント鍵ファイル(JSON形式)へのパス
  googleServiceAccountKeyJsonPath: 'key.json',

  // 土日を休日として扱う
  holidayWeekdays: [0, 6]
});

// 休日判定実行
const isHoliday = await holidayCheck.isHoliday('2021-01-01');

if (isHoliday) {
  console.info('休日です');
} else {
  console.info('平日です');
}
```
