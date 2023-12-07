import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { HomeService } from 'src/app/core/services/home.service';
import { IChat } from 'src/app/shared/models/chat.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnChanges, OnDestroy {
  @Input() chatId!: number;

  myId: number = 354;
  chat!: IChat;
  private subs = new Subscription();

  constructor(private homeService: HomeService) {}

  ngOnChanges(): void {
    if (this.chatId) this.getChat();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private getChat() {
    this.subs.add(
      this.homeService.getChatById(this.chatId).subscribe({
        next: (res: any) => {
          this.chat = res;
          this.scrollEndChat();
          console.log(this.chat);
        },
        error: (e: unknown) => {
          console.log(e);
        },
      })
    );
  }

  private scrollEndChat(timer: number = 250) {
    setTimeout(() => {
      const chat = document.getElementById('chat') as HTMLDivElement;
      chat.scrollTo({
        left: 0,
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }, timer);
  }

  public autoResize() {
    const sendMsg = document.getElementById('send-msg') as HTMLTextAreaElement;
    sendMsg.style.height = '5px';
    sendMsg.style.height = sendMsg.scrollHeight + 'px';
  }

  public sendMsg(message: any) {
    this.chat.conversation.push({
      idClient: 354,
      name: 'Alexandra B. L.',
      message: message.value,
      type: 'employee',
    });
    message.value = '';
    this.scrollEndChat();
    const sendMsg = document.getElementById('send-msg') as HTMLTextAreaElement;
    sendMsg.style.height = '40px';
  }

  public addClientMsg() {
    this.chat.conversation.push({
      idClient: 235,
      name: 'Valquiria R. V.',
      message: 'Cliente',
      type: 'client',
    });
    this.scrollEndChat();
  }

  public addBotMsg() {
    this.chat.conversation.push({
      idClient: 125,
      name: 'Alexandra Assistente',
      message: 'assistente',
      type: 'assistant',
    });
    this.scrollEndChat();
  }
}
