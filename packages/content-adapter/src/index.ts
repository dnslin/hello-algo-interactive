import type {
  AlgorithmContentManifest,
  LanguageCodeManifest,
  SemanticCodeAnchorMap,
} from './types.js';

export * from './types.js';
export * from './manifests/bubble-sort.js';

export function getAnchorLineSpan(
  manifest: LanguageCodeManifest,
  anchor: string
): [number, number] | undefined {
  return manifest.anchors[anchor];
}

export function validateCodeAnchorMap(
  anchors: SemanticCodeAnchorMap,
  code: string
): boolean {
  const lineCount = code.split('\n').length;
  for (const [, span] of Object.entries(anchors)) {
    const [start, end] = span;
    if (start < 1 || end < start || end > lineCount) {
      return false;
    }
  }
  return true;
}

export function createContentManifest(
  manifest: AlgorithmContentManifest
): AlgorithmContentManifest {
  for (const [lang, codeManifest] of Object.entries(manifest.codeManifests)) {
    if (codeManifest && !validateCodeAnchorMap(codeManifest.anchors, codeManifest.code)) {
      throw new Error(
        `Invalid semantic code anchor spans in manifest for language: ${lang}`
      );
    }
  }
  return manifest;
}
