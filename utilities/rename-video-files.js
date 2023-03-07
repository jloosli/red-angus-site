const {join, extname, basename} = require('path');
const {createReadStream, readdirSync, renameSync} = require('fs');
const {homedir} = require('os');
const {parse} = require('csv-parse');

const home = homedir()
// const pathToOldFolder = join(home, 'Downloads', 'toUpload');
const pathToOldFolder = join('toUpload');

const saleYear = '2023';
const dataFile = '2023 Bull EPD\'s Feb 12.xlsx - Sheet1.csv';
const pathToSaleData = join('.', 'content', 'sales', saleYear, 'bulls', dataFile);

function getLotAndTagData(dataPath) {
    return new Promise((resolve, reject) => {
        let fields = [], lotIdx, idIdx;
        const tagLotMap = new Map();
        createReadStream(dataPath)
            .pipe(parse({delimiter: ","}))
            .on('data', (row) => {
                if (fields.length === 0) {
                    fields = row;
                    lotIdx = fields.indexOf('Lot #');
                    idIdx = fields.indexOf('ID');
                    console.log(fields);
                } else {
                    tagLotMap.set(row[idIdx], row[lotIdx]);
                }
            })
            .on('end', () => {
                resolve(tagLotMap);
            }).on('error', (err => reject(err)));
    });
}

function renameFiles({tagLotMap}) {
    for (const oldFile of readdirSync(pathToOldFolder)) {
        const extension = extname(oldFile);
        const name = basename(oldFile, extension);
        if (extension === '.mp4' && tagLotMap.has(name)) {
            const newName = `Lot ${tagLotMap.get(name)} Tag ${name}`;
            console.log(name,newName + extension)
            renameSync(join(pathToOldFolder, oldFile), join(pathToOldFolder, newName + extension));
        }
    }
}

getLotAndTagData(pathToSaleData)
    .then(tagLotMap => {
        renameFiles({tagLotMap});
    });
