# Slides Module 3

## Decks disponibles

- `slides/module-3.md` — deck facilitateur compact historique.
- `slides/module-3-facilitator.md` — deck facilitateur détaillé, source de vérité recommandée pour la prochaine itération (39 slides + notes facilitateur).

## Prévisualisation locale (Slidev)

Deck compact :

```bash
pnpm slides:dev
```

Deck facilitateur détaillé :

```bash
pnpm slides:facilitator:dev
```

## Rendu statique

Deck compact :

```bash
pnpm slides:build
```

Deck facilitateur détaillé :

```bash
pnpm slides:facilitator:build
```

Sorties HTML statiques :

- `slides/dist/module-3/`
- `slides/dist/module-3-facilitator/`

Les decks appliquent une contrainte visuelle DSFR en mode clair directement dans la source markdown.
