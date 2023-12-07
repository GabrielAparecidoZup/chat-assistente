import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/services/home.service';
import { Subscription } from 'rxjs';
import { IChat, IChatPreview } from 'src/app/shared/models/chat.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  chats!: IChatPreview[];
  chatsOriginal!: IChatPreview[];

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
          this.chatsOriginal = res;
        },
        error: (err: unknown) => {
          console.log(err);
        },
      })
    );
  }

  public filter(event: any) {
    if (event.target.value.length === 0) {
      this.chats = this.chatsOriginal;
    }
    this.chats = this.chatsOriginal.filter((chat: IChatPreview) =>
      chat.name.includes(event.target.value)
    );
  }
}
