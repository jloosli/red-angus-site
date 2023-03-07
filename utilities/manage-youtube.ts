// Adapted from https://developers.google.com/youtube/v3/quickstart/nodejs

import * as  fs from 'fs';
import {OAuth2Client} from 'google-auth-library';
import * as readline from 'readline';
import {google, youtube_v3} from 'googleapis';
import Schema$PlaylistItem = youtube_v3.Schema$PlaylistItem;

const OAuth2 = google.auth.OAuth2;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
const SCOPES = ['https://www.googleapis.com/auth/youtube'];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';
const CLIENT_SECRET_PATH = './utilities/client_secret.json';
const ALLDATA_PATH = './data/allData.json';
const SALE_YEAR = 2023;
const OUTPUT_PATH = './utilities/output.json';

const main = async () => {
  try {
    const auth = await getAuth();
    const uploads_id = await getUploadsID(auth);
    console.log('Uploads_id: ', uploads_id);
    const uploadedVideos = await getVideosFromPlaylist(auth, uploads_id);
    const thisYear = uploadedVideos.filter(v => v.snippet.publishedAt > '2022');
    const allData = await getAllData();
    const thisYearAllData = allData.filter(d => {
      console.log(d.fields['Sale Year'], SALE_YEAR);
      return +d.fields['Sale Year'] === SALE_YEAR;
    });
    console.log('this year all data', thisYearAllData);

    const informationPerLot = {};
    thisYearAllData.forEach(d => {
      if (d.fields['Lot #']) {
        const yt = thisYear.find(v => +v.snippet.title.split(' ')[1] === +d.fields['Lot #']);
        const consolidated = {
          atId: d.id,
          lot: d.fields['Lot #'],
          tag: d.fields['Animal ID'],
          reg: d.fields['Reg #'],
          name: d.fields.Name,
          'video_id': d.fields['video_id'],
          saleYear: d.fields['Sale Year'],
          ytTitle: yt?.snippet?.title,
          ytId: yt?.snippet?.resourceId.videoId,
          upload: yt?.snippet.publishedAt,
        };
        informationPerLot[d.fields['Lot #']] = consolidated;
        // {
        //   airtable: d.fields,
        //   yt,
        //   consolidated,
        // };
      }
    });
    console.log(informationPerLot);
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(informationPerLot));
    // console.log(`Found ${thisYear.length}/${uploadedVideos.length} this year. `);
    // console.log('ID: Name');
    // thisYear.forEach(v => console.log(`${v.contentDetails.videoId}: ${v.snippet.title}`));
  } catch (e) {
    console.error(e);
  }
};
main();

const updateYouTubeTitles = async (auth, idsAndTitles) => {
  const service = google.youtube('v3');
  const promises = [];
  for (const id in idsAndTitles) {
    promises.push(service.videos.update({
      auth, part: 'snippet,contentDetails'.split(','),
      requestBody: {
        id,
        snippet: {
          title: idsAndTitles[id].title,
          categoryId: '15',
        },
        status: {
          privacyStatus: 'public',
        },
      },
    }));
    console.log(`Updated ${id}`);
  }
  return Promise.all(promises);

};

async function videoUpdates() {
  const auth = await getAuth();
  const data = JSON.parse(fs.readFileSync(OUTPUT_PATH).toString());
  const idsAndTitles = {};
  for (const d in data) {
    const {ytId, lot, name} = data[d];
    if(ytId){
      idsAndTitles[ytId] = {title: `Lot ${lot}: ${name}`};
    }
  }
  console.log(idsAndTitles);
  await updateYouTubeTitles(auth, idsAndTitles);
}

// videoUpdates();

function getAuth() {
  return new Promise((resolve, reject) => {
    fs.readFile(CLIENT_SECRET_PATH, function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        reject(err);
      }
      // Authorize a client with the loaded credentials
      const auth = authorizeNoCB(JSON.parse(content.toString()));
      resolve(auth);
    });
  });
}

function getAllData(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(ALLDATA_PATH, (err, content) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(content.toString()));
    });
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorizeNoCB(credentials): Promise<OAuth2Client> {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  return new Promise((resolve, reject) => {
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
      if (err) {
        resolve(getNewTokenNoCB(oauth2Client));
      } else {
        oauth2Client.credentials = JSON.parse(token.toString());
        resolve(oauth2Client);
      }
    });

  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewTokenNoCB(oauth2Client: OAuth2Client): Promise<OAuth2Client> {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve, reject) => {
    rl.question('Enter the code from that page here: ', function (code) {
      rl.close();
      oauth2Client.getToken(code, function (err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          reject(err);
        }
        oauth2Client.credentials = token;
        storeToken(token);
        resolve(oauth2Client);
      });
    });
  });

}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth) {
  const service = google.youtube('v3');
  service.channels.list({
    auth: auth,
    part: 'snippet,contentDetails,statistics'.split(','),
    forUsername: 'jloosli',
  }, function (err, response) {
    if (err) {
      console.log('[getChannel] The API returned an error: ' + err);
      return;
    }
    const channels = response.data.items;
    if (channels.length == 0) {
      console.log('No channel found.');
    } else {
      console.log(JSON.stringify(channels, null, 2));
      for (const channel of channels) {
        console.log(JSON.stringify(channel, null, 2));

        console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
          'it has %s views.',
          channel.id,
          channel.snippet?.title,
          channel.statistics?.viewCount);
      }

    }
  });
}

function getPlaylists(auth) {
  const service = google.youtube('v3');
  service.playlists.list({
    auth, part: 'snippet,contentDetails'.split(','),
    mine: true,
  }, (err, res) => {
    if (err) {
      console.error('The API returned an error: ' + err);
      return;
    }
    const playlists = res.data.items;
    if (playlists.length === 0) {
      console.log('No playlists found');
    } else {
      for (const playlist of playlists) {
        console.log(playlist);
      }
    }
  });
}

function getUploadsID(auth) {
  const service = google.youtube('v3');
  return new Promise((resolve, reject) => {
    service.channels.list({
      auth: auth,
      part: 'snippet,contentDetails'.split(','),
      mine: true,
    }, function (err, response) {
      if (err) {
        reject(err);
      }
      const channels = response.data.items;
      if (channels.length == 0) {
        console.log('No channel found.');
      } else {
        const uploadsPlaylist = channels[0].contentDetails.relatedPlaylists.uploads;
        resolve(uploadsPlaylist);
      }
    });
  });

}

function getVideosFromPlaylist(auth, playlistId): Promise<Schema$PlaylistItem[]> {
  const service = google.youtube('v3');
  return new Promise(async (resolve, reject) => {
    let results = [];
    let pageToken;
    do {
      const res = await service.playlistItems.list({
        auth,
        part: 'snippet,contentDetails'.split(','),
        playlistId,
        maxResults: 50,
        pageToken,
      });
      results = results.concat(res.data.items);
      pageToken = res.data.nextPageToken;
    } while (pageToken);
    resolve(results);
  });
}