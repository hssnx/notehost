# NoteHost: Free Hosting for Notion Sites!

## Using:

- Cloudflare DNS
- Cloudflare workers
- Reverse proxy implementation
- TypeScript

## Supports:

- Custom meta tags
- Page slugs
- Dark mode toggle
- Custom JS for head and body
- Custom fonts (using [Google Fonts](https://fonts.google.com/))
- Subdomain redirect (e.g. www)

<br/>

## How to use:

### Setup your Cloudflare account

---

1. Add your domain to Cloudflare. Make sure that DNS doesn't have `A` records for your domain and no `CNAME` alias for `www`
2. Create a new worker on Cloudflare and give it a meaningful name, e.g. `yourdomain-com-notion-proxy`
3. Keep the default example worker code, we will overwrite it anyway during deploy (see below)

> [!TIP]
> A bit outdated but detailed description on how to add your domain to Cloudflare and create a worker is [here](https://stephenou.notion.site/stephenou/Fruition-Free-Open-Source-Toolkit-for-Building-Websites-with-Notion-771ef38657244c27b9389734a9cbff44).
>
> Search for "Step 1: Set up your Cloudflare account".
>
> If someone wishes to create an up-to-date tutorial for NoteHost, please submit a pull request 😉

<br/>

### Generate your NoteHost worker

---

Go into your working directory and run:

```sh
npx notehost init <domain>
```

Follow the prompts to confirm your domain name and enter the requested information. You can change these settings later via the configuration file.

NoteHost will create a directory with the name of your domain. In this directory you will see the following files:

```
.
├── package.json                      test & deploy your website, see realtime logs
├── tsconfig.json                     types config
├── wrangler.toml                     your Cloudflare worker config
└── src
    ├── _build-page-script-js-string.js    helper script, details below
    ├── _page-script-js-string.ts     generated by helper script
    ├── index.ts                      runs reverse proxy
    ├── page-script.js                your custom JS page script
    └── site-config.ts                your domain and website config
```

Go into this directory and run

```sh
npm install
```

<br/>

### Configure your domain

---

Make sure that wrangler is authenticated with your Cloudflare account

```sh
npx wrangler login
```

1. Edit `wrangler.toml` and make sure that the `name` field matches your worker name in Cloudflare
2. Edit `site-config.ts` and set all the necessary options: domain, metadata, slugs, subdomain redirects, etc. All settings should be self explanatory, I hope 😊

```ts filename="src/site-config.ts"
import { NoteHostSiteConfig, googleTag } from 'notehost'
import { PAGE_SCRIPT_JS_STRING } from './_page-script-js-string'

// Set this to your Google Tag ID from Google Analytics
const GOOGLE_TAG_ID = ''

export const SITE_CONFIG: NoteHostSiteConfig = {
  domain: 'yourdomain.com',

  // Metatags, optional
  // For main page link preview
  siteName: 'My Notion Website',
  siteDescription: 'Build your own website with Notion. This is a demo site.',
  siteImage: 'https://imagehosting.com/images/preview.jpg',

  // URL to custom favicon.ico
  siteIcon: 'https://imagehosting.com/images/favicon.ico',

  // Social media links, optional
  twitterHandle: '@mytwitter',

  // Additional safety: avoid serving extraneous Notion content from your website
  // Use the value from your Notion settings => Workspace => Settings => Domain
  notionDomain: 'mydomain',

  // Map slugs (short page names) to Notion page IDs
  // Empty slug is your main page
  slugToPage: {
    '': 'NOTION_PAGE_ID',
    about: 'NOTION_PAGE_ID',
    contact: 'NOTION_PAGE_ID',
    // Hint: you can use '/' in slug name to create subpages
    'about/people': 'NOTION_PAGE_ID',
  },

  // Rewrite meta tags for specific pages
  // Use the Notion page ID as the key
  pageMetadata: {
    'NOTION_PAGE_ID': {
      title: 'My Custom Page Title',
      description: 'My custom page description',
      image: 'https://imagehosting.com/images/page_preview.jpg',
      author: 'My Name',
    },
  },

  // Subdomain redirects are optional
  // But it is recommended to have one for www
  subDomains: {
    www: {
      redirect: 'https://yourdomain.com',
    },
  },

  // The 404 (not found) page is optional
  // If you don't have one, the default 404 page will be used
  fof: {
    page: 'NOTION_PAGE_ID',
    slug: '404', // default
  },

  // Google Font name, you can choose from https://fonts.google.com
  googleFont: 'Roboto',

  // Custom CSS/JS for head and body of a Notion page
  customHeadCSS: `
  .notion-topbar {
    background: lightblue
  }`,
  customHeadJS: googleTag(GOOGLE_TAG_ID),
  customBodyJS: PAGE_SCRIPT_JS_STRING,
}
```

<br/>

### Deploy your website

---

```sh
npm run deploy
```

🎉 Enjoy your Notion website on your own domain! 🎉

> [!IMPORTANT]
> You need to run deploy every time you update `page-script.js` or `site-config.ts`.

<br/>

### What is src/_build-page-script-js-string.js?

---

The file `src/page-script.js` contains an example of a page script that you can run on your Notion pages.
This example script removes tooltips from images and hides optional properties in database cards.

🔥 This script is run in the web browser! 🔥

You can use `document`, `window` and all the functionality of a web browser to control the contents and behavior of your Notion pages.
Also, because this is a JS file, you can edit it in your code editor with syntax highlighting and IntelliSense!

To incorporate this script into a Notion page, NoteHost must transform the file's contents into a string. Consequently, the `src/_build-page-script-js-string.js` script is executed whenever you run `npm run deploy`.

So just add your JS magic to `page-script.js`, run deploy and everything else will happen automagically 😎

<br/>

### Logs

---

You can see realtime logs from your website by running

```sh
npm run logs
```

<br/>

### Demo

---

https://www.velsa.net

<br/>

### Acknowledgments

---

Based on [Fruition](https://fruitionsite.com), which is no longer maintained 😕

Lots of thanks to [@DudeThatsErin](https://github.com/DudeThatsErin) and her [code snippet](https://github.com/stephenou/fruitionsite/issues/258#issue-1929516345).
