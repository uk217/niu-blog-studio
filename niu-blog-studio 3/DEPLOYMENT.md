# Deployment Guide — NIU Blog Studio

## Step 1: Push to GitHub

### First time setup

```bash
# 1. Create a new PRIVATE repository on github.com
#    Name: niu-blog-studio
#    Visibility: Private (important — keeps your API keys safe)
#    Do NOT initialise with README

# 2. In this project folder, run:
git init
git add .
git commit -m "Initial commit — NIU Blog Studio"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/niu-blog-studio.git
git push -u origin main
```

### Future updates

```bash
git add .
git commit -m "Description of changes"
git push
# Netlify auto-deploys on every push to main
```

---

## Step 2: Connect to Netlify

1. Go to **[app.netlify.com](https://app.netlify.com)** and sign in
2. Click **Add new site → Import an existing project**
3. Choose **GitHub** and authorise Netlify
4. Select the **niu-blog-studio** repository
5. Build settings (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **Deploy site**

Netlify builds and deploys automatically. You'll get a URL like `https://niu-blog-studio.netlify.app`.

### Custom domain (optional)

In Netlify → Domain management → Add custom domain:
- e.g. `blog-studio.niu.com`
- Add a CNAME record in your DNS pointing to the Netlify subdomain

---

## Step 3: Upgrade password protection (recommended)

The current app-level password (`NIUBlogStudio2025!`) is a client-side check — sufficient for basic access control but not enterprise-grade. For production, replace it with **Netlify Identity**:

1. In Netlify → **Identity** → Enable Identity
2. Change registration to **Invite only**
3. Invite team members by email
4. Update `App.jsx` to use `netlify-identity-widget` instead of the password gate

This gives you proper user accounts, email-based login, and session management.

---

## Step 4: Environment variables (future — Sanity proxy)

When the Sanity proxy is set up, store the token server-side:

In Netlify → **Environment variables**, add:
```
SANITY_TOKEN=skSabc...
SANITY_PROJECT_ID=abc123xy
```

Then create a Netlify Function (serverless) at `netlify/functions/sanity-push.js` that reads these env vars and proxies the Sanity API call. This keeps credentials completely out of the client bundle.

---

## Step 5: Sanity CMS synchronisation (future)

To prepopulate blogs directly in global.niu.com:

1. **Confirm your Sanity schema** — the current push uses `_type: "post"`. Verify this matches your actual document type in Sanity Studio.
2. **Add `claude.ai` and your Netlify domain** to Sanity CORS origins (you've already done `claude.ai` — add `https://niu-blog-studio.netlify.app` too).
3. **Map fields** — check that `title`, `slug`, `body` (Portable Text), `language`, and `excerpt` match your schema field names.
4. **Test a push** from the hosted Netlify URL — if you get a CORS error, add the Netlify URL to Sanity CORS origins.
5. Once working, the **Push to Sanity** button creates a draft post directly in your CMS, linked to the correct language, ready for review and publish in Sanity Studio.

---

## Architecture overview

```
Browser (Netlify hosted)
    │
    ├── Anthropic API  (keyword research, writing, evaluation, translation)
    │
    └── Sanity API     (push drafts to global.niu.com CMS)
                            ↓
                    Sanity Studio (manual review + publish)
                            ↓
                    global.niu.com/blogs/news (live blog)
```
