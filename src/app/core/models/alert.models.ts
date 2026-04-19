export interface AlertDTO {
  id: string;
  ticker: string;
  condition: 'Above' | 'Below';
  targetPrice: number;
  isTriggered: boolean;
  dateCreated: string;
}

export interface CreateAlertRequest {
  ticker: string;
  condition: string;
  targetPrice: number;
}

export interface AlertState {
  alerts: AlertDTO[];
  loading: boolean;
  error: string | null;
}
