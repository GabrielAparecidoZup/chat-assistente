import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/services/home.service';
import { Subscription } from 'rxjs';
import { IChatPreview } from 'src/app/shared/models/chat.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  chats!: IChatPreview[];

  chatId: number = 1;
  private subs = new Subscription();

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.getChats();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private getChats() {
    this.subs.add(
      this.homeService.getChats().subscribe({
        next: (res: IChatPreview[]) => {
          this.chats = res;
        },
        error: (err: unknown) => {
          console.log(err);
        },
      })
    );
  }
}
