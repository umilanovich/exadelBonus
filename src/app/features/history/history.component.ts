import { Component, OnDestroy, OnInit } from '@angular/core';
import { IBonus } from '@interfaces/bonus.interface';
import { IHistoryBonus } from '@interfaces/history.interface';
import { HistoryService } from '@services/history.service';
import { LoginService } from '@services/login.service';
import { Subscription } from 'rxjs';
import { BonusComponent } from 'src/app/shared/components/bonus-list-container/bonus/bonus.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit, OnDestroy {
  public subscription: Subscription = new Subscription();
  public historyBonuses: IHistoryBonus[] = [];
  public bonusHistory: IHistoryBonus;
  public bonuses: IBonus[] = [];
  public bonusButtonLabel = 'Rate';

  constructor(private historyService: HistoryService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.getBonuses();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public getBonuses(): void {
    this.loginService.getUser().subscribe((data) => {
      this.subscription.add(
        this.historyService.getHistoryBonuses(data.id).subscribe((bonuses) => {
          this.historyBonuses = bonuses;
          this.bonuses = bonuses.map((item) => item.bonusDto);
        }),
      );
    });
  }

  public rateBonus(historyId: string, estimate: number): void {
    this.subscription.add(this.historyService.rateBonus(historyId, estimate).subscribe());
  }

  public openRateBonusForm(bonus: BonusComponent): void {
    this.bonusHistory = this.historyBonuses.find((item) => item.bonusDto.id === bonus.bonus.id);
    bonus.isForm = !bonus.isForm;
  }
}
