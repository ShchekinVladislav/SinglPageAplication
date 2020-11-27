import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MainService} from "../../service/main.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  public id_contact;
  public contact;
  public contact_item;
  public required = false;
  public success = false;

  constructor(private http: HttpClient, private router: Router, public service: MainService, public route: ActivatedRoute) {
    if(!localStorage.session){//авторизован ли пользователь
      this.router.navigate(['']);
    }
    this.contact = JSON.parse(localStorage.contact);
      this.route.params.subscribe(params => {
        this.id_contact = params['id'];
      });
      let index = 0;
      for (var i = 0; i < this.contact.length; i++) {

        if(+this.contact[i].id === +this.id_contact){
          this.contact_item = this.contact[i];
          console.log(this.contact[i]);
        }
        else index++;
      }
      if (+index === this.contact.length){
        this.router.navigate(['/home']);
      }
  }

  ngOnInit(): void {
  }
  rename(event){
    this.required = false;
    for (var i = 0; i < this.contact.length; i++) {
      if(+this.contact[i]['id'] === +this.id_contact){
        let name = event.target.name.value;
        let last_name = event.target.last_name.value;
        let email = event.target.email.value;
        if(name === "" || last_name === "" || email === ""){
          this.required = true;
          return;
        }
        this.success = true;
        this.contact[i] = {id: this.contact[i]['id'], name: name, last_name: last_name, email: email};
      }
    }
    console.log(typeof this.contact);
    localStorage.setItem('contact', JSON.stringify(this.contact));
  }

}
