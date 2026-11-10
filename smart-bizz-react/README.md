# Smart Bizz Research Hub — React

React (Vite) source for the Smart Bizz Research Hub website.

Stack: React 18, Tailwind CSS 3, framer-motion, GSAP, lucide-react.

## Run

```bash
npm install
npm run dev       # local dev server
npm run build     # production build in dist/
npm run preview   # preview the production build
```

## Settings

Contact details, social links, the logo and the contact-form endpoint are set in
`window.SMARTBIZZ_CONFIG` in `index.html`, or with `VITE_*` variables in a `.env`
file (see `.env.example`). Empty values stay hidden on the page.

## Firebase admin

The website's `/admin` page uses Firebase Email/Password Authentication and
Firestore to view and manage contact enquiries.

1. Create a Firebase project, add a web app, and enable **Authentication →
   Sign-in method → Email/Password**.
2. Set the `VITE_FIREBASE_*` values in `.env` from the Firebase web app config.
   These client configuration values are intended to be public; never put a
   service-account key in the website.
3. Create a Firestore database and deploy the rules from this directory:

   ```bash
   npx firebase-tools deploy --only firestore:rules
   ```

4. Create an admin user in **Authentication → Users**. The app and rules
   currently allow only UID `g3g2aoFniFW0vHYM6Qs7Kci6CJ32`; the account you
   create must have that exact UID. Creating an email/password account does not
   itself grant admin access. If Firebase assigned a different UID, update the
   UID allowlist in `src/admin/AdminApp.jsx`, `firestore.rules`, and
   `storage.rules`, then redeploy the rules and website.
5. Add the website's production domain and any local development domain to
   **Authentication → Settings → Authorized domains**.

Visit `/admin` to sign in and manage enquiries. Public visitors can create
validated enquiry records, but only the allowlisted admin can read, update their
status, or delete them. The Firebase web config is not a replacement for the
deployed Firestore rules.

If the admin dashboard reports `permission-denied`, check that the signed-in
account UID matches the allowlisted UID and that the rules were published to
the same Firebase project shown in the error. The site's Firebase project is
configured by `VITE_FIREBASE_PROJECT_ID` in `.env`.

The admin dashboard also has a **Private files** section. Enable Firebase
Storage for the project, then deploy its rules:

```bash
npx firebase-tools deploy --only storage
```

Only the allowlisted admin UID can list, upload, download, or delete files under
`admin-uploads/{uid}/`. Uploads are limited to common images and documents up to
10 MB; all other Storage paths are denied. Downloads use authenticated SDK
requests, not public download URLs. If browser downloads are blocked, configure
your Storage bucket's CORS settings for the website's origin.

## Structure

```
src/
  config/site.js          site name, contact details, nav items, form options
  context/InterestContext  shared "area of interest" used by service buttons and the form
  hooks/                   reduced-motion, active-section and scroll helpers
  components/              Navbar, OceanBackground, ParticleField, MagneticButton, Typography
  sections/                Hero, About, Services, Approach, VisionMission, Ventures, Contact, Footer
  index.css                Tailwind layers, custom classes and animations
tailwind.config.js         theme colours and fonts
```

Note: in the Tailwind theme, `white` is the navy ink colour (#14294A) and `paper`
is the actual white surface colour.
