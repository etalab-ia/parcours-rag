# Slides Module 3

## Decks disponibles

- `slides/module-3.md` — deck facilitateur compact historique.
- `slides/module-3-facilitator.md` — deck facilitateur détaillé, source de vérité recommandée pour la prochaine itération.

## Documents de conception liés

- `design/module-3-learning-objectives-support-plan.md` — plan pédagogique principal.
- `design/module-3-sota-research-synthesis.md` — synthèse SOTA pour l'itération learning design.
- `reference/module-3-verification-journal.md` — journal de vérification participant.

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
