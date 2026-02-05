# Dashboard - Exemple de réponse API

## Endpoint
`GET /api/dashboard`

## Structure JSON attendue

```json
{
  "users": 1247,
  "products": 356,
  "promoCodes": 42,
  "orders": 893,
  "payments": 2456
}
```

## Description des champs

- **users** (number): Nombre total d'utilisateurs inscrits
- **products** (number): Nombre total de produits disponibles
- **promoCodes** (number): Nombre de codes promotionnels actifs
- **orders** (number): Nombre total de commandes passées
- **payments** (number): Nombre total de paiements effectués

## Exemple avec détails additionnels (optionnel)

```json
{
  "users": {
    "total": 1247,
    "active": 1089,
    "growth": "+12%"
  },
  "products": {
    "total": 356,
    "inStock": 320,
    "outOfStock": 36
  },
  "promoCodes": {
    "total": 42,
    "active": 35,
    "expired": 7
  },
  "orders": {
    "total": 893,
    "pending": 45,
    "completed": 848
  },
  "payments": {
    "total": 2456,
    "amount": "€45,678.90",
    "lastMonth": "€12,345.00"
  }
}
```
