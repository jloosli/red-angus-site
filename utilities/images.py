import re
import csv
from os import listdir
from os.path import isfile, join
import yaml

BULLS_PATH = '../content/sales/2021/bulls/'
IMAGES_PATH = join(BULLS_PATH + '/images/')
pattern = re.compile("\\.md$")
onlyfiles = [{'src': f, 'tag': f.split('_')[0]} for f in listdir(IMAGES_PATH) if
             isfile(join(IMAGES_PATH, f)) and not pattern.search(f)]

resources = []

with open(join(BULLS_PATH, '2021 Sale Order Bulls & Heifers.xlsx - 2021  Sale Bulls.csv')) as f:
    reader = csv.DictReader(f)
    data = [r for r in reader]

for f in onlyfiles:
    temp = f.copy()

    for row in data:
        if temp['tag'] in row['Name']:
            # temp['epd'] = row.copy()
            temp['lot'] = row['LOT #']
            temp['title'] = "Lot {}: {}".format(row['LOT #'], row['Name'])
    resources.append(temp)

print(yaml.dump(resources))
