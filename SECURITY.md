# Security

## Reporting

Signaler un problème de sécurité à : **nhalabene@gmail.com**

## Notes

- L’URL Apps Script `/exec` est publique côté navigateur (API client). Protégez les actions admin par mot de passe (feuille `Config`).
- Changez `admin_password` dès le premier déploiement.
- Ne committez jamais de mots de passe Sheets, tokens Gmail ou clés privées hors de ce qui est déjà prévu dans le projet.
- Le formulaire exige un consentement RGPD ; honeypot anti-spam côté client + serveur.
