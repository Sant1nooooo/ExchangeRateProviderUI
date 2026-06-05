import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
    catchError,
    filter,
    map,
    Observable,
    of,
    shareReplay,
    startWith,
    Subject,
    switchMap,
} from 'rxjs';
import { IExchangeRate, IExchangeRateResponse } from '../../models/ExchangeRateResponse.model';
import { ExchangeRateAPIService } from '../../services/exchange-rate-api.service';
import { LoadingComponent } from '../loading/loading';

const LOADING = 'LOADING' as const;
type LoadingState = typeof LOADING;
const ERROR = 'ERROR' as const;
type ErrorState = { type: typeof ERROR; message: string };
type ResponseState = IExchangeRateResponse | LoadingState | ErrorState;

const isLoading = (s: ResponseState): s is LoadingState => s === LOADING;
const isError = (s: ResponseState): s is ErrorState =>
    typeof s === 'object' && 'type' in s && s.type === ERROR;
const isData = (s: ResponseState): s is IExchangeRateResponse => !isLoading(s) && !isError(s);

@Component({
    selector: 'app-exchange-rate-table',
    imports: [ReactiveFormsModule, AsyncPipe, LoadingComponent],
    templateUrl: './exchange-rate-table.html',
    styleUrl: './exchange-rate-table.css',
})
export class ExchangeRateTableComponent {
    service = inject(ExchangeRateAPIService);
    selectedDate = new FormControl<string>('');
    showErrorMessage: boolean = false;
    private fetchTrigger$ = new Subject<string>();

    private response$: Observable<ResponseState> = this.fetchTrigger$.pipe(
        switchMap((date) =>
            this.service.getExchangeRates(date).pipe(
                startWith(LOADING),
                catchError((err) => {
                    const message = err?.error ?? err?.message ?? 'An unknown error occurred.';
                    return of({ type: ERROR, message } as ErrorState);
                }),
            ),
        ),
        shareReplay(1),
    );
    loading$: Observable<boolean> = this.response$.pipe(map(isLoading));

    errorMessage$: Observable<string | null> = this.response$.pipe(
        map((s) => (isError(s) ? s.message : null)),
    );
    rates$: Observable<IExchangeRate[] | null> = this.response$.pipe(
        map((s) => (isData(s) ? s.rates : null)),
    );
    validity$: Observable<string | null> = this.response$.pipe(
        map((s) => (isData(s) ? s.validFor : null)),
    );
    noOfCurrencies$: Observable<number | null> = this.response$.pipe(
        map((s) => (isData(s) ? s.rates.length : null)),
    );

    async getExchangeRates() {
        if (this.selectedDate.value === '') {
            alert('Please select a date.');
            return;
        }
        const date = this.selectedDate.value ?? '';
        this.fetchTrigger$.next(date);
    }
    async assignDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        this.selectedDate.setValue(today);
        this.fetchTrigger$.next(today);
    }
}
