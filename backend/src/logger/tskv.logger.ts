import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const parts = [
      `level=${level}`,
      `message=${String(message).replace(/\t/g, '')}`,
    ];

    if (optionalParams.length > 0) {
      parts.push(`optional=${JSON.stringify(optionalParams)}`);
    }

    return parts.join('\t');
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  fatal(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('fatal', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
