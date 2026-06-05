import { Component, signal } from '@angular/core';
import { ExchangeRateTableComponent } from '../components/exchange-rate-table/exchange-rate-table';

@Component({
    selector: 'app-root',
    imports: [ExchangeRateTableComponent],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected readonly title = signal('ExchangeRate');
}
