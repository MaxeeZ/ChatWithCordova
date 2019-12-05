import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class PseudoService {

  socket: any;

  pseudo: string;
  pseudoSubject = new Subject();
  pseudoSubscription: Subscription;
  
  userNameList: any;
  userNameListSubscription;
  userNameListSubject = new Subject();

  nbUser: any;
  nbUserSubscription: Subscription;
  nbUserSubject = new Subject();

  constructor(private ws: WebSocketService, private logService: LogService) {

    this.socket = ws.connect();

    this.pseudoSubscription = this.getPseudo().subscribe( (data: string) => {
      this.pseudo = data;
      this.emitPseudoSubject();
    })

    this.userNameListSubscription = this.getUserNameList().subscribe( (data) => {
      this.userNameList = data;
      this.emitUserNameListSubject();
    }) 

    this.nbUserSubscription = this.getUserCount().subscribe( (data) => {
      this.nbUser = data;
      this.emitNbUserSubject();
    })
  
  }

  public getPseudo() {
    this.logService.createLogDebug("Pseudo.Service.ts: getPseudo() -> Pseudo client returned from server");
    let observable = new Observable<string> (observer => {
      this.socket.on('pseudo', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  public getUserCount() {
    this.logService.createLogDebug("Pseudo.Service.ts: getUserCount() -> Number of users returned from server");
    let observable = new Observable (observer => {
      this.socket.on('NbUser', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  public getUserNameList() {
    this.logService.createLogDebug("Pseudo.Service.ts: getUserNameList() -> Number of connected users returned from server");
    let observable = new Observable (observer => {
      this.socket.on('UserNameList', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }


  emitPseudoSubject() {
    this.pseudoSubject.next(this.pseudo);
    this.logService.createLogDebug("Pseudo.Service.ts: emitPseudoSubject() -> Send pseudo to components requested");
  }

  emitUserNameListSubject() {
    this.userNameListSubject.next(this.userNameList.slice());
    var info ="";
    this.userNameList.forEach( row => {
      info += row.toString() + " ";
    });
    this.logService.createLogDebug("Pseudo.Service.ts: emitUserNameListSubject() -> Send list of connected users");
  }

  emitNbUserSubject() {
    this.nbUserSubject.next(this.nbUser);
    this.logService.createLogDebug("Pseudo.Service.ts: emitNbUserListSubject() -> Send number of connected users: " + this.nbUser);
  }

}
