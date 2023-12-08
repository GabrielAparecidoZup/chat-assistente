import { Component, Input, Output } from '@angular/core';
import { IChatPreview } from 'src/app/shared/models/chat.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() chat!: any;
}
