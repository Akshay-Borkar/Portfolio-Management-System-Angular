export interface PortfolioReview {
  reviewId: string;
  userId: string;
  newsSummary: string;
  riskAnalysis: string;
  weeklyRecommendation: string;
  generatedAt: string;
}

export interface RunReviewRequest {
  tickers: string[];
}

export interface RunReviewResponse {
  reviewId: string;
  generatedAt: string;
  message: string;
}
