# Loosli Red Angus Website

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


### Scratchpad
[Hugo Example](https://gitlab.com/lego2018/hugo-template-musterprojekt/-/tree/develop/)
