export function materialPathFromSegments(segments: readonly string[]): string {
  return segments.join("/");
}

export function materialPathCandidates(segments: readonly string[]): readonly string[] {
  const literal = materialPathFromSegments(segments);
  try {
    const decoded = segments.map((segment) => decodeURIComponent(segment)).join("/");
    return decoded === literal ? [literal] : [literal, decoded];
  } catch {
    return [literal];
  }
}
