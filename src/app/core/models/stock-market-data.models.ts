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

export interface LivePriceUpdate {
  symbol: string;
  price: number;
}
