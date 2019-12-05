import { Injectable } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { WebSocketService } from './web-socket.service';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class ServerStateService {

  socket: any;
  
  statusOfflineSubscription: Subscription;
  statusOffline: string = "";
  statusOfflineSubject = new Subject();

  statusOnlineSubscription: Subscription;
  statusOnline: string = "";
  statusOnlineSubject = new Subject();


  constructor(private ws: WebSocketService, private logService: LogService) {

    this.socket = this.ws.connect();

    this.statusOfflineSubscription = this.getServerOffline().subscribe( data => {
      this.statusOffline = data;
      this.emitStatusOfflineSubject();
    })

    this.statusOnlineSubscription = this.getServerOnline().subscribe( data => {
      this.statusOnline = data;
      this.emitStatusOnlineSubject();
    })

  }

  public getServerOffline() {
    this.logService.createLogDebug("Server-state.service.ts: getServerOffline() -> server state returned from server");
    let observable = new Observable<string> (observer => {
      this.socket.on('connect_error', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  public getServerOnline() {
    this.logService.createLogDebug("Server-state.service.ts: getServerOnline() -> server state returned from server");
    let observable = new Observable<string> (observer => {
      this.socket.on('connect', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  emitStatusOfflineSubject() {
    this.statusOfflineSubject.next(this.statusOffline);
    this.logService.createLogDebug("Server-state.service.ts: emitStatusOfflineSubject() -> send info that server is offline");
    
  }

  emitStatusOnlineSubject() {
    this.statusOnlineSubject.next(this.statusOnline);
    this.logService.createLogDebug("Server-state.service.ts: emitStatusOnlineSubject() -> send info that server is online");
  }

}
