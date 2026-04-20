# CP4 — Retrieval

## Objectif

Exposer une fonction `retrieve(query, k=5)` qui prend une question en langage naturel et renvoie les k chunks les plus pertinents avec leurs métadonnées.

## Learning Objective

**LO2 — Appliquer** : construction d'une pipeline de récupération et requêtage en langage naturel.

## Durée cible

25 min (pilote agent) + 5 min de debrief plénier.

## Brief participant

« La requête utilisateur est elle aussi vectorisée, puis on fait une recherche de similarité cosinus dans l'index. Top 5, pas top 1, pas top 50 — on en reparle au debrief. »

## Procédure

> ⚠️ Squelette — procédure détaillée à rédiger dans la PR « CP3→CP6 détail ».

Grandes lignes :
1. Écrire la fonction `retrieve(query, k=5)`.
2. Embedder la query avec le même modèle qu'en CP3.
3. Interroger l'index LibSQL, retourner les chunks + scores.
4. Exécuter 3 requêtes de test prédéfinies, imprimer les résultats.

## Exit criteria

- [ ] Fonction `retrieve` exportée et exécutable.
- [ ] Sur 3 requêtes de test fournies, chaque appel retourne 5 chunks non vides avec métadonnées (`source`, `page`).
- [ ] Les scores sont décroissants.
- [ ] Au moins une des 3 requêtes fait remonter un chunk manifestement pertinent (le participant peut pointer *pourquoi*).

## Vérification

> ⚠️ Séquence exacte à rédiger dans la PR « CP3→CP6 détail ».

## Hint ladder

> ⚠️ À rédiger dans la PR « hint ladder complet ».

## Pièges pédagogiques

Les 3 requêtes de test seront choisies pour *montrer* : (a) un cas où le top-1 suffit, (b) un cas où top-5 ramène 2 résultats pertinents et 3 parasites, (c) un cas où aucun chunk n'est pertinent mais l'index renvoie quand même 5 résultats. C'est l'amorce de la conversation sur le seuil et la confiance.

## Side quest

> ⚠️ À rédiger dans la PR « CP3→CP6 détail ». Candidat : ajouter un filtre métadonnée (`guide_id = "zero-trust"`).

## Transition

« On a la récupération. Au debrief : pourquoi top-5 et pas top-1 ? Pourquoi pas top-50 ? Ensuite on branche un LLM dessus. »
