import { DownloadFileService } from './../download-file.service';
import { TodoItem } from './../todolist.service';
import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodoItemComponent implements OnInit {
  break:boolean=false;
  @Input() todoitem:TodoItem | any;
  @Output() update =new EventEmitter<Partial<TodoItem>>();
  @Output() remove = new EventEmitter<TodoItem>();
  private _isEditing=false;

  baseApiUrl = "https://file.io" //basic api
  shortLink: string |undefined;
  file: File | undefined ; // Variable to store file
  image:string | ArrayBuffer|null|undefined;

  constructor(public download:DownloadFileService) {}

  ngOnInit(): void {}

  delete(){
    this.break=true;
    this.remove.emit(this.todoitem);
  }

  update_this(){
    this.todoitem.isDone=!this.todoitem.isDone
    this.update.emit(this.todoitem);
  }

  get isEditing():boolean{
    return this._isEditing;
  }

  set isEditing(e:boolean){
    this._isEditing=e;
  }

  changeLabel(label:string):void{
    this.todoitem.label=label
    this.update.emit(this.todoitem)
    this.isEditing=false;
  }


  upload(file:File|undefined):Observable<any> {

    // Create form data
    const formData = new FormData();
    if(file)
    // Store form name as "file" with file data
    formData.append("file", file, file.name);
    // Make http post request over api
    // with formData as req
    return this.download.httpClient.post(this.baseApiUrl, formData)
}
onChange(event:any) {

    // On file Select
  this.file = event.target.files[0];
  if(this.file)
  if (this.file.type.match(/image\/*/) != null) {
      const reader = new FileReader();
      reader.readAsDataURL(this.file)
      console.log(reader)
      reader.onload=async (event)=>{
        this.image=reader.result
        await this.addDoc().then(
          (val)=>{this.todoitem.linkForFile=val
            this.update.emit(this.todoitem)
          },
          (err)=>console.log(err))
        //we cannot stroe the file type into firebase thats why I decided just to store the link of its file.
        //this.todoitem.f=this.file
      }
  }
}
  async addDoc(){
    // OnClick of button Upload
    return new Promise((res,err)=>{
      this.upload(this.file).subscribe(
        (event: any) => {
            if (typeof (event) === 'object') {
                // Short link via api response
                this.shortLink = event.link;
                res(this.shortLink)
              }
            else
              err("got a error")
            });
          })
        }

  //Doesnt work
  //Api doesnt proceed CROSS PERMISSION "Access-Control-Allow-Headers"
  downloadFile(){
    if(this.shortLink)
      this.download.downloadFILE(this.shortLink).subscribe(response=>{
        console.log(response)
        let a =document.createElement('a')
        if(this.shortLink)
        a.href=this.shortLink
        a.download='download'
        a.click()
      })
  }
}
