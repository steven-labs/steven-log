// Public Giscus identifiers, not credentials. Environment overrides are optional.
export const giscus = {
  repo: import.meta.env.PUBLIC_GISCUS_REPO || 'steven-labs/steven-log',
  repoId: import.meta.env.PUBLIC_GISCUS_REPO_ID || 'R_kgDOVpPZoA',
  category: import.meta.env.PUBLIC_GISCUS_CATEGORY || 'Announcements',
  categoryId: import.meta.env.PUBLIC_GISCUS_CATEGORY_ID || 'DIC_kwDOVpPZoM4DK2Uh',
};
