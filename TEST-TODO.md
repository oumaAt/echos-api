# Test-todo

Ce fichier décrit la stratégie de tests envisagée, sa mise en œuvre et son ordre d'exécution.

## Tests à implémenter

- Tests unitaires

Objectif : Tester les services, les contrôleurs et les modules de façon isolée.

Exemples :

* Inscription :

    - Valider que la création d'un utilisateur avec pseudonyme unique et mot de passe sécurisé fonctionne correctement.

    - Gérer les erreurs lorsque les données obligatoires (pseudonyme, mot de passe) sont absentes ou invalides.

    - Assurer que les données facultatives sont bien enregistrées.

* Authentification :

    - Test de la connexion avec des identifiants valides et invalides.

    - Validation de la génération et de la révocation des jetons JWT.

* Gestion des utilisateurs :

    - Modification des informations personnelles de l’utilisateur courant.

    - Validation des droits d’accès pour les administrateurs.

* Liste des utilisateurs :

    - Validation des fonctionnalités de tri et filtrage sur chaque champ.

    - Restriction de l’accès aux seuls administrateurs.

            *******************************************
Tests d’intégration

Objectif : Vérifier le fonctionnement entre les différentes couches de l’application (contrôleurs, services, base de données).

Exemples :

    - Inscription d’un utilisateur et vérification de la sauvegarde dans la base de données.

    - Authentification d’un utilisateur présent dans la base de données.

    - Modification d’un profil utilisateur et vérification que les modifications sont persistées.

    - Filtre de la liste des utilisateurs selon des critères spécifiques.

            *********************************************
Tests de performance

Objectif : Évaluer le comportement de l’API sous différentes charges.

## Mise en œuvre

*   Utilisation de Jest et Supertest pour les tests.
*   Création de mocks pour les dépendances.
*   Utilisation des données de test.
*   Objectif de couverture de code : 80% minimum.

## Ordre d'exécution

1.  **Tests unitaires :** Exécutés à chaque commit ou push pour une validation rapide.
2.  **Tests d'intégration :** Exécutés avant le déploiement en environnement de test.
3.  **Tests e2e :** Exécutés avant la mise en production.
