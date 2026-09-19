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

Je veux ajouter une nouvelle fonctionnalité à mon application actuelle de régulation et planning d’ambulances.

⚠️ IMPORTANT :
NE SUPPRIME, NE MODIFIE ET NE CASSE AUCUNE FONCTION EXISTANTE DE L’APPLICATION.
Le planning actuel, les patients, les transports, les transports récurrents, les ambulances, les chauffeurs, l’historique et toutes les fonctions qui fonctionnent actuellement doivent rester exactement comme ils sont.

Je veux AJOUTER un nouvel « Espace Chauffeur », séparé de mon espace de régulation.

1. Connexion des chauffeurs

Chaque chauffeur doit avoir son propre compte avec :

	•	Nom du chauffeur
	•	Identifiant ou adresse e-mail
	•	Mot de passe

Après connexion, le chauffeur ne doit voir que les informations et les courses qui lui sont attribuées.

Il ne doit pas avoir accès à l’ensemble du planning de la régulation ni aux informations des autres chauffeurs.

2. Écran principal du chauffeur

Créer une interface très simple, adaptée à un téléphone.

Le chauffeur doit voir ses courses du jour avec :

	•	Heure
	•	Nom du patient
	•	Adresse de prise en charge
	•	Destination
	•	Numéro de téléphone du patient
	•	Ambulance qui lui est attribuée
	•	Notes éventuelles

Afficher les courses dans l’ordre chronologique.

3. Statut de chaque course

Pour chaque transport, créer des boutons très visibles :

🟠 « ACCEPTER LA COURSE »

🔵 « DÉMARRER LA COURSE »

🟡 « PATIENT PRIS EN CHARGE »

🟢 « TERMINER LA COURSE »

Chaque bouton doit enregistrer automatiquement la date et l’heure exactes de l’action.

Exemple :

06:15 — Course attribuée
06:10 — Acceptée
06:12 — Démarrée
06:25 — Patient pris en charge
07:05 — Course terminée

Les heures doivent être enregistrées automatiquement. Le chauffeur ne doit pas avoir à les saisir manuellement.

4. Synchronisation avec la régulation

Lorsqu’un chauffeur clique sur un bouton, le statut doit immédiatement être mis à jour dans l’espace régulation.

Par exemple :

Chauffeur clique sur « DÉMARRER LA COURSE »

→ Dans mon espace régulation, le transport passe automatiquement à « EN COURS ».

Chauffeur clique sur « PATIENT PRIS EN CHARGE »

→ La régulation voit automatiquement « PATIENT PRIS EN CHARGE ».

Chauffeur clique sur « TERMINER LA COURSE »

→ La régulation voit automatiquement « TERMINÉE ».

Je veux que les deux espaces utilisent les mêmes données et soient synchronisés.

5. Attribution d’une course

Depuis mon espace régulation, je dois pouvoir attribuer une course à :

	•	une ambulance
	•	un chauffeur

Une fois la course attribuée au chauffeur, elle doit automatiquement apparaître dans son espace chauffeur.

Si une course lui est retirée ou réattribuée à un autre chauffeur, elle doit disparaître de son espace ou être mise à jour automatiquement.

6. Notification

Prévoir une notification lorsqu’une nouvelle course est attribuée au chauffeur.

La notification doit indiquer au minimum :

	•	nouvelle course
	•	heure
	•	patient
	•	adresse de prise en charge

Si les notifications push nécessitent une configuration particulière, créer la structure nécessaire sans modifier les fonctions existantes.

7. Géolocalisation — préparer la fonctionnalité

Je veux également préparer l’application pour pouvoir ajouter ensuite la géolocalisation des ambulances.

Ne mets pas en place une géolocalisation complexe qui pourrait perturber l’application actuelle.

Prépare simplement l’architecture afin que chaque chauffeur puisse, après avoir donné son autorisation, partager la position GPS de son téléphone avec l’espace régulation.

Dans l’espace régulation, je voudrais ensuite pouvoir afficher une carte avec :

	•	Ambulance
	•	Chauffeur
	•	Position GPS
	•	Heure de la dernière position reçue

IMPORTANT : demander explicitement l’autorisation de localisation au chauffeur et respecter les permissions du téléphone.

8. Sécurité

Un chauffeur ne doit pouvoir accéder qu’à son propre compte et à ses propres transports.

La régulation doit conserver les droits administrateur permettant de voir et gérer tous les transports, patients, chauffeurs et ambulances.

Ne jamais afficher aux chauffeurs les données inutiles concernant les autres patients ou les autres chauffeurs.

9. Priorité de développement

Développe cette fonctionnalité progressivement dans cet ordre :

	1.	Comptes chauffeurs
	2.	Espace chauffeur
	3.	Affichage des courses attribuées
	4.	Boutons Accepter / Démarrer / Patient pris en charge / Terminer
	5.	Enregistrement automatique des heures
	6.	Synchronisation avec la régulation
	7.	Notifications
	8.	Préparation de la géolocalisation

Avant toute modification importante de la base de données ou de l’architecture existante, vérifie que cela ne risque pas de casser les fonctionnalités actuelles.

Je veux conserver toutes les données et fonctionnalités existantes.

Avant de terminer, vérifie que :

	•	mon planning actuel fonctionne toujours ;
	•	les transports récurrents fonctionnent toujours ;
	•	les patients fonctionnent toujours ;
	•	les ambulances et chauffeurs fonctionnent toujours ;
	•	l’historique fonctionne toujours ;
	•	l’espace régulation fonctionne toujours ;
	•	l’espace chauffeur fonctionne correctement sur téléphone.

Ne remplace pas l’application actuelle : AJOUTE cet espace chauffeur à l’application existante.
