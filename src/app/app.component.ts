import { Component, OnInit, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { PseudoComponent } from './components/pseudo/pseudo.component';
import { WebSocketService } from './services/web-socket.service';
import { ChatmessService } from './services/chatmess.service';
import { ServerStateService } from './services/server-state.service';
import { PseudoService } from './services/pseudo.service';
import { LogService } from './services/log.service';
import { LocalizeService } from './services/localize.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'TodoManager';
  dialogBool: boolean = true;
  
  chatEnable: boolean;
  chatEnableSubscription: Subscription;

  statusOffline: string = "";
  statusOfflineSubscription: Subscription;
  statusBool: boolean = false;

  statusOnline: string = "";
  statusOnlineSubscription: Subscription;

  pseudo: string = "";
  pseudoSubcription: Subscription;

  language: string;
  languageSubscription: Subscription;

  constructor(private socket: WebSocketService,
              private dialog: MatDialog,
              public snackBar: MatSnackBar,
              private cms: ChatmessService,
              private sss: ServerStateService,
              private pss: PseudoService,
              private logService: LogService,
              private translate: TranslateService,
              private lcls: LocalizeService
  ) {
    this.translate.setDefaultLang('fr');
    this.translate.addLangs(['en', 'fr']);
    
   }
 
  ngOnInit() {

    var device;

    document.addEventListener('deviceready', function() {
      alert(device.platform);
    }, false);
    
    this.logService.createLogInfo("Web Application Start !");
    this.logService.createLogDebug("App.Component.ts: ngOnInit() -> Begin !");

    this.socket.connect();
    this.logService.createLogDebug("Web-socket.service.ts: connect() -> Socket created and connected");

    if (this.dialogBool) {
      this.openDialog();
      this.dialogBool = false;
    }

    this.chatEnableSubscription = this.cms.chatEnableSubject.subscribe( bool => {
      this.chatEnable = bool;

      if (bool) {
        let x = document.querySelector("#chatComponent");
        if (x){
          x.scrollIntoView();
        }
      }

      this.logService.createLogInfo("Get value display of chat");
      this.logService.createLogDebug("App.Component.ts: chatEnableSubscription -> Get value display");
    });

    this.cms.emitChatEnableSubject();

    this.statusOfflineSubscription = this.sss.statusOfflineSubject.subscribe ( (data: string) => {
      this.statusOffline = data;
      if (status != null) {
        if(!this.statusBool) {
          this.openSnackBar();
          this.statusBool = true;
        }
      }
    });

    this.statusOnlineSubscription = this.sss.statusOnlineSubject.subscribe ( (data: string) => {
      this.statusOnline = data;
      if (status != null) {
        if(this.statusBool) {
          this.closeSnackBar();
          this.statusBool = false;
        }
      }
    });

    this.pseudoSubcription = this.pss.pseudoSubject.subscribe( (data: string) => {
      this.pseudo = data;
      this.logService.createLogInfo("Get pseudo");
      this.logService.createLogDebug("App.Component.ts: PseudoSubscription -> Get pseudo: " + data);
    });

    this.languageSubscription = this.lcls.languageSubject.subscribe( (data: string) => {
      this.language = data;
      this.translate.use(this.language);
    })
    this.lcls.emitLanguageSubject();

  }

  openSnackBar() {
    Promise.resolve().then(() => {
      this.translate.get('COMPONENT.APP.ERRORSERVER').subscribe((result: string) => {
        this.snackBar.open(result);
      });

      this.logService.createLogWarn('No server connected !');
      this.logService.createLogDebug('App.Component.ts: No server connected !');
    });
  }

  closeSnackBar() {
    this.snackBar.dismiss();
    this.logService.createLogDebug('App.Component.ts: Server connected !');
  }

  openDialog(): void {

    try {
      this.logService.createLogDebug("App.Component.ts: openDialog() -> Open modal box for pseudo <PseudoComponent>");

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "30%";

      Promise.resolve().then(() => {
      const dialogRef = this.dialog.open(
          PseudoComponent,
          { data: { name: "" }, disableClose: true });
      });
    
    } catch (e) {
      this.logService.createLogError("Can't open modal box <PseudoComponent>");
      this.logService.createLogDebug("App.Component.ts: OpenDialog() -> Error when try to open modal box for pseudo: " + e);
    }

  }

  ngOnDestroy() {
    this.logService.createLogInfo("Web Application End !");
    this.logService.createLogDebug("App.component.ts: ngOnDestroy() -> Unsubscribed of subscriptions");

    this.chatEnableSubscription.unsubscribe();
    this.statusOfflineSubscription.unsubscribe();
    this.statusOnlineSubscription.unsubscribe();
    this.pseudoSubcription.unsubscribe();
  }
}
