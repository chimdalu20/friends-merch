This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deployment

Live at **https://friendsmerch.favtoma.com/** — served as plain static files
(`output: 'export'`) from Truehost cPanel shared hosting, not a Node server.

    ./deploy.sh    # build, upload, verify

Host `ssh favtoma` (cPanel user `rmmoxnli`), docroot `/home/rmmoxnli/friendsmerch`.
The subdomain was created from the shell with
`uapi SubDomain addsubdomain domain=friendsmerch rootdomain=favtoma.com dir=friendsmerch`;
cPanel wrote the DNS A record and AutoSSL issued the Let's Encrypt certificate.

Because the export sits at the subdomain root there is **no `basePath`** — asset
paths in `app/components/Gallery.tsx` are root-relative (`/images/N.jpg`).
