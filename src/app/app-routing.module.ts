import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FourOhFourComponent } from './components/four-oh-four/four-oh-four.component';
import { EditToDoComponent } from './components/edit-to-do/edit-to-do.component';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';

const routes: Routes = [
    { path: 'tasks', component: ToDoListComponent },
    { path: 'create', component: EditToDoComponent },
    { path: 'update/:id', component: EditToDoComponent },
    { path: '', component: ToDoListComponent }, // essentiel pour éviter qu'un refresh fasse planter l'application
    { path: 'not-found', component: FourOhFourComponent },
    { path: '**', redirectTo: 'not-found' } // wildcard
  ];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
