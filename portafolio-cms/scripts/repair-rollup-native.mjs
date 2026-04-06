/**
 * Repara instalaciones donde @rollup/rollup-win32-x64-msvc solo tiene el .node
 * (p. ej. OneDrive o bloqueos de archivos) y falta package.json, por eso Node no resuelve el módulo.
 */
import { existsSync, readdirSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

function inferVersionFromPath(pkgDir) {
  const m = pkgDir.replace(/\\/g, "/").match(/rollup-win32-x64-msvc@(\d+\.\d+\.\d+)/)
  return m ? m[1] : null
}

function repairDir(pkgDir) {
  const nodeFile = join(pkgDir, "rollup.win32-x64-msvc.node")
  const pkgJsonPath = join(pkgDir, "package.json")
  if (!existsSync(nodeFile) || existsSync(pkgJsonPath)) return false

  const version = inferVersionFromPath(pkgDir) || "4.59.0"
  const meta = {
    name: "@rollup/rollup-win32-x64-msvc",
    version,
    description: "Native bindings for Rollup",
    license: "MIT",
    main: "./rollup.win32-x64-msvc.node",
    os: ["win32"],
    cpu: ["x64"],
  }
  writeFileSync(pkgJsonPath, `${JSON.stringify(meta, null, 2)}\n`, "utf8")
  console.warn(
    `[repair-rollup-native] Se escribió package.json faltante en:\n  ${pkgDir}\n  (revisa sync de OneDrive/antivirus si vuelve a ocurrir)`,
  )
  return true
}

function collectTargets() {
  const out = []
  const direct = join(root, "node_modules", "@rollup", "rollup-win32-x64-msvc")
  if (existsSync(direct)) out.push(direct)

  const pnpmDir = join(root, "node_modules", ".pnpm")
  if (!existsSync(pnpmDir)) return out

  for (const entry of readdirSync(pnpmDir)) {
    if (!entry.includes("rollup-win32-x64-msvc@")) continue
    const candidate = join(
      pnpmDir,
      entry,
      "node_modules",
      "@rollup",
      "rollup-win32-x64-msvc",
    )
    if (existsSync(candidate)) out.push(candidate)
  }
  return out
}

if (process.platform !== "win32") {
  process.exit(0)
}

let fixed = false
for (const dir of collectTargets()) {
  if (repairDir(dir)) fixed = true
}

if (fixed) {
  console.warn(
    "[repair-rollup-native] Si pnpm dev sigue fallando, cierra el IDE, pausa OneDrive y ejecuta: pnpm install",
  )
}
