import path from "path";
import fs from "fs";
import os from "os";
import { BigQuery } from "@google-cloud/bigquery";
import { Dayjs } from "dayjs";
import { RankingItem } from "../pages/ranking";
import { isProd } from "./env";

const CREDS_FILE = path.join(isProd ? os.tmpdir() : "", "credentials.json");
// 秘密鍵の \n を正しく解釈させるため文字列で定義する (JSON.stringifyは使えない)
const CREDS = `{
  "type": "service_account",
  "project_id": "wald-analytics",
  "private_key_id": "3ba3a076e461dcea35d22ffb17e75529d88949fd",
  "private_key": "${process.env.BIGQUERY_PRIVATE_KEY}",
  "client_email": "wald-analytics-query@wald-analytics.iam.gserviceaccount.com",
  "client_id": "103376085202159342375",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/wald-analytics-query%40wald-analytics.iam.gserviceaccount.com"
}`;

type QueryResult = {
  label: string;
  count: number;
};

function createCredentials() {
  if (!fs.existsSync(CREDS_FILE)) {
    fs.writeFileSync(CREDS_FILE, CREDS);
  }
  return CREDS_FILE;
}

function removeCredentials() {
  if (fs.existsSync(CREDS_FILE)) {
    fs.rmSync(CREDS_FILE);
  }
}

export async function query1week(endDate: Dayjs) {
  const bigquery = new BigQuery({
    projectId: "wald-analytics",
    keyFilename: createCredentials(),
  });

  const startString = endDate.add(-7, "day").format("YYYYMMDD");
  const endString = endDate.format("YYYYMMDD");
  const data = await bigquery.query(`
SELECT
  (
  SELECT
    value.string_value
  FROM
    UNNEST(event_params)
  WHERE
    key = 'event_label') AS label,
  COUNT(*) AS count
FROM
  \`wald-analytics.analytics_285297767.events_*\`
WHERE
  event_name = 'play' AND (REGEXP_EXTRACT(_TABLE_SUFFIX, r'[0-9]+') BETWEEN '${startString}' AND '${endString}')
GROUP BY
  label
ORDER BY
  count DESC
      `);

  let total = 0;
  const ranking: RankingItem[] = data[0]
    .filter((x: QueryResult) => x.label.split("@").length === 2)
    .map((x: QueryResult) => {
      const { label, count } = x;
      const [text, id] = label.substring(1, label.length - 1).split("@");
      total += count;
      return { id: id === "null" ? null : id, text, count };
    });

  removeCredentials();

  console.log("date", endString);

  return ranking.slice(0, 50);
}
