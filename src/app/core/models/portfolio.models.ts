export interface PortfolioHoldingDTO {
  stockId: string;
  ticker: string;
  stockName: string;
  sectorName: string;
  quantity: number;
  avgBuyingPrice: number;
  currentPrice: number;
  investedAmount: number;
  currentValue: number;
  pnL: number;
  pnLPercent: number;
}

export interface SectorAllocationDTO {
  sectorName: string;
  investedAmount: number;
  allocationPercent: number;
}

export interface PortfolioSummaryDTO {
  totalInvested: number;
  currentValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  holdings: PortfolioHoldingDTO[];
  sectorAllocations: SectorAllocationDTO[];
}

export interface AddStockRequest {
  ticker: string;
  stockName: string;
  stockPE: number | null;
  stockSectorId: string;
}

export interface AddInvestmentRequest {
  stockId: string;
  investedAmount: number;
  buyingPrice: number;
  investmentDate: string;
}

export interface InvestmentHistoryDTO {
  id: string;
  investedAmount: number;
  buyingPrice: number;
  quantity: number;
  investmentDate: string;
}

export interface PortfolioState {
  summary: PortfolioSummaryDTO | null;
  loading: boolean;
  error: string | null;
}
