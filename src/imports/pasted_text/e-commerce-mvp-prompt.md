# PROMPT — Création du MVP E-commerce IKKA DEL MAR

## 1. Contexte du projet

Je veux créer un site e-commerce professionnel pour une marque appelée **IKKA DEL MAR**.

La marque est présente principalement sur Instagram et commercialise des produits liés à la mode estivale, plage, swimwear et lifestyle.

Le site demandé est pour le moment un **MVP / prototype fonctionnel**.

IMPORTANT :

* Ne pas attendre les vraies photos et les vrais prix.
* Utiliser temporairement des **produits, photos, noms et prix fictifs mais réalistes**, inspirés du type de produits présentés par la marque sur Instagram.
* Le but est de créer une première version très professionnelle permettant au client de visualiser le futur site.
* Après validation du MVP, les vraies photos, références, descriptions et prix seront intégrés.

---

# 2. Objectif principal

Créer une expérience e-commerce moderne, premium et orientée mobile qui donne l'impression d'une vraie marque de mode internationale.

Le site doit être :

* élégant
* moderne
* premium
* minimaliste
* visuel
* rapide
* responsive
* facile à utiliser
* optimisé pour mobile
* adapté au marché marocain

Le design doit être inspiré de l'univers :

**Summer / Mediterranean / Beach / Luxury / Fashion / Morocco**

Éviter absolument l'apparence d'un template e-commerce générique.

---

# 3. Identité visuelle

Créer une direction artistique cohérente avec une marque de beachwear premium.

Utiliser :

* grandes images produits
* photos lifestyle
* beaucoup d'espace blanc
* typographie élégante
* animations discrètes
* transitions fluides
* boutons modernes
* cartes produits minimalistes
* navigation claire

La priorité doit être donnée aux photos et aux produits.

Le site doit être particulièrement beau sur smartphone.

---

# 4. Structure du site

Créer les pages suivantes :

### Accueil `/`

La homepage doit être très visuelle.

Sections :

1. Header / Navbar
2. Hero section plein écran
3. CTA principal "Découvrir la collection"
4. Nouvelle collection
5. Best sellers
6. Catégories
7. Section lifestyle / campagne
8. Promotions éventuelles
9. Instagram / Social proof
10. Newsletter
11. Footer

Hero exemple :

> IKKA DEL MAR
> Summer starts here.

Avec un bouton :

> SHOP NOW

---

# 5. Boutique `/shop`

Créer une vraie page catalogue.

Afficher :

* grille de produits
* image
* nom
* prix
* ancien prix si promotion
* badge "NEW"
* badge "SALE"
* bouton ajout panier

Ajouter des filtres :

* Catégorie
* Taille
* Couleur
* Prix
* Disponibilité

Ajouter également un système de tri :

* Nouveautés
* Prix croissant
* Prix décroissant
* Best sellers

Le catalogue doit fonctionner parfaitement sur mobile.

---

# 6. Catégories

Créer des catégories cohérentes avec la marque.

Exemples :

* Swimwear
* Bikinis
* One Piece
* Beachwear
* Dresses
* Sets
* Accessories
* New Collection
* Sale

Les catégories doivent être facilement accessibles depuis la homepage et la navbar.

---

# 7. Page produit `/product/:id`

Créer une fiche produit professionnelle.

Afficher :

* grande galerie d'images
* images secondaires
* nom du produit
* prix
* prix promotionnel si nécessaire
* description
* couleurs disponibles
* tailles disponibles
* guide des tailles
* disponibilité
* quantité
* bouton "Ajouter au panier"
* bouton "Commander via WhatsApp"

Ajouter également :

* produits similaires
* produits récemment consultés
* informations livraison
* politique d'échange

Exemple :

**MARÉA BIKINI**

Prix : 499 MAD

Tailles :
XS / S / M / L

Couleurs :
Black / White / Sand

Boutons :

> ADD TO CART

