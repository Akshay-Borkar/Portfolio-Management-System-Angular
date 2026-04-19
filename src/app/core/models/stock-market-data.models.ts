export interface StockMarketDataDto {
  currency: string;
  symbol: string;
  exchangeName: string;
  fullExchangeName: string;
  regularMarketPrice: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  longName: string;
  shortName: string;
  previousClose: number;
}

export interface OhlcvBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartInterval {
  label: string;
  interval: string;
  range: string;
}

export const CHART_INTERVALS: ChartInterval[] = [
  { label: '1D',  interval: '5m',  range: '1d'  },
  { label: '5D',  interval: '15m', range: '5d'  },
  { label: '1M',  interval: '1d',  range: '1mo' },
  { label: '3M',  interval: '1d',  range: '3mo' },
];

export interface LivePriceUpdate {
  symbol: string;
  price: number;
}
