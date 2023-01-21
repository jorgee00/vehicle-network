import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Header } from '../../models/header';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() header:Header={pageTitle:""};
  @Output() actionLeft = new EventEmitter<void>();
  @Output() actionRight = new EventEmitter<void>();
  constructor(){}
}
