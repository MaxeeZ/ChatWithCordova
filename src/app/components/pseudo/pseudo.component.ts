import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NgForm } from '@angular/forms';
import { WebSocketService } from '../../services/web-socket.service';
import { ChatMess } from '../../models/ChatMess.model';
import { LogService } from '../../services/log.service';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-pseudo',
  templateUrl: './pseudo.component.html',
  styleUrls: ['./pseudo.component.scss']
})
export class PseudoComponent implements OnInit {

  private socket;

  constructor(
              public dialogRef: MatDialogRef<PseudoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private ws: WebSocketService,
              private logService: LogService,
              private translate: TranslateService
  ) {}

  ngOnInit(){
    this.socket = this.ws.connect();
  }

  onSubmit(form: NgForm) {
    
    try {
      
      this.socket.emit('nouveau_client', form.value['newpseudo']);
      const chatM = new ChatMess();
      chatM.emetteur = form.value['newpseudo'];
      
      this.socket.emit("connectChat");
      
      this.logService.createLogInfo("New client connected");
      this.logService.createLogDebug("PseudoComponent: onSubmit() -> " + chatM.emetteur + " Send pseudo of the new client");
      
      this.dialogRef.close();

      this.logService.createLogDebug("PseudoComponent.ts: onSubmit() -> Close the modal box for pseudo");
    
    } catch (e) {
      this.logService.createLogError("Can't send pseudo via modal box");
      this.logService.createLogDebug("PseudoComponent.ts: onSubmit() -> Send Pseudo Error: " + e);
    }

  }

}
