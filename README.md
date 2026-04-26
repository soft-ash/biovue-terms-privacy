# BioVue Policy Pages

Render-ready Node/Express project for BioVue Privacy Policy and Terms pages.

## Routes

- `/privacy`
- `/privacy-policy`
- `/terms`
- `/terms-of-service`

All routes fetch policy content from:

```txt
https://api.biovuedigitalwellness.com/api/v1/privacy-policy
```

You can change this using the environment variable:

```txt
POLICY_API_URL
```

## Run locally

```bash
npm install
npm start
```

Open:

```txt
http://localhost:3000/privacy
http://localhost:3000/terms
```

## Deploy on Render

1. Push this project to GitHub.
2. Create a new Web Service on Render.
3. Build command:

```bash
npm install
```

4. Start command:

```bash
npm start
```

5. Add environment variable if needed:

```txt
POLICY_API_URL=https://api.biovuedigitalwellness.com/api/v1/privacy-policy
```

## Fitbit URLs

Use these after deploy:

```txt
Privacy Policy URL: https://YOUR-RENDER-URL.onrender.com/privacy
Terms of Service URL: https://YOUR-RENDER-URL.onrender.com/terms
```
# biovue-terms-privacy
