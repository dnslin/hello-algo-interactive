export type SupportedLanguage =
  | 'typescript'
  | 'go'
  | 'rust'
  | 'python'
  | 'cpp'
  | 'java';

export type SemanticCodeAnchorMap = Record<string, [number, number]>;

export interface LanguageCodeManifest {
  language: SupportedLanguage;
  code: string;
  anchors: SemanticCodeAnchorMap;
}

export interface ComplexityEstimate {
  time: string;
  space: string;
}

export interface ContentAttribution {
  source: 'Hello-Algo';
  license: 'CC BY-NC-SA 4.0';
  chapterUrl?: string;
}

export interface AlgorithmContentManifest {
  algorithmId: string;
  chapterTitle: string;
  summary: string;
  complexity: ComplexityEstimate;
  codeManifests: Partial<Record<SupportedLanguage, LanguageCodeManifest>>;
  attribution: ContentAttribution;
}
