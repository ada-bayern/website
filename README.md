# ADA Website Documentation

## Project Title & Overview

**Angewandte Datenanalyse für die öffentliche Verwaltung in Bayern (ADA)**  
*Applied Data Analysis for Public Administration in Bavaria*

A specialized data science consultancy that provides workshops, training, and technical support to improve data handling capabilities and implement effective digitalization projects.

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

Use the [zola](https://www.getzola.org/documentation/getting-started/cli-usage/) binary to test the website locally:

```bash
./zola serve
```

In order to build the website without a local server, use

```bash
./zola build
```

## Website Navigation 

### Main Navigation Bar
1. **Projekte** (`/projekte`) - Project portfolio showcasing data science projects for public administration
2. **Was Wir Bieten** (`/was-wir-bieten`) - Services offered including workshops and consulting
3. **Wer wir sind** (`/wer-wir-sind`) - Team and organization information
4. **Suche** (`#search`) - Search functionality 

### Footer Navigation
1. **Impressum & Datenschutz** (`/impressum`) - Legal notice and privacy policy
2. **Kontakt** (`/impressum`) - Contact information
3. **Github** (`https://github.com/ada-bayern/`) - GitHub repository

### Content Sections
- **Project Portfolio**: Individual data science projects for public administration
- **Workshop Documentation**: Materials and case studies
- **Team Profiles**: Detailed information about team members
- **Service Information**: Four-phase project methodology

## Buttons and Interactive Elements

### Primary Action Buttons
- **"Mehr lesen" Button**: Homepage hero section → Links to "Was Wir Bieten" page
- **"Kontaktieren Sie uns" Buttons**: Three instances on homepage cards → All link to contact page
- **Search Button**: Main navigation → Activates site-wide search functionality

### Social Media & External Links
- **LinkedIn Button**: Links to [ADA Bayern LinkedIn](https://www.linkedin.com/company/ada-bayern/)
- **Instagram Button**: Links to Instagram profile
- **Partner Logo Buttons**: Clickable logos linking to partner websites
- **Team Profile Links**: Individual websites, LinkedIn profiles, and LMU academic profiles

### Resource Access
- **Project Resource Links**: Download buttons for workshop materials and PDFs
- **External Documentation Links**: Links to relevant external resources
- **Newsletter Subscription**: Available on select pages for user engagement

### Partner Organizations
- **BERD@NFDI**: [https://berd.nfdi.de](https://berd.nfdi.de)
- **LMU Munich**: [https://www.lmu.de](https://www.lmu.de)
- **Bayerische Staatsministerium für Digitales**: [https://www.stmd.bayern.de/ministerium/organisation/](https://www.stmd.bayern.de/ministerium/organisation/)



### Online Presence
- **Website**: https://ada-oeffentliche-verwaltung.de/
- **LinkedIn**: [https://www.linkedin.com/company/ada-bayern/](https://www.linkedin.com/company/ada-bayern/)
- **GitHub**: [https://github.com/ada-bayern/](https://github.com/ada-bayern/)

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
- **`was-wir-bieten/`** - Services section
  - `index.md` - Service descriptions and methodology
  - `cards.toml` - Four-phase project workflow cards (preparation, workshop, follow-up, post-ADA)

- **`wer-wir-sind/`** - About Us section
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


### `old_stuff/` - Legacy Files Archive
Contains previous iteration of the website:
- **Quarto-based files** (`.qmd` format) - Previous static site generator
- **`ADA-Oeffentliche-Verwaltung-Website.Rproj`** - R Project configuration
- **`_quarto.yml`** - Previous build configuration
- **Legacy styling and content** - Project materials
- **`icons/` & `projects/`** - Previous assets and project documentation


# Changeable Variables