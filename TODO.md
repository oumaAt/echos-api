**TODO.md**

# TODO

Ce fichier liste les éléments manquants, les bonnes pratiques non appliquées et les améliorations envisagées pour le projet.

## Éléments manquants

- Gérer la pagination pour la liste des utilisateurs.
- Ajouter des tests unitaires et e2e.
- Mettre en place un système de refresh tokens pour gérer la réauthentification sans demander des identifiants à chaque fois.
- Ajouter un champ "email" avec validation pour permettre de recevoir des notifications ou la récupération de mot de passe.

## Bonnes pratiques non appliquées
- Utilisation d'un Dockerfile et Docker Compose pour standardiser l'environnement, éviter les problèmes de versions, et gérer les services de manière isolée et reproductible.

- Si votre application doit évoluer, intégrez des options pour OAuth2 ou SSO (Single Sign-On) via des services comme Google, Facebook...

## Améliorations d'architecture et de conception

- Si l'application est destinée à supporter plusieurs rôles utilisateurs ayant des attributs et des associations différents, je vais utiliser l'héritage pour structurer les données et faciliter la gestion des spécificités de chaque rôle.

- Ajouter une entité Address (si une addresse comporte plusieurs champs ça sera plus claire de les regrouper dans une entité distincte, ou bien si les addresses vont etre utilisées par plusieurs entités ou meme si un utilisateur peut avoir plusieurs addresses par exemple une addresse de facturation, addresse de livraison ...).

- Prévoir une mise en cache pour les requêtes fréquemment utilisées (par exemple, liste des utilisateurs).
