const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const DATA_PATH = path.join(process.cwd(),'data','allData.json');
const TOKEN_PATH = path.join(process.cwd(), "utilities", "token.json");
const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "utilities",
  "client_secret.json",
);

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Converts a string to a number or boolean if applicable.
 *
 * @param {string} value The string to convert.
 * @return {number|boolean|string} The converted value.
 */
function convertString(value) {
  if (value === "") {
    return null;
  }
  if (value === null) {
    return null;
  }
  if (!isNaN(value)) {
    return Number(value);
  }
  if (value.toUpperCase() === "TRUE") {
    return true;
  }
  if (value.toUpperCase() === "FALSE") {
    return false;
  }
  return value;
}

async function writeData(data) {
  return fs.writeFile(DATA_PATH, JSON.stringify(data));
}

/**
 * Gets cattle data from Google Sheet
 * @see https://docs.google.com/spreadsheets/d/1vRYXaP8pZRlmmoLiNMxUAJu1MxVkKjKr7JAPDB3lMY4/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function getCattleData(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1vRYXaP8pZRlmmoLiNMxUAJu1MxVkKjKr7JAPDB3lMY4",
    range: "Animals-All Data",
  });
  const data = {};
  const [headers, ...rows] = res.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }
  rows.forEach((r) => {
    const obj = {};
    r.forEach((val, idx) => {
      obj[headers[idx]] = convertString(val);
    });
    data[obj["reg"]] = obj;
  });
  return data;
}

authorize().then(getCattleData).then(writeData).catch(console.error);
