import re
import csv
from os import listdir
from os.path import isfile, join
import yaml

BULLS_PATH = '../content/sales/2021/bulls/'
IMAGES_PATH = join(BULLS_PATH + '/images/')
EPD_FILE = '2021 Sale Order Bulls & Heifers.xlsx - 2021  Sale Bulls.csv'


# EPD_FILE = '2022 Sale Bulls Weaning EPD\'s.xlsx - Web Site.csv'

def find_in_list(l, target):
    for i in l:
        if i == target:
            return i
    return None


pattern = re.compile("\\.md$")
onlyfiles = [{'src': f, 'params': {'tag': f.split('_')[0], 'lot': 0}} for f in listdir(IMAGES_PATH) if
             isfile(join(IMAGES_PATH, f)) and not pattern.search(f)]

resources = []

with open(join(BULLS_PATH, EPD_FILE)) as f:
    reader = csv.DictReader(f)
    data = [r for r in reader]

for f in onlyfiles:
    tempFile = f.copy()

    for row in data:
        if tempFile['params']['tag'] in row['Name']:
            tempFile['params']['lot'] = int(row['LOT #'])
            tempFile['name'] = row['Name']
            tempFile['title'] = "Lot {}: {}".format(tempFile['params']['lot'], tempFile['name']).title()
            break
    resources.append(tempFile)

output = {'resources': sorted(resources, key=lambda x: x['params']['lot'])}

print(yaml.dump(output))
