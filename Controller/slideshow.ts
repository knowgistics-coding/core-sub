import { User } from "firebase/auth";

export class Slideshow {
  static endpoint:string = "https://ap-southeast-1.aws.data.mongodb-api.com/app/phrain-realm-wfzbv/endpoint/slideshow";
  static async query(_user:User){
    // const token = await user.getIdToken();
    // fetch(this.endpoint, {
    //   method: "POST",
    // })
    // .then(res => res.json())
    // .then(res => console.log(res));
  }
}