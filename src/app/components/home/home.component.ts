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
      let new_user = {id: new_id, name: new_name, last_name: new_last_name, email: new_email};
      this.contact.push(new_user);//запись нового контакта
      localStorage.setItem('contact', JSON.stringify(this.contact));
      this.modal_view = false;
    }
    else{
      let new_id = 1;
      let new_name = event.target.name.value;
      let new_last_name = event.target.last_name.value;
      let new_email = event.target.email.value;
      let new_user = {id: new_id, name: new_name, last_name: new_last_name, email: new_email};
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

}
