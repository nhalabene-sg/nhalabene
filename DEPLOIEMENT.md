# Déploiement — Site Web Nhalabene + Apps Script + Sheets

Ce dossier contient le site marketing et le backend Google Apps Script qui sert de **base de données** (Google Sheets) et d’**analytics de visites**.

## Contenu

| Fichier | Rôle |
|---------|------|
| `index.html` | Site public (PT / EN / FR / ES) |
| `assets/site-api.js` | Client API (tracking + contacts) |
| `assets/i18n-extra.js` | Traductions FAQ / RGPD / etc. |
| `assets/config.js` | URL API Apps Script |
| `apps-script/Code.gs.txt` | Backend complet à coller dans Apps Script |

## 1. Créer la base Google Sheets

1. [Google Sheets](https://sheets.google.com) → **Nouveau classeur**
2. Renommer : `Nhalabene Site Web DB`
3. **Extensions → Apps Script**
4. Effacer le code par défaut, coller **tout** le contenu de `apps-script/Code.gs.txt`
5. Enregistrer le projet (nom : `Nhalabene Site Web API`)

## 2. Initialiser les feuilles

1. Dans l’éditeur Apps Script, sélectionner la fonction `initialiserSysteme`
2. Cliquer **Exécuter**
3. Autoriser les permissions (Sheets + Gmail)
4. Vérifier que les onglets apparaissent :
   - `Config`
   - `Sessions`
   - `Visites`
   - `Evenements`
   - `Contacts`
   - `Stats_Jour`

## 3. Déployer l’application web

1. **Déployer → Nouvelle déploiement**
2. Type : **Application web**
3. Description : `Nhalabene Site Web API v1`
4. Exécuter en tant que : **Moi**
5. Qui peut y accéder : **Tout le monde**
6. **Déployer** → copier l’URL qui se termine par `/exec`

## 4. Brancher le site

1. Ouvrir `assets/config.js`
2. Remplacer :

```js
API_URL: 'COLLER_URL_APPS_SCRIPT_ICI',
```

par :

```js
API_URL: 'https://script.google.com/macros/s/XXXX/exec',
```

3. Ouvrir `index.html` dans le navigateur, ou publier sur GitHub Pages (voir `GITHUB_PAGES.md` / `README.md`)

## 5. Tester

| Test | Comment |
|------|---------|
| Ping API | Ouvrir `URL/exec?action=ping` → JSON `success: true` |
| Visite | Charger le site → une ligne dans `Visites` + `Sessions` |
| Langue | Changer PT/EN/FR/ES → ligne dans `Evenements` (`lang_change`) |
| Contact | Envoyer le formulaire → ligne dans `Contacts` + email à **nhalabene@gmail.com** |
| Admin | Ouvrir `URL/exec?page=admin` → mot de passe `nhalabene@site2026` |

## 6. Analytics (admin)

- URL : `…/exec?page=admin`
- Mot de passe : feuille `Config` → clé `admin_password` (défaut `nhalabene@site2026`)
- KPIs : visites, sessions, contacts, événements
- Tableau journalier 30 jours
- Contacts récents
- Lien direct vers le Google Sheet

## 7. Données enregistrées

### Visites
Page vue, session, langue, referrer, appareil, écran, timezone, UTM, durée sortie.

### Sessions
Premier / dernier contact, pages vues, landing, UTM.

### Evenements
CTA démo, CTA apps, vues de sections, changement de langue, soumission formulaire.

### Contacts
Nom, hôtel, email, téléphone, sujet, message, langue, session — **base CRM légère**.

### Stats_Jour
Agrégats quotidiens pour analyse marketing.

## 8. Config utile (feuille Config)

| Clé | Exemple | Effet |
|-----|---------|--------|
| `admin_password` | `…` | Accès analytics |
| `notify_email` | `nhalabene@gmail.com` | Destinataire alertes contact |
| `notify_on_contact` | `oui` / `non` | Active/désactive l’email interne |
| `confirm_to_prospect` | `oui` / `non` | Email de confirmation au prospect |

## 9. Conformité & anti-spam (site)

- Case **consentement RGPD** obligatoire + pages `privacy.html` / `terms.html`
- **Honeypot** champ caché `website` (rejet silencieux côté Apps Script)
- Validation **email / téléphone** côté client
- Confirmation automatique envoyée au prospect après soumission (si API configurée)

## 10. Mises à jour du code

Après chaque modification de `Code.gs.txt` :

1. Coller dans Apps Script → **Enregistrer**
2. **Déployer → Gérer les déploiements → ✎ → Nouvelle version → Déployer**

Sans « Nouvelle version », l’URL `/exec` reste sur l’ancien code.

## 11. Hébergement du site

Le dossier `SITE WEB` doit être déployé **en entier** (pas seulement `index.html`) :

- `assets/site-api.js` (obligatoire)
- `assets/i18n-extra.js`
- `privacy.html` / `terms.html`
- logos / favicon

Si `site-api.js` / `config.js` est absent ou `API_URL` non configurée, le formulaire bascule en **mailto** et un bandeau d’avertissement s’affiche.

---

**Contact site :** nhalabene@gmail.com · +351 920 433 761 · WhatsApp : https://wa.me/351920433761
