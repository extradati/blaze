// Block pnpm/yarn: the project is locked with package-lock.json and Metro dislikes other node_modules layouts.
const ua = process.env.npm_config_user_agent ?? "";
if (!ua.startsWith("npm/")) {
  console.error("\nThis project uses npm. Run `npm ci` (not pnpm/yarn). See README.md.\n");
  process.exit(1);
}
