# NIU Blog Studio

Internal AI-powered blog generation tool for NIU Technologies.

## Local Development

```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

## Deployment (GitHub → Netlify)

See DEPLOYMENT.md for step-by-step instructions.

## Security

- Password protected at the application level (login gate)
- `noindex, nofollow` meta tags prevent search engine indexing
- For production: replace the app-level password with Netlify Identity (see DEPLOYMENT.md)

## Tech Stack

- React 18 + Vite
- Anthropic Claude API (Haiku + Sonnet)
- Sanity CMS integration
- Netlify hosting
