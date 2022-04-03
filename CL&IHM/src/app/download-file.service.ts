import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TodoList } from './todolist.service';

@Injectable({
  providedIn: 'root'
})


export class DownloadFileService {

  constructor(public httpClient :HttpClient,public datepipe: DatePipe) { }

  //doesnt work
  downloadFILE(url:string){
    return this.httpClient.get(url)
  }

  dowloadList(list:TodoList){
    const toDownload=JSON.stringify(list)
    let element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(toDownload));
    let date=new Date()
    let latest_date =this.datepipe.transform(date,'M/d/yy, h:mm a');
    element.setAttribute('download', list.label+"_"+latest_date+"_file.json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); // simulate click
    document.body.removeChild(element);
  }
}
