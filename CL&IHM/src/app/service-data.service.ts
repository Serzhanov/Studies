import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class ServiceDataService {
  public serviceData:string | undefined;
  constructor() { }
}
