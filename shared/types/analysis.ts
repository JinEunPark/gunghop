export interface WealthSynergy {
  rating: number
  description: string
}

export interface AnalysisResult {
  overall_score: number
  face_shape_compatibility: string
  wealth_synergy: WealthSynergy
  overall_vibe: string
  personality_compatibility: string
  in_law_relationship: string
  children_fortune: string
  health_compatibility: string
  three_year_prediction: string
  warnings: string[]
  positives: string[]
}

export type AnalyzeErrorCode = 'NO_FACE' | 'RATE_LIMIT' | 'AI_ERROR' | 'BAD_REQUEST'

export interface AnalyzeErrorBody {
  error: AnalyzeErrorCode
  message: string
}
