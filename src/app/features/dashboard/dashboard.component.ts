import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { SharedModule } from '../../shared/modules/shared.module';
import { selectAllSectors, selectSectorsLoading } from '../../store/stock-sector/stock-sector.selectors';
import { loadSectors } from '../../store/stock-sector/stock-sector.actions';
import { selectCurrentUser } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(Store);

  readonly currentUser$ = this.store.select(selectCurrentUser);
  readonly sectorCount$ = this.store.select(selectAllSectors).pipe(map((s) => s.length));
  readonly sectorsLoading$ = this.store.select(selectSectorsLoading);

  ngOnInit(): void {
    this.store.dispatch(loadSectors());
  }
}