> ORDER VIA WHATSAPP

---

# 8. Panier `/cart`

Créer un panier fonctionnel.

Le panier doit afficher :

* image produit
* nom
* taille
* couleur
* quantité
* prix
* suppression
* sous-total
* frais de livraison
* total

Bouton :

> PASSER LA COMMANDE

---

# 9. Checkout `/checkout`

Créer un checkout simple adapté au marché marocain.

Champs :

### Informations client

* Nom complet
* Téléphone
* Email
* Ville
* Adresse
* Code postal

### Livraison

* Livraison à domicile

### Paiement

Pour le MVP :

**Paiement à la livraison — Cash on Delivery**

Ne pas développer de système de paiement bancaire complexe pour cette première version.

Ajouter une confirmation de commande claire.

---

# 10. Commande WhatsApp

Créer également une fonctionnalité permettant de commander directement via WhatsApp.

Lorsqu'un utilisateur clique sur :

> COMMANDER VIA WHATSAPP

générer automatiquement un message contenant :

* nom du produit
* taille
* couleur
* quantité
* prix
* total

Exemple de message :

> Bonjour, je souhaite commander :
>
> Produit : Maréa Bikini
> Taille : M
> Couleur : Black
> Quantité : 1
> Prix : 499 MAD
>
> Nom :
> Téléphone :
> Ville :
> Adresse :

Utiliser un numéro WhatsApp configurable dans les paramètres.

---

# 11. Compte client

Pour le MVP, garder cette partie simple.

Prévoir éventuellement :

* Connexion
* Inscription
* Mes commandes
* Informations personnelles

Mais ne pas laisser cette fonctionnalité ralentir le développement du MVP.

La priorité est :

**Catalogue → Produit → Panier → Commande**

---

# 12. Admin Dashboard

Créer une petite interface d'administration permettant de gérer :

### Produits

* Ajouter
* Modifier
* Supprimer
* Activer / désactiver
* Prix
* Prix promotionnel
* Stock
* Images
* Taille
* Couleur
* Catégorie

### Commandes

Afficher :

* numéro commande
* client
* téléphone
* produits
* montant
* ville
* adresse
* statut

Statuts :

* Nouvelle
* Confirmée
* En préparation
* Expédiée
* Livrée
* Annulée

### Catégories

CRUD simple.

---

# 13. Produits fictifs du MVP

Créer environ **12 à 20 produits fictifs** pour remplir le catalogue.

Les produits doivent être cohérents avec l'univers IKKA DEL MAR.

Exemples :

* Maréa Bikini
* Amalfi One Piece
* Santorini Set
* Cala Bikini
* Marina Dress
* Capri Beach Set
* Luna Swimsuit
* Riviera Dress
* Azure Bikini
* Sol Beach Set
* Costa One Piece
* Del Mar Pareo

Prix fictifs réalistes en MAD.

IMPORTANT :

Marquer clairement dans le code/data que ces produits sont des **DONNÉES DE DÉMONSTRATION** afin qu'ils puissent être remplacés facilement par les vraies données.

---

# 14. Responsive design

Le site doit être conçu d'abord pour mobile.

Tester au minimum :

* 375px
* 390px
* 414px
* tablette
* desktop 1440px

Sur mobile :

* menu hamburger
* navigation simple
* grille 2 produits par ligne
* boutons facilement accessibles
* images optimisées
* checkout facile à remplir

---

# 15. UX / UI

Créer une expérience proche d'une vraie marque premium.

Ajouter de petites animations :

* hover produit
* apparition progressive
* transitions entre pages
* changement d'image produit
* animation du panier

Mais :

**NE PAS SURCHARGER LE SITE AVEC DES ANIMATIONS.**

La priorité est :

**Performance + élégance + conversion.**

---

# 16. SEO

Préparer le MVP pour le SEO :

