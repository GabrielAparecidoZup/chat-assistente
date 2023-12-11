import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/services/home.service';
import { Subscription, forkJoin } from 'rxjs';
import { IChatPreview } from 'src/app/shared/models/chat.model';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  chats: any = [];
  chatsOriginal!: IChatPreview[];
  chatSelecionado!: any;
  pronto = false;
  parametro: any;
  private subs = new Subscription();

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.getClientes();
    this.getParametro();
    this.createSocket();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private createSocket() {
    const socket = io('http://ec2-44-203-190-75.compute-1.amazonaws.com:8081/');

    socket.on('mensagem_criada', (value: any) => {
      this.updateChat(value.data);
    });
  }

  private updateChat(value: any) {
    const index = this.chats.findIndex(
      (chat: any) => chat.telefone === value.telefone
    );
    if (index != -1) {
      this.chats[index].mensagens.push({
        role: value.role,
        content: [
          {
            text: {
              value: value.conteudo,
            },
          },
        ],
      });
    } else {
      this.chats.push({
        nome: value.nome,
        toggle: true,
        telefone: value.telefone,
        mensagens: [
          {
            content: [
              {
                text: {
                  value: value.conteudo,
                },
              },
            ],
            role: 'user',
          },
        ],
      });
    }
  }

  private getClientes() {
    this.subs.add(
      this.homeService.getClientes().subscribe({
        next: (value: any) => {
          value.Items.forEach((cliente: any) => {
            this.chats.push({
              nome: cliente.nome,
              toggle: cliente.modo_assistente,
              telefone: cliente.telefone,
              mensagens: [],
            });
          });
          this.getAllThreads();
          // this.chats.forEach((chat: any) => {
          //   const cliente = value.Items.find(
          //     (item: any) => item.telefone === chat.telefone
          //   );
          //   chat.nome = cliente?.nome;
          //   chat.toggle = cliente.modo_assistente;
          // });
          // this.chatsOriginal = [...this.chats];
          // this.chats = this.chatsOriginal.filter(
          //   (chat: any) => chat.status.toUpperCase() != 'ARQUIVADO'
          // );
        },
      })
    );
  }

  private getAllThreads() {
    this.subs.add(
      this.homeService.getAllThreads().subscribe({
        next: (value: any) => {
          this.chats.forEach((cliente: any) => {
            let temp: any = [];
            const threadArray = value.Items.filter(
              (execucao: any) => execucao.telefone === cliente.telefone
            )
              .map((temp: any) => {
                return {
                  created_at: temp.created_at,
                  thread_id: temp.thread_id,
                  telefone: temp.telefone,
                };
              })
              .sort((a: any, b: any) => {
                return a.created_at < b.created_at
                  ? -1
                  : a.created_at > b.created_at
                  ? 1
                  : 0;
              });

            threadArray.forEach((thread: any) => {
              temp.push(this.homeService.getChatById(thread.thread_id));
            });

            if (threadArray.length > 0)
              forkJoin(temp).subscribe({
                next: (value: any) => {
                  value.forEach((thread: any) => {
                    const temp = thread?.data?.reverse();
                    if (temp.length > 0) cliente.mensagens.push(...temp);
                  });
                },
              });
          });
          this.chatsOriginal = [...this.chats];
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
