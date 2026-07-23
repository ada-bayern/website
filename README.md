# ondatix Website Documentation

## TODO
- [x] VAT ins Impressum
- [ ] Texte ersetzen
- [x] Hero Bar
- [x] Entscheidung für GitHub-Link im Footer
- [x] Icons ersetzen
- [ ] Personenseiten aufpolieren
- [ ] Connection zu ADA herstellen
- [ ] Domain hinzufügen

## Technologies Used

- **Static Site Generator**: Zola 
- **Styling**: SCSS/Sass with custom components
- **Templates**: Custom HTML templates with Zola shortcodes
- **Search**: ElasticLunr JSON search index
- **Interactive Components**: Custom sliding cards, responsive design
- **Configuration**: TOML files for content management


## Setup & Requirements

To run build and serve the website, install **zola** from [https://github.com/getzola/zola/releases](https://github.com/getzola/zola/releases) and place the binary in the root of this repo.

Additional requirements:
- **Build Tools**: Sass compilation enabled
- **Search Index**: Automatic generation enabled

## Running the Website

Use zola to run the website locally. You can either [install zola globally](https://www.getzola.org/documentation/getting-started/installation/) via your package manager or [download the binary](https://www.getzola.org/documentation/getting-started/cli-usage/) and place it in the root of the website (in that case use `./zola` instead of `zola` for the following commands).

```bash
zola serve
```

In order to build the website without a local server, use

```bash
zola build
```

## Project Structure

The website uses a content management system with:
- **Content Organization**: Markdown files with TOML frontmatter
- **Data Files**: TOML files for team members, cards, and partner information
- **Custom Theme**: ADA_Theme with specialized templates and styling

- **SEO Optimization**: Metadata and search functionality

## Folder Structure

### Root Level Configuration
- **`config.toml`** - Main site configuration file defining base URL, navigation menus, footer links, social media links, and Zola build settings
- **`README.md`** - Project documentation 

### `content/` - Website Content Management
Contains all website content organized hierarchically:

- **`_index.md`** - Homepage content with hero section, mission statement, and card displays
- **`cards.toml`** - Homepage content cards with organizational goals 
- **`team.toml`** - Team member profiles with photos, bios, contact info, and social links
- **`initiators.toml`** - Partner organization information with logos and URLs

#### Content Subdirectories:
- **`projekte/`** - Project portfolio section
  - `_index.md` - Projects landing page template configuration
  - Individual project folders 
  - Workshop documentation with modules and resource links
- **`angebot/`** - Services section
  - `index.md` - Service descriptions and methodology
  - `cards.toml` - Four-phase project workflow cards (preparation, workshop, follow-up, post-ADA)

- **`ueber-uns/`** - About Us section
  - `index.md` - Team introduction and organizational information
- **`impressum/`** - Legal section
  - `index.md` - Legal notice, privacy policy, and contact information 

### `themes/ADA_Theme/` - Custom Website Theme
- **`templates/`** - HTML template files
  - `base.html` - Main layout template
  - `index.html` - Homepage template
  - `project.html` & `project-list.html` - Project display templates
  - `contact.html` - Contact page template
  - `macros/` & `shortcodes/` - Reusable template components
- **`sass/`** - SCSS stylesheet source files for custom styling
- **`static/`** - Theme-specific static assets
- **`theme.toml`** - Theme configuration file

### `static/` - Source Static Assets
Contains original files that get copied to the public directory:
- **`css/`** - Source stylesheets including sliding card components
- **`images/`** - Original images, icons, logos, and graphics
- **`js/`** - JavaScript source files for interactivity
- **`sliding-cards-demo.html`** - Interactive component demonstrations

### `public/` - Generated Output (Build Artifacts)
Auto-generated directory containing the compiled website:
- **`css/`** - Compiled and optimized stylesheets
- **`js/`** - Processed JavaScript files including search functionality
- **`images/`** - Optimized images and processed graphics
- **`search_index.de.json`** - Search index for site search
- **`elasticlunr.min.js`** - Search engine JavaScript library

