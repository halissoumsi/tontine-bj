# 🤝 Guide de Contribution — TontineBJ

Merci de contribuer au projet **TontineBJ** ! Ce guide vous explique la marche à suivre pour soumettre des modifications et maintenir la qualité du code.

---

## 🛠️ Prise en Main & Configuration

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/votre-compte/tontinebj-web.git
   cd tontinebj-web
   ```

2. **Installer les dépendances** :
   ```bash
   pnpm install
   ```

3. **Lancer le serveur de développement** :
   ```bash
   pnpm dev
   ```

---

## 📜 Normes de Code & Quality Gate

Avant de soumettre une Pull Request, assurez-vous que toutes les vérifications passent :

```bash
# Vérification du typage TypeScript
pnpm check

# Exécution des tests unitaires
pnpm test

# Formatage du code avec Prettier
pnpm format

# Vérification du build de production
pnpm build
```

---

## 💬 Format des Messages de Commit (Conventional Commits)

Nous utilisons la convention **Conventional Commits** :

- `feat(scope)` : Nouvelle fonctionnalité (ex: `feat(i18n): add Fon language support`)
- `fix(scope)` : Correction de bug (ex: `fix(auth): fix OTP expiration check`)
- `sec(scope)` : Amélioration de sécurité (ex: `sec(server): add CSP headers`)
- `perf(scope)` : Optimisation de performance (ex: `perf(build): add manualChunks`)
- `docs(scope)` : Documentation (ex: `docs(readme): update installation guide`)
- `chore(scope)` : Tâches de maintenance (ex: `chore(deps): update vite to v7`)

---

## 🔀 Processus de Pull Request

1. Créez une branche à partir de `main` : `git checkout -b feature/nom-de-la-fonctionnalite`
2. Développez et commitez vos changements en suivant la convention de commit.
3. Vérifiez la conformité (`pnpm check && pnpm test && pnpm format`).
4. Ouvrez une **Pull Request** vers la branche `main` avec une description claire des modifications.
