import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FootballerDatabaseComponent } from './components/footballer-database/footballer-database.component';
import { CreateFootballerComponent } from './components/create-footballer/create-footballer.component';
import { EditFootballerComponent } from './components/edit-footballer/edit-footballer.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'database', component: FootballerDatabaseComponent },
  { path: 'create', component: CreateFootballerComponent },
  { path: 'edit/:id', component: EditFootballerComponent },
  { path: '**', redirectTo: '' }
];