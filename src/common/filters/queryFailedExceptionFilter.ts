import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { config } from '../config';

const dupKeyRegex = /^duplicate key value violates unique constraint/;
const violatesFKRegec = /violates foreign key constraint/;

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    if (dupKeyRegex.test(exception.message)) {
      response
        .status(HttpStatus.BAD_REQUEST)
        .json(this.buildDuplicateErrorMessage(exception, request));
    } else if (violatesFKRegec.test(exception.message)) {
      response.status(HttpStatus.BAD_REQUEST).json({
        path: request.url,
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
        message: 'Violates foreign key constraint.',
        code: config.errorCodes.VIO_FK,
      });
    } else {
      response.status(HttpStatus.BAD_REQUEST).json({
        path: request.url,
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
        message: 'Unknown error.',
        code: config.errorCodes.UNK_ERR,
      });
    }
  }

  private buildDuplicateErrorMessage(
    exception: QueryFailedError,
    request: any,
  ) {
    // Strings have the following structure "Key (<<attribute>>)=(<<value>>) already exists."
    // This regex captures the attribute and the value.
    const regex = /\((.*?)\)=\((.*?)\)/;
    const matches = exception.driverError.detail.match(regex);
    const attribute = matches[1];
    const value = matches[2];
    return {
      path: request.url,
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      code: config.errorCodes.DUP_KEY,
      data: {
        attribute,
        value,
        table: exception.driverError.table,
      },
    };
  }
}
