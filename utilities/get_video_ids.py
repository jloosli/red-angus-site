import csv

import requests
from bs4 import BeautifulSoup

URL = 'https://www.billpelton.com/sale-lot-listing/lot/'
START_LOT_ID = 35074  # '?lot_id=35074'

next_id = START_LOT_ID
res = []
while next_id:
    page = requests.get(f'{URL}?lot_id={next_id}', verify=False)
    soup = BeautifulSoup(page.text, features="html.parser")
    iframe = soup.find('iframe')
    # print(iframe)
    # print(iframe['src'])
    video_id = iframe['src'].split('/')[4] if iframe else None
    # print(video_id)

    reg = soup.find(id='herdsire-sale-data').find('table').find('tbody').find('tr').findAll('td')[3].text.strip()
    lot = soup.find(id='herdsire-sale-data').find('table').find('tbody').find('tr').findAll('td')[0].text.strip()

    anchors = soup.findAll("a", href=True)
    next_anchor_link = [x for x in anchors if "Next" in x.text][0]['href']
    next_id = next_anchor_link.split('=')[1] if next_anchor_link != '#' else ''
    # print(next_id)

    print(f'Lot: {lot}, Reg: {reg}, video: {video_id}, Next ID: {next_id}')
    res.append({"Reg #": reg, "vimeo_id": video_id})
    print(res[0].keys())

if len(res):
    print(f'Writing {len(res)} records to file')
    with open('videos.csv', 'w') as f:
        writer = csv.DictWriter(f, fieldnames=res[0].keys())
        writer.writeheader()
        writer.writerows(res)
