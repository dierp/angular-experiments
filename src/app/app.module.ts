import { BrowserModule } from '@angular/platform-browser'
import { NgModule, ErrorHandler } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ErrorHandling } from './globals/error-handler'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorHandling
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
