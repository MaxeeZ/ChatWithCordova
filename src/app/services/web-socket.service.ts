import { Injectable  } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable()
export class WebSocketService {

  // Our socket connection
  private socket;
  private message: string;

  constructor() { }

  connect() {

    if (this.socket == null) {
      this.socket = io(environment.ws_url);
      this.message = "La connexion a été établie !";
      this.socket.emit('connecte', this.message);
    }
      return this.socket;
    }


  emit(eventMess: string, donnee: any) {
    return this.socket.emit(eventMess, donnee);
  }

  on(eventMess: string, donnee: any) {
    return this.socket.on(eventMess, donnee);
  }

}