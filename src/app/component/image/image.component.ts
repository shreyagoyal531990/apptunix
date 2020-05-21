import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';
@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  @Input() image_url: any;
  // @Output() image_added = new EventEmitter();
  uploadPercent: any;
  downloadURL: any;

  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore
  ) { }
  delete(item){
    if(item){
      var self=this;
      const filePath = 'apputnixPhoto/'+item['id'];
  
      self.storage.ref(filePath).delete().subscribe(async(data)=>{
        try{
          // var data={ image:image.filter(e=>e.item_id!=item_id) }
          console.log("Image deleted successfully",data)
          await self.afs.collection('images').doc('123')
          .update({image:firebase.firestore.FieldValue.arrayRemove({
            id:item.id,
            image_path:item.image_path
  
          })})
          console.log("Item deleted successfully")
        }
  
        
        catch(error){
          console.log("Error to delete",error)
        }
    
    })
    }
  
}
  ngOnInit() { }
  gotImage(event) {
    var self = this;
    console.log("image_selected", event)
    const id = Math.random().toString(36).substring(2);

    const file = event.target["files"][0];
    const filePath = 'apputnixPhoto/'+id;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file)

    // observe percentage changes
    task.percentageChanges().subscribe((data) => {
      this.uploadPercent = data
      console.log("    this.uploadPercent", this.uploadPercent)
      if (self.uploadPercent == 100) {
        ref.getDownloadURL().subscribe(async (data) => {
          console.log("self.downloadURL", data)

          self.downloadURL = data
          await self.afs.collection('images').doc('123')
            .set({ image: firebase.firestore.FieldValue.arrayUnion({id:id,image_path:self.downloadURL}) }, { merge: true })
            // submitted_data?console.log("submitted successfully"):console.log("not submitted successfully")
          // self.image_added.emit(self.downloadURL)

        })
          , ((error) => {
            console.log("Error while downloading image", error)
          })
      }

    }, (error) => {
      console.log("Error on uploading image", error)
    })
    // ref.getDownloadURL().subscribe((data)=>{
    //   console.log("self.downloadURL",data)

    //   self.downloadURL =data
    // })
    // get notified when the download URL is available
    //     task.snapshotChanges().pipe(
    //         finalize(() => {
    //           self.downloadURL = ref.getDownloadURL()
    //           console.log("self.downloadURL",self.downloadURL)

    //         }
    //          )
    //      )
    //     .subscribe((data)=>{
    //       console.log("data after  finalizing the build",data)
    //       console.log("data after url is downloaded",self.downloadURL)
    // self.afs.collection('images').doc('123').set({image:firebase.firestore.FieldValue.arrayUnion(self.downloadURL)},{merge:true})
    //       self.image_added.emit(self.downloadURL)

    //     })
  }

}
