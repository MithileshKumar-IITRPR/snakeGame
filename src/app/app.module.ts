import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';
import { ScoreBoardComponent } from './score-board/score-board.component';
import { HttpInterceptorInterceptor } from './auth/http-interceptor.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GameComponent,
    ScoreBoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
