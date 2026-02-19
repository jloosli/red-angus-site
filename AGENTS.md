# AGENTS.md — Loosli Red Angus Site

## Project Overview

Hugo static site for the Loosli Red Angus cattle ranch (`loosliredangus.com`). Content is written in Markdown, data is pulled from Airtable/Google Sheets, and the site is deployed to GitHub Pages via CI/CD.

**Tech stack:** Hugo · Bootstrap 5 · Node.js utilities · Python scripts · Docker

---

## Repository Layout

```
content/          # Markdown pages (site content)
  sales/YYYY/     # Per-year sale content (bulls/, heifers/, catalog/, images/, videos/)
  _index.md       # Homepage
config/_default/  # Hugo config (params.toml, menu.toml, etc.)
data/             # Generated JSON/YAML data (allData.json is auto-generated — don't edit)
assets/           # Images and supplemental CSV data
themes/           # Custom Hugo themes
  red-angus-bootstrap/   # Main Bootstrap-based theme
  red-angus-shortcodes/  # Custom Hugo shortcodes
utilities/        # Node.js and Python helper scripts
static/           # Static files (favicon, CNAME, robots.txt)
.github/workflows/hugo.yml  # CI/CD pipeline
```

---

## Dev Setup

### Prerequisites

- Docker (preferred) or Hugo CLI installed locally
- Node.js / npm
- Python 3.10+ with `uv` (`pip install uv`)

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Purpose | Where to get it |
|---|---|---|
| `AIRTABLE_KEY` | Airtable personal access token | https://airtable.com/create/tokens |
| `AIRTABLE_BASE` | Airtable base ID | Found in the URL when viewing the base |
| `HUGO_ADOBE_CLIENT_ID` | PDF Embed API key | https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/gettingstarted/ |
| `HUGO_GOOGLE_MAPS_KEY` | Google Maps API key | https://console.cloud.google.com/apis/credentials |
| `HUGO_GOOGLE_SHEETS_KEY` | Google Sheets API key | https://console.cloud.google.com/apis/credentials |

