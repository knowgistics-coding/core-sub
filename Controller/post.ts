import { collection, doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

export class Post {
  /**
   ____   _          _    _       
  / ___| | |_  __ _ | |_ (_)  ___ 
  \___ \ | __|/ _` || __|| | / __|
   ___) || |_| (_| || |_ | || (__ 
  |____/  \__|\__,_| \__||_| \___|
    */  
  static prefix:string = `${process.env.REACT_APP_PREFIX}`;
  private static collection(path: string, ...pathSegments: string[]) {
    return collection(db, "clients", this.prefix, path, ...pathSegments);
  }
  private static doc(path: string, ...pathSegments: string[]) {
    return doc(db, "clients", this.prefix, path, ...pathSegments);
  }
  static async get(id:string):Promise<any>{
    return (await getDoc(this.doc("documents", id))).data()
  }
}