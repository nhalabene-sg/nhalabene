# Nhalabene — Site Web

Site marketing professionnel **Nhalabene** : gestion de transfers pour hôtels  
(Formulaire · Staff Réception · Administration).

- **Langues :** Português (PT-PT, défaut) · English · Français · Español  
- **Contact :** [nhalabene@gmail.com](mailto:nhalabene@gmail.com) · +351 920 433 761  
- **WhatsApp :** https://wa.me/351920433761  
- **Backend :** Google Apps Script + Google Sheets (analytics + CRM contacts)

---

## Publication GitHub — dossier complet

**Uploadez tout le dossier `SITE WEB` tel quel** (ne retirez aucun fichier).  
Gardez les sous-dossiers `assets/` et `apps-script/` — ne mettez pas les fichiers à plat à la racine.

Ce dépôt est le pack complet : site + icônes/logos + docs + backend Apps Script.

## Contenu du dépôt

```
SITE WEB/
├── index.html              # Site principal
├── privacy.html            # Politique de confidentialité (RGPD)
├── terms.html              # Conditions d’utilisation
├── 404.html                # Page d’erreur GitHub Pages
├── robots.txt
├── sitemap.xml
├── .nojekyll               # GitHub Pages (fichiers sans Jekyll)
├── .gitignore
├── LICENSE
├── README.md               # Ce fichier
├── DEPLOIEMENT.md          # Guide Apps Script + Sheets détaillé
├── GITHUB_PAGES.md         # Publier sur GitHub Pages
├── SECURITY.md
├── assets/                 # ← fichiers nécessaires au site uniquement
│   ├── config.js           # URL API Apps Script
│   ├── site-api.js         # Tracking + formulaire
│   ├── i18n-extra.js       # Traductions FAQ / RGPD / etc.
│   ├── favicon.svg         # Icône navigateur
│   ├── icon_192.svg        # Apple touch icon
│   └── icon_512.svg        # Open Graph / partage
└── apps-script/
    ├── Code.gs.txt         # Backend à coller dans Apps Script
    └── README.md
```

---

## Démarrage rapide

### 1. Prévisualiser en local

Ouvrir `index.html` dans le navigateur, **ou** :

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Puis : http://localhost:8080

### 2. Brancher la base de données (Apps Script)

1. Suivre **[DEPLOIEMENT.md](./DEPLOIEMENT.md)** (Sheet + `initialiserSysteme` + Web App).
2. Éditer `assets/config.js` :

```js
window.NH_CONFIG = {
  API_URL: 'https://script.google.com/macros/s/VOTRE_ID/exec'
};
```

Guide Pages : **[GITHUB_PAGES.md](./GITHUB_PAGES.md)**

### 3. Publier sur GitHub Pages

1. Créer un dépôt GitHub (ex. `nhalabene-site`).
2. Pousser **ce dossier** à la racine du dépôt (ou dans `/docs`).
3. **Settings → Pages → Source :** branch `main` / dossier `/` (ou `/docs`).
4. Attendre l’URL : `https://VOTRE_USER.github.io/nhalabene-site/`
5. Mettre à jour dans `index.html` (optionnel mais recommandé) :
   - balise `<link rel="canonical" …>`
   - `og:image` en URL **absolue**
   - `sitemap.xml` avec votre domaine

---

## Fonctionnalités

| Zone | Détail |
|------|--------|
| Marketing | Offre hôtels, 3 apps, marketing, bénéfices, démarche |
| Preuve | Chiffres + citations illustratives |
| FAQ | Accordéon + JSON-LD |
| Contact | Formulaire → Sheets + email Nhalabene + confirmation prospect |
| RGPD | Consentement, privacy, termes |
| Anti-spam | Honeypot |
| Analytics | Visites, sessions, événements, admin `?page=admin` |
| Mobile | Menu, barre bas, WhatsApp, safe areas |

---

## Sécurité / conformité

- Consentement RGPD obligatoire avant envoi  
- Pages légales : `privacy.html`, `terms.html`  
- Validation email / téléphone côté client  
- Honeypot anti-bots  
- Mot de passe admin analytics dans la feuille `Config` (à changer dès le premier déploiement)

---

## Licence

© Nhalabene — tous droits réservés. Voir [LICENSE](./LICENSE).

---

## Support

**Email :** nhalabene@gmail.com  
**Tél. :** +351 920 433 761  
**WhatsApp :** https://wa.me/351920433761
