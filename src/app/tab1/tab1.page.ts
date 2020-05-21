import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

// import { AngularFirestore } from '@angular/fire/firestore/firestore';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public all_images: any = [];
  constructor(
    private afs: AngularFirestore

  ) {
    this.all_images = ["", "", "", "", "", ""]
  }
 async ngOnInit() {
    var self = this;
   self.afs.collection('images').doc('123').valueChanges().subscribe((data)=>{
      console.log("Images obtained ",data)
      if(data){
        self.all_images.forEach((element,index)=>{
          self.all_images[index]=data['image'][index]
  
        })
      }

     
      console.log("self.all_images",self.all_images)
    },(error)=>{
      console.log("Error while retrieving data from cloud firestore",error)
    })

    // console.log("this.afs",this.afs)
    // self.afs.collection('images').doc('123').get().subscribe((data) => {
    //   self.all_images.forEach((element, index) => {
    //     console.log((data));
        
    //     // if (element == "") {
    //     //   self.all_images[index] = data
    //     //   return
    //     // }

    //     // else {
    //     //   self.all_images[0] = data
    //     // }
    //   });
    // })
  }
  addImageToArray(e) {
    console.log("event", e)
    var self = this;
    this.all_images.forEach((element, index) => {
      element == '' ? self.all_images[index] : ""
    });
  }
}
