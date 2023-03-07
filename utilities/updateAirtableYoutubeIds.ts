import * as fs from 'fs';

const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('appWcrcGmDLkeV4KM');

const OUTPUT_PATH = './utilities/output.json';
const ALLDATA_PATH = './data/allData.json';

const output_data = JSON.parse(fs.readFileSync(OUTPUT_PATH).toString());
const allData = JSON.parse(fs.readFileSync(ALLDATA_PATH).toString());
// console.log(output_data);

const toUpdate =[]
allData.forEach(r=>{
  if(r.fields['Sale Year'] !== 2023) return;
  let output_record = null;
  for (const key in output_data){
    if(output_data[key].reg === r.fields['Reg #']) {
      output_record=output_data[key];
    }
  }
  if(output_record?.ytId){
    toUpdate.push({
      id: r.id,
      fields: {
        "video_id": output_record.ytId
      }
    })
  }
  output_record = null;
})
// console.log(toUpdate);
// console.log(toUpdate.length);
// console.log(toUpdate.find(r=>r.id==='rec3LV5ZXLlzCvPw6'));
function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}
const the_chunks =[...chunks(toUpdate, 10)]
// console.log(the_chunks);
for(const c in the_chunks){
  base('Animals').update(the_chunks[c])
    .then(records=>records.forEach(r=>console.log('Updated record: ',r)))
    .catch(err=>console.error(err))
}

//   .eachPage(function page(records, fetchNextPage) {
//     records.forEach(function (record) {
//       const id = record.getId();
//       const fields = record.fields;
//       res.push({id, fields})
//     });
//     fetchNextPage();
//   }, function done(err) {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log(`Fetched ${res.length} records`);
//     writeData(res);
//   });
//
// const writeData = (data) => {
//   const fs = require('fs')
//   fs.writeFile('./data/allData.json', JSON.stringify(data), (err) => {
//     if (err) throw err;
//     console.log('Data written to file');
//   });
// }