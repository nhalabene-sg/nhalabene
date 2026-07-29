# GitHub Pages — checklist

1. Créer le dépôt (ex. `nhalabene-site`).
2. Depuis ce dossier :

```bash
git init
git add .
git commit -m "Initial commit — Nhalabene site web"
git branch -M main
git remote add origin https://github.com/VOTRE_USER/nhalabene-site.git
git push -u origin main
```

3. GitHub → **Settings → Pages**
   - Source : Deploy from a branch
   - Branch : `main` / `/ (root)`
4. Attendre 1–2 minutes, ouvrir l’URL Pages.
5. Mettre à jour :
   - `assets/config.js` → `API_URL`
   - `sitemap.xml` + `robots.txt` → votre URL réelle
   - `index.html` → `canonical` + `og:image` en URL absolue (ex. `https://VOTRE_USER.github.io/nhalabene-site/assets/icon_512.svg`)

## Domaine personnalisé (optionnel)

1. Pages → Custom domain → `nhalabene.com`
2. Créer un fichier `CNAME` à la racine contenant :

```
nhalabene.com
```

3. Configurer les DNS chez votre registrar (A / CNAME selon GitHub).
