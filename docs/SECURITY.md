# 🛡️ Politique de Sécurité — TontineBJ

Ce document détaille les mesures de sécurité implémentées dans **TontineBJ**, ainsi que les exigences de sécurité pour les futures intégrations de paiements.

---

## 🔒 1. En-têtes de Sécurité HTTP & CSP

Le serveur Express ([`server/security.ts`](../server/security.ts)) utilise **Helmet** pour appliquer des en-têtes HTTP stricts :

```typescript
export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});
```

- **X-Powered-By** est désactivé (`app.disable("x-powered-by")`).
- **Content-Security-Policy (CSP)** restreint les origines de scripts, polices et connexions.

---

## 🌐 2. Politiques CORS

Le middleware CORS contrôle les origines autorisées :

- **Développement** : Autorise `localhost` et les origines de test.
- **Production** : Seules les origines listées dans la variable d'environnement `ALLOWED_ORIGINS` (séparées par des virgules) sont autorisées.

---

## 🧪 3. Validation des Entrées (Zod Guards)

Tous les corps de requêtes HTTP sont interceptés et validés par le middleware `validateBody` basé sur **Zod** :

```typescript
export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Les données envoyées sont invalides.",
        issues: result.error.issues.map(({ path, code }) => ({ path, code })),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
```

---

## 🚫 4. Prévention de la Traversée de Répertoire (Path Traversal)

Dans `vite.config.ts`, le proxy d'assets assainit les URLs en supprimant les caractères de traversée relatives (`..`) afin d'empêcher la lecture non autorisée de fichiers système.

---

## 💳 5. Exigences pour les Intégrations Fintech Futures

Toute intégration future avec les opérateurs Mobile Money (MTN MoMo, Moov Money) devra respecter :

1. **Absence de solde hébergé** : Les fonds transitent directement entre les comptes Mobile Money des membres.
2. **Vérification HMAC** : Chaque webhook de confirmation doit vérifier la signature cryptographique envoyée par l'opérateur.
3. **Idempotence des transactions** : Utilisation d'un identifiant unique `externalId` pour prévenir les doubles débits.
4. **Chiffrement des données sensibles** : Chiffrement AES-256 des numéros de téléphone et données personnelles en base de données.
