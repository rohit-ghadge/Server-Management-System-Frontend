import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';

@Injectable({ providedIn: 'root' })
export class ServerService
 {
  private readonly apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // get All Servers
  servers$ = <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUrl}/server/list`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  // save server
  save$ = (server: Server) => <Observable<CustomResponse>>
    this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  // Ping by ip address
  ping$ = (ipAddress: string) => <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddress}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  // filter by server status- take status and response and response with updated message and data status
  filter$ = (status: Status, response: CustomResponse) => <Observable<CustomResponse>>
    new Observable<CustomResponse>(
      suscriber => {
        console.log(response);
        suscriber.next(
          
          status === Status.ALL ? { ...response, message: `Servers filtered by ${status} status` } :
            {
              ...response,
                         message: 
                                response.data.servers.filter(server => server.status === status).length > 0  ?                             
                               `Servers filtered by ${status === Status.SERVER_UP ? 'SERVER UP': 'SERVER DOWN'} 
                                status` : `No servers of ${status} found`,
                         data:
                              {
                               servers: response.data.servers
                              .filter(server => server.status === status)
                              }
            }
            
           /*
           response => {

            if(status == "ALL") 
            {
               return {...response, message: `Servers filtered by ${status} status`} ;
            }
            if(status == "SERVER_UP") 
            {
              return {...response, message: `Servers filtered by ${status} status` };
            }
            if(status == "SERVER_DOWN") 
            {
              return {...response, message: `Servers filtered by ${status} status` };

            } */      
          
        );
        suscriber.complete();
      }
    )
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

   // delete by serverId
  delete$ = (serverId: number) => <Observable<CustomResponse>>
    this.http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );


  // Error Handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occurred - Error code: ${error.status}`);
  }
}
