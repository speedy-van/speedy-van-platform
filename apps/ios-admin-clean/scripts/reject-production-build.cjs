console.error(
  "[ios-admin-clean] Refusing EAS production build: this root shares the SpeedyVan Admin bundle/EAS identity but is not the authoritative release app."
);
console.error("[ios-admin-clean] Build from apps/ios-admin after running npm run preflight -w apps/ios-admin.");
process.exit(1);
