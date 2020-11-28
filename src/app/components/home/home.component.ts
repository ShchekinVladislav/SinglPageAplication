import { Component, OnInit } from '@angular/core';
import {MainService} from '../../service/main.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public contact;
  public error_lenght = false;
  public modal_view = false;
  public required = false;
  public result_search = [];
  public search_error = false;
  public filer_favorites_value = false;
  public old_search = [];
  public selectedFile;
  public imgURL;



  constructor(private http: HttpClient,private router: Router, public service: MainService) {

    if(!localStorage.session){//авторизован ли пользователь
      this.router.navigate(['']);
    }
    this.contact = JSON.parse(localStorage.contact); //парсинг JSON-а

    if (this.contact.length === 0){//проверка на наличие контактов
      this.error_lenght = true;
    }
  }

  ngOnInit(): void {
  }

  search(){
    this.search_error = false;
    this.result_search = [];
   let res = ((document.getElementById(`qwery`) as HTMLTextAreaElement).value).toLowerCase();
   if(res.match(/^\s*$/)){
   return;
   }
   if(res === ""){
     return;
   }
    for (var i = 0; i < this.contact.length; i++) {//поиск контактов
      let str = res.length;
      if(this.contact[i]['name'].substring(0, str).toLowerCase() === res){
        this.result_search.push(this.contact[i]);
        continue;
      }
      if(this.contact[i]['last_name'].substring(0, str).toLowerCase() === res){
        this.result_search.push(this.contact[i]);
        continue;
      }
      if(this.contact[i]['email'].substring(0, str).toLowerCase() === res){
        this.result_search.push(this.contact[i]);
      }
    }
    if(this.result_search.length === 0){
      this.search_error = true;
    }
  }
  open_contact(id){
    this.router.navigate([`/contact/${id}`]);
  }
  open_modal(){
    this.modal_view = true;
  }
  closed_modal(){
    this.modal_view = false;
  }
  add(event){//создание нового контакта
    this.required = false;
    if(this.contact.length > 0){
      let last_id = this.contact.length -1;
      let new_id = this.contact[last_id]['id'] + 1;
      let new_name = event.target.name.value;
      let new_last_name = event.target.last_name.value;
      let new_email = event.target.email.value;
      if(new_name === "" || new_last_name === "" || new_email === ""){
        this.required = true;
        return;
      }
      let new_user;
      if(this.imgURL){
         new_user = {id: new_id, name: new_name, last_name: new_last_name, email: new_email, avatar: this.imgURL, favorites: false};
      }
      else{
        new_user = {id: new_id, name: new_name, last_name: new_last_name, email: new_email, avatar: '', favorites: false};
      }
      this.contact.push(new_user);//запись нового контакта
      localStorage.setItem('contact', JSON.stringify(this.contact));
      this.modal_view = false;
    }
    else{
      let new_id = 1;
      let new_name = event.target.name.value;
      let new_last_name = event.target.last_name.value;
      let new_email = event.target.email.value;
      let new_user;
      if(this.imgURL){
        new_user = {id: new_id, name: new_name, last_name: new_last_name, email: new_email, avatar: this.imgURL, favorites: false};
      }
      else{
        new_user = {id: new_id, name: new_name, last_name: new_last_name, email: new_email, avatar: '', favorites: false};
      }
      this.contact.push(new_user);//запись нового контакта
      localStorage.setItem('contact', JSON.stringify(this.contact));
      this.modal_view = false;
    }
    this.error_lenght = false;
  }
  del_contact(id){//удаление контакта
    if(this.result_search.length){
      for (var b = 0; b < this.result_search.length; b++) {//поиск удаляемого контакта
        if(this.result_search[b]['id'] === id){
          this.result_search.splice(i,1);
        }
      }
    }
    for (var i = 0; i < this.contact.length; i++) {//поиск удаляемого контакта
      if(this.contact[i]['id'] === id){
        this.contact.splice(i,1);
      }
    }
    if (this.contact.length === 0){//проверка на наличие контактов
      this.error_lenght = true;
    }
    localStorage.setItem('contact', JSON.stringify(this.contact)); //перезапись данных в localstorage
  }

  favorites(id){

    if(this.result_search.length > 0 && this.filer_favorites_value === true){ //при активном поиске и фильтре на избранном
      console.log('Избранное')
      for (var q = 0; q < this.result_search.length; q++) {
        if(this.result_search[q]['id'] === id){
          if(this.result_search[q]['favorites'] === true){
            this.result_search.splice(q,1);
          }
        }
      }
      console.log(this.result_search);
    }
    if(this.result_search.length < 0){ //при активном поиске
      for (var c = 0; c < this.result_search.length; c++) {
        if(this.result_search[c]['id'] === id){
            if(this.result_search[c]['favorites'] === true){
              this.result_search[c]['favorites'] = false;
            }
            else if (this.result_search[c]['favorites'] === false){
              this.result_search[c]['favorites'] = true;
            }
        }
      }
      console.log(this.result_search);
    }
    if( this.filer_favorites_value === true){
      let array = [];
      array = JSON.parse(localStorage.contact);
      for (var i = 0; i < array.length; i++) {
        if(array[i]['id'] === id){
          array[i]['favorites'] = false;
        }
      }
      localStorage.setItem('contact', JSON.stringify(array));
      for (var f = 0; f < this.contact.length; f++) {
        if(this.contact[f]['id'] === id){
          this.contact.splice(f, 1);
        }
      }
      return;
    }
    else{
      for (var b = 0; b < this.contact.length; b++) {
        if(this.contact[b]['id'] === id){
          if(this.contact[b]['favorites'] === true){
            this.contact[b]['favorites'] = false;
          }
          else this.contact[b]['favorites'] = true;
        }
      }
      localStorage.setItem('contact', JSON.stringify(this.contact));  //перезапись данных в localstorage
    }
  }
  filer_favorites(){
    if(this.filer_favorites_value === true){
      this.filer_favorites_value = false;
      if(this.result_search.length > 0){
        console.log(this.old_search);
        this.result_search = this.old_search;
      }
      this.contact = JSON.parse(localStorage.contact);
    }
    else{
      this.filer_favorites_value = true;
      let array = [];
      for (var i = 0; i < this.contact.length; i++) {
        if(this.contact[i]['favorites'] === true){
          array.push(this.contact[i]);
        }
      }
      if(this.result_search.length > 0) {
        this.old_search = this.result_search;
        let new_result_search = [];
        for (var q = 0; q < this.result_search.length; q++) {
          if(this.result_search[q]['favorites'] === true){
            new_result_search.push(this.result_search[q]);
          }
        }
        this.result_search = new_result_search;
        console.log(this.old_search);
      }
      this.contact = array;
    }

  }

  compressImage(src, newX, newY) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, newX, newY);
        const data = ctx.canvas.toDataURL();
        res(data);
      };
      img.onerror = error => rej(error);
    });
  }
  upload_avatar(event){
    this.selectedFile =  event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL( event.target.files[0]);
    reader.onload = (event2) => {
      this.imgURL = reader.result;
      this.compressImage(this.imgURL, 400, 400).then(compressed => {
        this.imgURL = compressed;
      });
    };
  }


}
