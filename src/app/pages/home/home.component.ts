import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/services/home.service';
import { Subscription, forkJoin } from 'rxjs';
import { IChatPreview } from 'src/app/shared/models/chat.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  chats!: any;
  chatsOriginal!: IChatPreview[];
  chatSelecionado!: any;
  pronto = false;
  parametro: any;
  private subs = new Subscription();

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.getChats();
    this.getParametro();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private getChats() {
    this.subs.add(
      this.homeService.getChats().subscribe({
        next: (res: any) => {
          let temp: any = [];
          this.chats = res.Items.map((item: any) => {
            temp.push(this.homeService.getChatById(item.id));
            return {
              id: item.id,
              telefone: item.telefone,
              mensagens: [],
              nome: '',
              toggle: false,
              status: item.status,
            };
          });

          forkJoin(temp).subscribe({
            next: (value: any) => {
              let temp = this.chats.map((chat: any, index: number) => {
                return {
                  ...chat,
                  mensagens: [...value[index].data.reverse()],
                };
              });
              this.chats = temp;
              this.getClientes();
            },
          });
        },
        error: (err: unknown) => {
          console.log(err);
        },
      })
    );
  }

  private getClientes() {
    this.subs.add(
      this.homeService.getClientes().subscribe({
        next: (value: any) => {

          this.chats.forEach((chat: any) => {
            const cliente = value.Items.find(
              (item: any) => item.telefone === chat.telefone
            );
            chat.nome = cliente?.nome;
            chat.toggle = cliente?.modo_assistente;
          });
          this.chatsOriginal = [...this.chats];
          this.chats = this.chatsOriginal.filter(
            (chat: any) => chat.status.toUpperCase() != 'ARQUIVADO'
          );
          this.chatSelecionado = this.chats[0];

          this.pronto = true;
        },
      })
    );
  }

  private getParametro() {
    this.subs.add(
      this.homeService.getParametro().subscribe({
        next: (value: any) => {
          this.parametro = value.Items[0];
        },
      })
    );
  }

  public filter(event: any) {
    if (event.target.value.length === 0) {
      this.chats = this.chatsOriginal;
    }
    this.chats = this.chatsOriginal.filter((chat: any) =>
      chat.nome.toUpperCase().includes(event.target.value.toUpperCase())
    );
  }
}
