import { MessagePayload, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { Unsubscribe } from "firebase/messaging";

//SECTION - Messaging
export class Messaging {
  //SECTION - STATIC

  //ANCHOR - watch
  static watch(callback: (payload: MessagePayload) => void): Unsubscribe {
    return onMessage(messaging, (payload) => {
      callback(payload);
    });
  }

  //ANCHOR - request
  static request() {
    console.log("Requesting permission...");
    Notification.requestPermission()
      .then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  //!SECTION
}
//!SECTION
