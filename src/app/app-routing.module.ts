import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HomeComponent} from './components/home/home.component';
import {ContactComponent} from "./components/contact/contact.component";


const routes: Routes = [
  { path: 'home',   component: HomeComponent},
  { path: 'contact/:id', component: ContactComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})

export class AppRoutingModule { }
