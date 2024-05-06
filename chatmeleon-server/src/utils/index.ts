export function parseCorsOrigin(value: string | undefined) {
  if (value === undefined) return;

  const origins = value.split(",");

  if (origins.length <= 1) {
    return origins[0];
  }

  return origins;
}
