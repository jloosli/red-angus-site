# Loosli Red Angus Website
![Hugo](https://github.com/jloosli/red-angus-site/workflows/Hugo/badge.svg)

## New Sale Year Steps

1. Update message on [main sale page](content/_index.md)
2. Create a new sale year by duplicating folder structure in [sales](content/sales)
3. Delete old images, excel files, csv, etc. in new sale year folder
4. Update liveauction.com links in [watch and bid live](content/watch-and-bid-live.md)
5. Update Sale Year in [config/params](config/_default/params.toml)

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

#### Supplemental Sheets
1. Add data to [data/supplemental/data.{yml|json}](data/supplemental)

### Scratchpad
[Hugo Example](https://gitlab.com/lego2018/hugo-template-musterprojekt/-/tree/develop/)

