# Ambulances Planning

Première V1 de l'application de planning/régulation pour une flotte de 5 ambulances.

## Inclus
- interface française tablette/mobile
- planning journalier des 5 ambulances
- transports et statuts
- recherche globale
- filtres par statut
- création d'un transport
- changement de statut directement depuis le planning
- patients/chauffeurs/ambulances comme navigation de base
- PWA installable sur Android

## Lancer
```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Prochaine étape
Brancher une base PostgreSQL + Prisma, authentification/RBAC, patients persistants, récurrences, historique/audit, conflits de planning et synchronisation temps réel.
