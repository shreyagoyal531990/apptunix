import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreModule } from '@angular/fire/firestore';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(),
     AppRoutingModule,
     AngularFireModule.initializeApp({
      apiKey: "AIzaSyA7n7GYvzOUj5ry9F1LrJwrGpWrE5pnqvo",
      authDomain: "apptunix-801eb.firebaseapp.com",
      databaseURL: "https://apptunix-801eb.firebaseio.com",
      projectId: "apptunix-801eb",
      storageBucket: "apptunix-801eb.appspot.com",
      messagingSenderId: "886475794199",
      appId: "1:886475794199:web:bda6dbf5c57082d56c7952",
      measurementId: "G-FT1C7Z4LSF"
    }),
    AngularFireStorageModule,
     AngularFirestoreModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
