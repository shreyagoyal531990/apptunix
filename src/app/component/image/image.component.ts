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
  @Input() index: any;
  @Output() new_image_added = new EventEmitter();
  uploadPercent: any;
  downloadURL: any;

  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore
  ) { }
  delete(item) {
    if (item) {
      var self = this;
      const filePath = 'apputnixPhoto/' + item['id'];

      self.storage.ref(filePath).delete().subscribe(async (data) => {
        try {
          // var data={ image:image.filter(e=>e.item_id!=item_id) }
          console.log("Image deleted successfully", data)
          await self.afs.collection('images').doc('123')
            .update({
              image: firebase.firestore.FieldValue.arrayRemove({
                id: item.id,
                image_path: item.image_path

              })
            })
          console.log("Item deleted successfully")
        }


        catch (error) {
          console.log("Error to delete", error)
        }

      })
    }

  }
  ngAfterViewInit() {
    console.log("***index*****", this.index)
  }
  ngOnInit() { }
  gotImage(event) {
    var self = this;
    console.log("image_selected", event)
    const id = Math.random().toString(36).substring(2);

    const file = event.target["files"][0];
    const filePath = 'apputnixPhoto/' + id;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file)
    task.then(async (data) => {
      ref.getDownloadURL().subscribe(async (data) => {
        console.log("self.downloadURL", data)

        self.downloadURL = data
        console.log("self.image_url", self.image_url)
        if (!self.image_url) {
          console.log("not of self.image_url")
          try {
            await self.afs.collection('images').doc('123')
              .set({
                image: firebase.firestore.FieldValue.arrayUnion({
                  id: id,
                  image_path: self.downloadURL
                })
              },
                { merge: true })
          }
          catch (error) {
            console.log("Error while uplaoding image", error)
          }
        }
        else {
          console.log("presence of image_url")
          // const booking = { some: "data" };
          var db = firebase.firestore()
          const imageRef = db.collection("images").doc('123');

          db.runTransaction((transaction: any) => {
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(imageRef).then(doc => {
              if (!doc.data().image) {
                console.log("Image object is not present")
                transaction.set({
                  image: firebase.firestore.FieldValue.arrayUnion({
                    id: id,
                    image_path: self.downloadURL

                  })
                })
              } else {
                console.log("entered iamge presence")
                var images: any;
                images = doc.data().image;
                var new_array = images.map((e) => {
                  console.log("enterd checking field")
                  if (e.id == self.image_url.id) {
                    return {
                      id: id,
                      image_path: self.downloadURL
                    }
                  }
                })
                console.log("Updated array about to inserted", [...new_array])
                transaction.update(imageRef, { image: [...new_array] });
              }
            });
          }).then(function () {
            console.log("Transaction successfully committed!");
          }).catch(function (error) {
            console.log("Transaction failed: ", error);
          });
          // await self.afs.collection('images').doc('123').update({
          //   image: firebase.firestore.FieldValue.arrayUnion({
          //     id: id,
          //     image_path: self.downloadURL

          //   })
          // })

        }

        // submitted_data?console.log("submitted successfully"):console.log("not submitted successfully")
        // self.image_added.emit(self.downloadURL)

      })
        , ((error) => {
          console.log("Error while downloading image", error)

        })
    })
      .catch((error) => {
        console.log("Error of task is", error)
      })

    //       console.log("data after  finalizing the build",data)
    //       console.log("data after url is downloaded",self.downloadURL)
    // self.afs.collection('images').doc('123').set({image:firebase.firestore.FieldValue.arrayUnion(self.downloadURL)},{merge:true})
    //       self.image_added.emit(self.downloadURL)

    //     })
  }

}
