import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { PortfolioService } from '../../core/services/portfolio.service';
import * as PortfolioActions from './portfolio.actions';

@Injectable()
export class PortfolioEffects {
  private readonly actions$ = inject(Actions);
  private readonly portfolioService = inject(PortfolioService);

  loadPortfolio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.loadPortfolio),
      switchMap(() =>
        this.portfolioService.getSummary().pipe(
          map((summary) => PortfolioActions.loadPortfolioSuccess({ summary })),
          catchError((err) =>
            of(PortfolioActions.loadPortfolioFailure({ error: err?.error?.message ?? 'Failed to load portfolio' }))
          )
        )
      )
    )
  );

  addStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.addStock),
      switchMap(({ request }) =>
        this.portfolioService.addStock(request).pipe(
          map(() => PortfolioActions.addStockSuccess()),
          catchError((err) =>
            of(PortfolioActions.addStockFailure({ error: err?.error?.message ?? 'Failed to add stock' }))
          )
        )
      )
    )
  );

  addInvestment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.addInvestment),
      switchMap(({ request }) =>
        this.portfolioService.addInvestment(request).pipe(
          map(() => PortfolioActions.addInvestmentSuccess()),
          catchError((err) =>
            of(PortfolioActions.addInvestmentFailure({ error: err?.error?.message ?? 'Failed to add investment' }))
          )
        )
      )
    )
  );

  deleteStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.deleteStock),
      switchMap(({ stockId }) =>
        this.portfolioService.deleteStock(stockId).pipe(
          map(() => PortfolioActions.deleteStockSuccess({ stockId })),
          catchError((err) =>
            of(PortfolioActions.deleteStockFailure({ error: err?.error?.message ?? 'Failed to delete stock' }))
          )
        )
      )
    )
  );

  refreshAfterMutation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PortfolioActions.addStockSuccess,
        PortfolioActions.addInvestmentSuccess,
        PortfolioActions.deleteStockSuccess
      ),
      map(() => PortfolioActions.loadPortfolio())
    )
  );
}
