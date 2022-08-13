import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ExampleEmailComponent} from "./example-email/example-email.component";

const routes: Routes = [
  {path: 'example-email/:id', component: ExampleEmailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