The `utilities/client_secret.json` file (for Google Sheets OAuth) must also exist. Download it from [Google Cloud Console](https://console.cloud.google.com/apis/credentials?project=loosliredangus) and place it in the `utilities/` directory.

Hugo version is pinned in `.env` as `HUGO_VERSION`.

### Running Locally

```bash
npm install
cp .env.example .env.local   # then fill in values

# Start dev server (Docker — recommended)
docker compose up server -d
# Site available at http://localhost:1313

# Or run Hugo directly (if installed locally)
hugo server
```

### Common Commands

| Command | Purpose |
|---|---|
| `npm run getData:loc` | Fetch data from Airtable + Google Sheets → writes `data/allData.json` |
| `docker compose up server -d` | Start Hugo dev server |
| `docker compose run build` | Local production-ish build via Docker (runs `hugo --gc`; CI adds `--minify` and other prod flags) |
| `docker compose run pull_data` | Run data fetch inside Docker |
| `npm run renameVideoFiles` | Rename video files via utility |

---

## Key Config Files

- **`config/_default/params.toml`** — `sale_year`, homepage widget images/links, contact info, sale reps, airports, motels
- **`config/_default/menu.toml`** — Navigation menu links (update bull/heifer links each year)
- **`data/allData.json`** — **Auto-generated. Never edit manually.** Regenerate with `npm run getData:loc`.
- **`data/herd_bulls.yml`** — Manually maintained herd bull data

---

## Content Workflow

### Adding a New Sale Year

1. Update `HUGO_VERSION` in `.env` if needed
2. Update the message on the homepage: `content/_index.md`
3. Duplicate the previous year's folder structure under `content/sales/YYYY/`
4. Delete old images, Excel files, and CSVs from the new year's folder
5. Update liveauction.com links in `content/watch-and-bid-live.md`
6. Set `sale_year` in `config/_default/params.toml`
7. Update bull/heifer nav links in `config/_default/menu.toml`
8. Update bull/heifer links in `config/_default/params.toml` (widgets section)
9. Update `home_slideshow_path` in `config/_default/params.toml` to point to the new year's images
10. Add EPDs for bulls and cows to the [Animal Data Spreadsheet](https://docs.google.com/spreadsheets/d/1vRYXaP8pZRlmmoLiNMxUAJu1MxVkKjKr7JAPDB3lMY4/edit?gid=670742932#gid=670742932)
11. Ensure `utilities/client_secret.json` exists, then run `npm run getData:loc`

### Bull/Heifer Page Updates

Each sale year directory (e.g., `content/sales/2026/bulls/`) works as follows:

- **Excel file** — Drop into the directory; a download button is auto-generated
- **CSV file** — Drop into the directory; a DataTable is auto-generated. Must have `Lot #` and `Reg #` columns.
- **Images** — Drop `.jpg`/`.webp` files into the `images/` subdirectory. File names should start with the animal's tag number followed by an underscore (e.g., `407_IMG_7262.jpg`).

After adding images, run the image metadata script to update `_index.md`:

```bash
uv venv                         # first time only
# Edit YEAR variable in the script first:
python utilities/set_image_resource_metadata.py > content/sales/YYYY/bulls/images/_index.md
```

The script reads the CSV in the bulls directory to match tag numbers to lot numbers and names.

### Image Handling

- Images go in `content/sales/YYYY/bulls/images/` or `content/sales/YYYY/heifers/images/`
- File naming convention: `{TAG}_{original_filename}.jpg` (tag number prefix enables auto-matching)
- The `set_image_resource_metadata.py` script has a `YEAR` constant at the top — update it before running
- The script outputs YAML frontmatter for the `_index.md` resource bundle; redirect its output to the correct file

### Video Integration

Videos are sourced from YouTube. Workflow:

1. Upload videos to YouTube
2. Run `npx ts-node utilities/manage-youtube.ts` to list/manage videos
3. Run `npx ts-node utilities/updateAirtableYoutubeIds.ts` to sync YouTube IDs back to Airtable
4. Re-run `npm run getData:loc` to pull updated data including video IDs into `data/allData.json`

Video files can be renamed using `npm run renameVideoFiles` before upload if needed.

### Supplemental Sheets

For SCDE/Pedigree report data from redangus.org:

1. Log in to redangus.org → Herd Reports/Downloads → My Reports
2. Select or create a Quick Group (comma-separated reg numbers), choose SCDE/Pedigree report
3. Generate and download, rename to `data.csv`
4. Place in `assets/supplemental/data.csv`
5. Update title in `content/supplemental.md`

---

## Code Conventions

### Formatting

- **HTML templates**: Formatted with Prettier using `prettier-plugin-go-template`. Run `npx prettier --write .` to format.
- **Markdown**: Linted with `.markdownlint.yaml` config. Single H1 per file is OK when title is set in frontmatter.
- **TypeScript**: Compiled to `utilities/build/`. Config in `tsconfig.json`.
- **PostCSS/Autoprefixer**: Used for CSS processing; config in `postcss.config.js` and `.browserlistrc`.

### Hugo Themes

- `themes/red-angus-bootstrap/` — Main theme. Bootstrap 5 layout, partials, and assets.
- `themes/red-angus-shortcodes/` — Custom shortcodes for embedding content (datatables, PDFs, etc.).
- Do not modify Bootstrap source directly; override via theme assets.

### Shortcodes

Key shortcodes available (defined in `themes/red-angus-shortcodes/`):

- `dataTable` — Renders a DataTable from a JSON data file
- Check `themes/red-angus-shortcodes/layouts/shortcodes/` for all available shortcodes

### Data Files

- `data/allData.json` is regenerated from Airtable/Google Sheets — **never edit manually**
- `data/herd_bulls.yml` is manually maintained
- Hugo's data directory is accessible in templates via `.Site.Data`

---

## CI/CD

GitHub Actions workflow (`.github/workflows/hugo.yml`) triggers on push to `main`:

1. Checks out repo with LFS and submodules
2. Installs Hugo (version from `.env`)
3. Installs Dart Sass and Node dependencies
4. Builds with `hugo --gc --minify` using secrets for Adobe, Google Maps, and Google Sheets keys
5. Deploys to GitHub Pages

Secrets required in GitHub repo settings: `HUGO_ADOBE_CLIENT_ID`, `HUGO_GOOGLE_MAPS_KEY`, `HUGO_GOOGLE_SHEETS_KEY`.

---

## Common Pitfalls

- **`data/allData.json` not updated**: Always re-run `npm run getData:loc` after changing EPD data in the spreadsheet or Airtable.
- **Image metadata not set**: Forgetting to run `set_image_resource_metadata.py` after adding images means lot numbers and titles won't appear in galleries.
- **Wrong `YEAR` in Python script**: The `YEAR` constant in `set_image_resource_metadata.py` must match the current sale year before running.
- **Docker on Apple Silicon**: The `docker-compose.yml` forces `platform: linux/amd64` for the Hugo image — this is intentional.
- **`.env.local` vs `.env`**: `.env` only contains `HUGO_VERSION`. All secrets go in `.env.local` (gitignored).
