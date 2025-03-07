# Loosli Red Angus Website

![Hugo](https://github.com/jloosli/red-angus-site/workflows/Hugo/badge.svg)

## Website Development

`docker compose up server -d`
`zsh: dcupd server`

## New Sale Year Steps

1. Update hugo version in [.env](.env)
1. Update message on [main sale page](content/_index.md)
1. Create a new sale year by duplicating folder structure in [sales](content/sales)
1. Delete old images, excel files, csv, etc. in new sale year folder
1. Update liveauction.com links in [watch and bid live](content/watch-and-bid-live.md)
1. Update Sale Year in [config/params](config/_default/params.toml)
1. Update the bull and heifer links in [config/menu](config/_default/menu.toml)
1. Update the bull and heifer links in [config/params](config/_default/params.toml)
1. Update where to point to for the homepage bulls in [content/_index](content/_index.md)
1. Upload EPDs for bulls and Cows into [Animals Airtable](https://airtable.com/appWcrcGmDLkeV4KM/tblHGU0zKnhfV0Zwy/viwTzlLwWTlPP7P4P?blocks=hide)
1. Run `npm run getData:loc` to generate the [data/allData](data/allData.json) file

### Bulls/Cows Pages

1. Drop Excel version in directory...download button will be automatically created
2. Drop CSV in directory...datatable will be automatically created. Note: make sure csv
   version has `Lot #` and `Reg #` columns.
3. Images/videos: 
   1. Drop Images into images directory
   2. Edit and then Run [set_image_resource_metadata](utilities/set_image_resource_metadata.py)
      to set the image information in the associated `_index.md` file.

### Supplemental Sheets

1. Log in to redangus.org
1. Go to Herd Reports/Downloads -> My Reports
1. Select an existing group, or create a `Quick Group` (comma separated reg numbers). Select `SCDE/Pedigree` report.
1. Click `Generate Report`.
1. Convert to json (e.g.) [here](https://csvjson.com/csv2json)
1. Change the following titles:
  * `reg #` to `reg`
  * `%b1` to `pct_b1`
  * `ProS%` to `ProS_pct`
1. Download and change file name to `data.json`
1. Add data to [data/supplemental/data.{yml|json}](data/supplemental)
1. Change title in [content/supplemental](content/supplemental.md)

## Datatables

1. Add data to `data` directory in json format with three fields: `headings`,
`options`, and `data`. options are additional [Datatables options](https://datatables.net/reference/option/).
```json
{
  "headings": ["Lot", "Reg", "Name"],
  "options": {"fixedHeader":  true },
  "data": [{"Lot": 1, "Reg":  123455, "Name": "Johnson"}]
}
```
1. Add shortcode to template: (e.g. `{{< dataTable id="bulls-2020" includejs="true" data_path="sales.2020.bulls" >}}
`)

### Things to remember

#### Get list of images into a json file

1. `find static/images/cattle/2020/bulls/*.webp -maxdepth 1 -type f > bulls-images.txt`
1. Edit into a json list
1. Place in `data` directory

### Scratchpad
[Hugo Example](https://gitlab.com/lego2018/hugo-template-musterprojekt/-/tree/develop/)