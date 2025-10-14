/**
 * MEARA Dashboard Data Types
 * TypeScript definitions matching dashboard_schema.json contract
 */

export type ImpactLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type EffortLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type DimensionRating = 'EXCEPTIONAL' | 'COMPETENT' | 'NEEDS_IMPROVEMENT' | 'CRITICAL_GAP';
export type SeverityLevel = 'CRITICAL' | 'HIGH';

export interface CompanyInfo {
  name: string;
  url: string;
}

export interface AnalysisMetadata {
  analysis_date: string; // ISO 8601 date
  analysis_job_id: string;
  total_time_seconds?: number;
}

export interface Recommendation {
  id: string;
  title: string;
  summary?: string;
  impact: ImpactLevel;
  effort: EffortLevel;
  roi_score?: number; // 0-10
  quick_win: boolean;
  category: string; // Dimension name
  why?: string; // Strategic rationale
  what?: string; // Specific actions
  how?: string[]; // Implementation steps
  expected_outcome?: string;
  supporting_evidence_ids?: string[];
}

export interface CriticalIssue {
  title: string;
  severity: SeverityLevel;
  business_impact: string;
  affected_dimensions?: string[];
}

export interface ExecutiveSummary {
  top_recommendations: Recommendation[];
  critical_issues: CriticalIssue[];
  overall_verdict?: string;
}

export interface Evidence {
  finding: string;
  source: string;
}

export interface SubElement {
  name: string;
  rating: string;
  assessment: string;
}

export interface Dimension {
  name: string;
  score: number; // 0-100
  rating: DimensionRating;
  summary?: string;
  strengths?: string[];
  opportunities?: string[];
  evidence?: Evidence[];
  sub_elements?: Record<string, SubElement>;
}

export interface RootCause {
  id: string;
  title: string;
  description: string;
  affected_dimensions: string[];
  supporting_evidence?: string[];
  business_implications?: string;
}

export interface RecommendationsByPriority {
  quick_wins?: Recommendation[];
  strategic_initiatives?: Recommendation[];
  minor_fixes?: Recommendation[];
  deprioritized?: Recommendation[];
}

export interface ImplementationPhase {
  name: string;
  duration: string;
  goal: string;
  key_initiatives?: string[];
}

export interface ImplementationRoadmap {
  phases?: ImplementationPhase[];
}

/**
 * Main Dashboard Data Structure
 * This is what the /api/analysis/dashboard/{id} endpoint returns
 */
export interface DashboardData {
  company_info: CompanyInfo;
  analysis_metadata: AnalysisMetadata;
  executive_summary: ExecutiveSummary;
  dimensions: Record<string, Dimension>;
  root_causes: RootCause[];
  recommendations: RecommendationsByPriority;
  implementation_roadmap?: ImplementationRoadmap;
}

/**
 * Utility type for dimension keys
 */
export type DimensionKey =
  | 'market_positioning'
  | 'buyer_journey'
  | 'market_presence'
  | 'audience_clarity'
  | 'digital_experience'
  | 'competitive_positioning'
  | 'brand_consistency'
  | 'analytics_measurement'
  | 'ai_authenticity';

/**
 * Helper function to get rating color
 */
export function getRatingColor(rating: DimensionRating): string {
  switch (rating) {
    case 'EXCEPTIONAL':
      return '#0d71a9'; // Scale VP blue
    case 'COMPETENT':
      return '#7da399'; // Sage green
    case 'NEEDS_IMPROVEMENT':
      return '#e5a819'; // Gold (warning)
    case 'CRITICAL_GAP':
      return '#dc2626'; // Red (critical)
  }
}

/**
 * Helper function to get impact color
 */
export function getImpactColor(impact: ImpactLevel): string {
  switch (impact) {
    case 'CRITICAL':
      return '#dc2626'; // Red
    case 'HIGH':
      return '#ea580c'; // Orange
    case 'MEDIUM':
      return '#e5a819'; // Gold
    case 'LOW':
      return '#7da399'; // Sage green
  }
}

/**
 * Helper function to calculate ROI score if not provided
 * Formula: (Impact weight - Effort cost) normalized to 0-10
 */
export function calculateROIScore(impact: ImpactLevel, effort: EffortLevel): number {
  const impactWeights: Record<ImpactLevel, number> = {
    CRITICAL: 10,
    HIGH: 7,
    MEDIUM: 4,
    LOW: 2,
  };

  const effortCosts: Record<EffortLevel, number> = {
    HIGH: 8,
    MEDIUM: 4,
    LOW: 1,
  };

  const raw = impactWeights[impact] - effortCosts[effort];
  // Normalize to 0-10 scale
  return Math.max(0, Math.min(10, (raw + 8) / 2));
}