* title unique par page
* meta description
* Open Graph
* URLs propres
* sitemap
* robots.txt
* alt text sur les images
* données structurées Product lorsque possible
* structure H1/H2 correcte

Exemple :

Title :

> IKKA DEL MAR | Swimwear & Beachwear

---

# 17. Performance

Optimiser :

* images WebP/AVIF
* lazy loading
* code splitting
* compression
* responsive images
* éviter les bibliothèques inutiles

Le site doit être rapide même sur une connexion mobile moyenne.

---

# 18. Architecture technique

Créer une architecture propre et évolutive.

Pour la version codée, utiliser une stack moderne.

Suggestion :

Frontend :

* React
* TypeScript
* Vite
* Tailwind CSS

Backend :

* Node.js
* Express

Database :

* PostgreSQL ou MySQL

Pour le MVP, si un backend complet n'est pas nécessaire immédiatement, utiliser une architecture permettant de remplacer facilement les données fictives par une vraie API.

Créer une séparation claire :

* components
* pages
* layouts
* services
* API
* types
* data
* hooks
* utils

Ne pas mettre toute la logique dans les composants.

---

# 19. Gestion des données

Créer des modèles propres pour :

### Product

* id
* name
* slug
* description
* price
* salePrice
* category
* images
* sizes
* colors
* stock
* featured
* new
* sale

### Category

* id
* name
* slug
* image

### Order

* id
* customer
* products
* subtotal
* shipping
* total
* status
* createdAt

---

# 20. Version WordPress

Après avoir créé la version codée, prévoir une seconde version du même concept avec :

**WordPress + WooCommerce**

Elle doit reprendre :

* même identité visuelle
* même catalogue fictif
* même logique e-commerce
* catégories
* panier
* checkout
* paiement à la livraison
* gestion des commandes
* gestion des produits

Le but est de pouvoir présenter au client :

### Version 1

Site développé sur mesure.

### Version 2

Site WordPress / WooCommerce.

Puis comparer :

* coût
* rapidité de développement
* personnalisation
* maintenance
* évolutivité
* facilité de gestion

---

# 21. Ce qui est PRIORITAIRE pour le MVP

Ne pas perdre du temps sur des fonctionnalités secondaires.

Priorité absolue :

1. Design professionnel
2. Homepage
3. Catalogue
4. Fiche produit
5. Panier
6. Checkout
7. WhatsApp
8. Responsive mobile
9. Admin produits
10. Admin commandes

Les fonctionnalités secondaires peuvent être préparées mais ne doivent pas bloquer le MVP.

---

# 22. Important : ne pas sur-développer

C'est un MVP.

Ne pas créer immédiatement :

* système complexe de fidélité
* paiement bancaire avancé
* marketplace
* recommandations IA
* système ERP
* application mobile
* fonctionnalités inutiles

Construire d'abord une version **simple, propre, rapide et impressionnante**.

---

# 23. Résultat attendu

À la fin, je veux pouvoir ouvrir le site et avoir l'impression d'être sur le véritable site officiel d'une marque premium de beachwear.

Le parcours utilisateur doit être :

**Instagram → Site → Produit → Panier → Commande**

L'utilisateur doit comprendre immédiatement :

* ce que vend IKKA DEL MAR
* quelle est la nouvelle collection
* combien coûtent les produits
* comment commander
* comment être livré

Le MVP doit être suffisamment professionnel pour être présenté au client et permettre ensuite de remplacer facilement toutes les données fictives par les vraies données.

## Règle finale

Avant de commencer à coder :

1. analyser l'univers visuel de IKKA DEL MAR ;
2. analyser les meilleures pratiques des sites e-commerce de swimwear/beachwear ;
3. proposer une direction UI/UX cohérente ;
4. construire ensuite le MVP ;
5. garder le code propre, modulaire et facilement maintenable.

**Ne copie aucun site existant. Utilise uniquement les bonnes pratiques comme inspiration et crée une identité propre à IKKA DEL MAR.**
