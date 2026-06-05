import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IExchangeRateResponse } from '../models/ExchangeRateResponse.model';
import { environment } from '../environment';

@Injectable({
    providedIn: 'root',
})
export class ExchangeRateAPIService {
    private http = inject(HttpClient);

    getExchangeRates(date: string): Observable<IExchangeRateResponse> {
        return this.http.get<IExchangeRateResponse>(`${environment.apiUrl}`, {
            params: { date },
        });
    }
}
