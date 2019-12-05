import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat-mess',
  templateUrl: './chat-mess.component.html',
  styleUrls: ['./chat-mess.component.scss']
})
export class ChatMessComponent implements OnInit {

  @Input() message;
  @Input() emetteur;
  @Input() id;
  @Input() priorite;
  @Input() connect;

  constructor() { }

  ngOnInit() {
  }

}
