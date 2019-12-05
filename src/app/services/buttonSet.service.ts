import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { LogService } from './log.service';

@Injectable()
export class ButtonViewService implements OnInit {
    
    private buttonView = true;

    buttonSubject = new Subject<boolean>();
    
    constructor(private logService: LogService) {
    }

    ngOnInit() {
    }

    emitButtonSubject() {
        this.buttonSubject.next(this.buttonView);
        this.logService.createLogDebug("ButtonSet.service.ts: emitButtonSubject() -> Send button state: " + this.buttonView);
    }

    updateBT(i: boolean) {
        this.logService.createLogDebug("ButtonSet.service.ts: updateBT(i: boolean) -> update back button in the menu");
        this.buttonView = i;
        this.emitButtonSubject();
    }

}