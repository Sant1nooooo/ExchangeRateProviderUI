export interface IExchangeRate {
    amount: number;
    country: string;
    currency: string;
    currencyCode: string;
    order: number;
    rate: number;
    validFor: string;
}

export interface IExchangeRateResponse {
    validFor: string;
    rates: IExchangeRate[];
}
