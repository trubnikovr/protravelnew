# ProTravel Horizon design system

ProTravel Horizon is a light-first administrative theme with an optional dark
mode. It uses cool neutral surfaces, indigo as the primary action color and
cyan as a travel accent. Success, warning and destructive meanings must use
semantic tokens rather than feature-owned colors.

Theme values are centralized in:

- `src/app/styles/theme.css` — colors, radius and shadows;
- `src/app/styles/typography.css` — font stack and rendering;
- `src/app/styles/globals.css` — Tailwind mappings and global behavior.

Feature code must consume semantic utilities such as `bg-background`,
`bg-card`, `text-muted-foreground` and `text-destructive`. Do not add arbitrary
brand hex values inside screens.

Reusable primitives belong to `src/shared/ui`. They follow the shadcn model:
the source is owned by this repository and can be adapted without wrapping a
third-party visual theme.
