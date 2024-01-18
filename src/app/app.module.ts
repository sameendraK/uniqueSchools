import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ngxCsv } from 'ngx-csv';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // CryptoModule
  ],
  providers: [
    CryptoKey,
    // ngxCsv
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
