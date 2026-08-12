# 🗺️ Feuille de Route (Roadmap) — TontineBJ

Ce document présente la feuille de route du développement de **TontineBJ**, organisée par phases et Epics.

---

## 🎯 Phase 1 : Prototype & Expérience Client (Livrée ✅)

- [x] Direction artistique **« Carnet de Confiance »** (baobab leaf `#1E5B47`, jaune soleil, sable chaud).
- [x] Interface responsive avec breakpoints `390px`, `760px`, `1050px` et safe areas iOS.
- [x] Démonstration interactive de tableau de bord mobile et simulation de contribution XOF.
- [x] Support multi-langue en temps réel (**Français**, **Fon**, **Yoruba**).
- [x] Application Web Progressive (PWA) installable avec cache hors-ligne Workbox.
- [x] Sécurisation HTTP Helmet (CSP), CORS dynamique et validation Zod.

---

## 🚀 Phase 2 : Backend & Authentification (En cours 🛠️)

- [ ] **Issue #1 — Authentification OTP SMS (+229)** :
  - Envoi et validation de code OTP à 6 chiffres.
  - Connexion des numéros de téléphone MTN et Moov Bénin.
  - Limiteur de débit (rate-limiting) et génération de token JWT.

- [ ] **Issue #2 — Gestion Dynamique des Cercles & Cycles** :
  - Création de tontine avec fréquence (hebdomadaire, bimensuelle, mensuelle) et montant XOF.
  - Algorithme d'attribution automatique des tours de passage.
  - Invitation par code court ou lien deep-link.

- [ ] **Issue #5 — Persistance de la Liste d'Attente (Parakou)** :
  - Base de données PostgreSQL pour enregistrer les demandes de bêta.
  - Validation e-mail double opt-in et captcha anti-spam.

---

## 💳 Phase 3 : Intégrations Fintech & USSD (À venir ⏳)

- [ ] **Issue #3 — Connecteurs Mobile Money (MTN MoMo / Moov Money)** :
  - API de paiement direct sans solde hébergé.
  - Validation HMAC des webhooks de confirmation.
  - Idempotence par clé unique `externalId`.

- [ ] **Issue #4 — Passerelle USSD (*123#)** :
  - Arbre de menus USSD pour l'inclusivité des utilisateurs équipés de feature phones.
  - Consultation des échéances et approbation de versement par code PIN.
