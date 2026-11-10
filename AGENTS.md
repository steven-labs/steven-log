# Steven Log

- Read README.md before editing. Use npm and preserve package-lock.json.
- Site URL is https://steven-log.home201.com. No Vercel deployment.
- Keep the design minimal and text-first with sky-blue accents and accessible dark text.
- Content belongs to Steven: do not publish invented first-person opinions as his writing.
- Draft posts must never appear in production output, RSS or sitemap.
- Run npm run build before committing changes.
- Infrastructure is steven-labs/infra. Steven Log uses its own Deployment/Service/Ingress in the home201 namespace, managed by the home201 ArgoCD Application; edit only the steven-log image entry in that prod overlay.
- Giscus is installed and Discussions enabled on this public repository. Public IDs live in src/config/giscus.ts. Never put access tokens into PUBLIC_ variables.
- CI allows main pushes, same-repository PRs targeting main, and manual main runs. Fork PR jobs must be skipped. Do not use pull_request_target or pass deployment secrets to PR builds.
