import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatButtonModule, MatCardModule,
   MatBadgeModule, MatFormFieldModule, MatTableModule, MatInputModule, MatCheckboxModule, MatOptionModule,
   MatSelectModule, MatSortModule, MatSnackBarModule, MatMenuModule, MatDialogModule, MatToolbarModule
  } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MdePopoverModule } from '@material-extended/mde';

import { ToDoService } from './services/todo.service';
import { WebSocketService } from './services/web-socket.service';
import { ButtonViewService } from './services/buttonSet.service';
import { ChatmessService } from './services/chatmess.service';
import { LogService } from './services/log.service';
import { ElectronService } from './providers/electron.service';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';


import { WebviewDirective } from './directives/webview.directive';

import { FourOhFourComponent } from './components/four-oh-four/four-oh-four.component';
import { EditToDoComponent } from './components/edit-to-do/edit-to-do.component';
import { MenuComponent } from './components/menu/menu.component';
import { PseudoComponent } from './components/pseudo/pseudo.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatMessComponent } from './components/chat-mess/chat-mess.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AppComponent } from './app.component';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import { ToDoComponent } from './components/to-do/to-do.component';

import { HomeComponent } from './components/home/home.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}



@NgModule({
  declarations: [
    HomeComponent,
    WebviewDirective,
    AppComponent,
    ChatComponent,
    ChatMessComponent,
    EditToDoComponent,
    FourOhFourComponent,
    MenuComponent,
    PseudoComponent,
    ToDoComponent, 
    ToDoListComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatOptionModule,
    MdePopoverModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    ReactiveFormsModule,
    LoggerModule.forRoot({serverLoggingUrl: 'api/logs', level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.ERROR, disableConsoleLogging: true}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ButtonViewService,
    ChatmessService,
    ElectronService,
    LogService,
    // MyLoggerMonitor,
    ToDoService,
    WebSocketService],
  bootstrap: [AppComponent],
  entryComponents: [PseudoComponent]
})
export class AppModule { }
