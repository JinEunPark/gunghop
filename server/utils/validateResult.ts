import type { AnalysisResult } from '../../shared/types/analysis'

type ValidationResult =
  | { valid: true; data: AnalysisResult }
  | { valid: false; error: string }

export function validateResult(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, error: 'Not an object' }
  }
  const r = raw as Record<string, unknown>

  if (r.error === 'NO_FACE') {
    return { valid: false, error: 'NO_FACE' }
  }

  const stringFields = [
    'face_shape_compatibility',
    'overall_vibe',
    'personality_compatibility',
    'in_law_relationship',
    'children_fortune',
    'health_compatibility',
    'three_year_prediction'
  ] as const

  for (const f of stringFields) {
    const v = r[f]
    if (typeof v !== 'string' || !v.trim()) {
      return { valid: false, error: `Invalid ${f}` }
    }
  }

  if (typeof r.overall_score !== 'number' || r.overall_score < 0 || r.overall_score > 100) {
    return { valid: false, error: 'Invalid overall_score' }
  }

  const ws = r.wealth_synergy as { rating?: unknown; description?: unknown } | undefined
  if (
    !ws ||
    typeof ws !== 'object' ||
    typeof ws.rating !== 'number' ||
    ws.rating < 1 ||
    ws.rating > 5 ||
    typeof ws.description !== 'string' ||
    !ws.description.trim()
  ) {
    return { valid: false, error: 'Invalid wealth_synergy' }
  }

  if (!Array.isArray(r.warnings) || r.warnings.length < 1 || !r.warnings.every((x) => typeof x === 'string' && x.trim())) {
    return { valid: false, error: 'Invalid warnings' }
  }
  if (!Array.isArray(r.positives) || r.positives.length < 1 || !r.positives.every((x) => typeof x === 'string' && x.trim())) {
    return { valid: false, error: 'Invalid positives' }
  }

  return { valid: true, data: r as unknown as AnalysisResult }
}
