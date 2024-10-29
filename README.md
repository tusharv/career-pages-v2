# Career Pages V2
[@Kaustubh-Natuskar](https://github.com/Kaustubh-Natuskar) has build repo at https://github.com/Kaustubh-Natuskar/companies-to-apply

This repo has good, alphabetically sorted list of companies with link of their career page.

# Social
<a href="https://www.producthunt.com/posts/career-pages?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-career&#0045;pages" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=427488&theme=light" alt="Career&#0032;Pages - Career&#0032;pages&#0032;from&#0032;450&#0043;&#0032;tech&#0032;companies | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## Task
- Convert [this](https://github.com/Kaustubh-Natuskar/companies-to-apply/blob/main/README.md) `README.md` file to website 🕸
- Site should display Alphabets and clicking on it should display list of company
- Search box to search for specific company


## Good to have
- ~~Auto suggest names in search~~
- Interface to add new company
- ~~Company with Logos and other details~~
- Locationwise search
- ~~Hosting on Github Page / Netlify / Vercel / Heroku~~

## Why?
This page will help students / job seekers to find list of companies at one place.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js + Gluestack UI template, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Developer Notes

Favicon using Google API
```
https://www.google.com/s2/favicons?domain={{domain}}&sz={{size}}
```
Saving it to `logo-cache` for faster load and avoid exploiting API on every run

Webp bulk conversion using

```
    for file in logo-cache/*; do cwebp -q 100 -resize {{height}} {{width}} "$file" -o "${file%.*}.webp"; done
```
More about [cwebp](https://developers.google.com/speed/webp/docs/cwebp)

Sending Feedback using https://postmarkapp.com/
