import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NGXLogger, NGXLoggerMonitor, NGXLogInterface } from 'ngx-logger';
import { WebSocketService } from './web-socket.service';


@Injectable({
  providedIn: 'root'
})

export class LogService {
  
  pseudo: string;

  static LoggerMonitor = class implements NGXLoggerMonitor {

    socket: any;

    constructor(private ws: WebSocketService) {
      this.socket = this.ws.connect();
    }

    onLog(log: NGXLogInterface) {

      var Level = ["TRACE", "DEBUG", "INFO", "LOG", "WARN", "ERROR", "FATAL", "OFF"];
      var LogTimestamp = new DatePipe("en-US").transform(new Date(), 'yyyy-MM-dd hh:mm:ss a');
      var LogLevel = Level[log.level];
      var logstr = "[" + LogTimestamp + "] || " + LogLevel + " || LOG: " + log.message;

      var logData = [LogTimestamp, LogLevel, log.message];
      this.sendLog(logData);
      // Call webservice to set in file
      // TODO
    }

    sendLog(log: string[]) {
      this.socket.emit('log', log);
    }

  }

  constructor(private logger: NGXLogger, private ws: WebSocketService) {

    this.logger.registerMonitor(new LogService.LoggerMonitor(ws));

  }

  createLogTrace(str: string): void {
    this.logger.trace(str);
  }

  createLogDebug(str: string): void {
    this.logger.debug(str);
  }

  createLogInfo(str: string): void {
    this.logger.info(str);
  }

  createLogWarn(str: string): void {
    this.logger.warn(str)
  }

  createLogError(str: string): void {
    this.logger.error(str);
  }

  createLogFatal(str: string): void {
    this.logger.fatal(str);
  }
  
}
