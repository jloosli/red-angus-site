const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('appWcrcGmDLkeV4KM');

const res = []
base('Animals').select({
    maxRecords: 1000,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    records.forEach(function (record) {
        const id = record.getId();
        const fields = record.fields;
        res.push({id, fields})
    });
    fetchNextPage();
}, function done(err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Fetched ${res.length} records`);
    writeData(res);
});

const writeData = (data) => {
    const fs = require('fs')
    fs.writeFile('../data/allData.json', JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
}