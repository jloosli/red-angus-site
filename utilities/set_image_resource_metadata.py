"""
Used to set Image resource information in _index.md files
"""

import re
import csv
from os import listdir
from os.path import isfile, join, dirname
import yaml

FILE_PATH = dirname(__file__)
BULLS_PATH = join(FILE_PATH, '..','content','sales','2023','bulls')
IMAGES_PATH = join(BULLS_PATH , 'images')
EPD_FILE = '2023 Bull EPD\'s Feb 12.xlsx - Sheet1.csv'

def find_in_list(l, target):
    for i in l:
        if i == target:
            return i
    return None


pattern = re.compile("\\.md|.DS_Store$")
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
            tempFile['params']['lot'] = int(row['Lot #'])
            tempFile['name'] = row['Name']
            tempFile['title'] = "Lot {}: {}".format(tempFile['params']['lot'], tempFile['name']).title()
            break
    resources.append(tempFile)

output = {'resources': sorted(resources, key=lambda x: x['params']['lot'])}

print(yaml.dump(output))
