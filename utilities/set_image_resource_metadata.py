"""
Used to set Image resource information in _index.md files
"""

import re
import csv
from os import listdir
from os.path import isfile, join, dirname
import yaml


def find_first_csv(directory):
    for filename in listdir(directory):
        if filename.endswith(".csv"):
            return filename
    return None


YEAR = "2024"
FILE_PATH = dirname(__file__)
BULLS_PATH = join(FILE_PATH, "..", "content", "sales", YEAR, "bulls")
IMAGES_PATH = join(BULLS_PATH, "images")
EPD_FILE = find_first_csv(BULLS_PATH) # or "2023 Bull EPD's Feb 12.xlsx - Sheet1.csv"

pattern = re.compile("\\.md|.DS_Store$")
onlyfiles = [
    {"src": f, "params": {"tag": f.split("_")[0], "lot": 0, "title": "Tag " + f.split('_')[0]}}
    for f in listdir(IMAGES_PATH)
    if isfile(join(IMAGES_PATH, f)) and not pattern.search(f)
]

resources = []

with open(join(BULLS_PATH, EPD_FILE)) as f:
    reader = csv.DictReader(f)
    data = [r for r in reader]

for f in onlyfiles:
    tempFile = f.copy()

    for row in data:
        if tempFile["params"]["tag"] in row["Name"]:
            tempFile["params"]["lot"] = int(row["Sale Order"])
            tempFile["name"] = row["Name"]
            tempFile["title"] = "Lot {}: {}".format(
                tempFile["params"]["lot"], tempFile["name"]
            ).title()
            break
    resources.append(tempFile)

output = {"resources": sorted(resources, key=lambda x: x["params"]["lot"])}

print("---\ntitle: Bulls Images")
print(yaml.dump(output))
print("---")
