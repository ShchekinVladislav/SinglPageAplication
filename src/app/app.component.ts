import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MainService} from './service/main.service';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'SPA';
  public session = true;
  public menu;
  public required;
  public error;
  public user: any;
  public contact;

  constructor(private http: HttpClient, private router: Router, public service: MainService, public route: ActivatedRoute) {
    this.menu = true;

    if(!localStorage.user){
      this.user = service.getUser();
    }
    else this.user = JSON.parse(localStorage.user);
  }

  ngOnInit(): void {
    if(!localStorage.session){//авторизован ли пользователь
      this.menu = false;
      this.router.navigate(['']);
    }
    else{
      this.session =  localStorage.session;
      this.menu = true;
    }
    if (!localStorage.contact){
      this.http.get('assets/db.json').subscribe(data => {
        this.contact = JSON.stringify(data);
        localStorage.setItem('contact', this.contact);
      });
    }
  }

  loginup(event: any){

    this.required = false;
    this.error = false;
    this.user = this.service.getUser();
    let login = event.target.login.value;
    let password = event.target.password.value;
    if(login === "" || password === ""){
      this.required = true;
      console.log('Пустая форма');
    }
    else {
      for (var i = 0; i < this.user.length; i++) {
        if (login === this.user[i]['login'] && password === this.user[i]['password']){
          localStorage.setItem('session', JSON.stringify(this.session));
          this.menu = true;
          this.router.navigate(['/home']);
        }
        else{
          this.error = true;
          console.log('Логин и пароль не верный');
        }
      }
    }
  }

  logout(){
    localStorage.removeItem('session');
    this.menu = false;
  }

}
