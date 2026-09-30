/**
 * Locale- and ICU-independent path order.
 *
 * `localeCompare` depends on the host locale and ICU build, so the same commit
 * can order accented Portuguese paths differently on a pt-BR developer machine
 * and a CI container, changing the generated `catalog.json` bytes. Comparing
 * UTF-16 code units is the same everywhere, so the build output is
 * byte-deterministic for an identical commit.
 */
export function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
