import { db, dbTimestamp } from './firebase'
import { collectionGroup, documentId, where, getDocs, query, collection, getDoc, doc, addDoc } from 'firebase/firestore'
import { User as MekUser } from './user'
import { User } from 'firebase/auth'

export class Notify {
  static async like(user: User, docId: string, userId: string, ownerId: string) {
    console.log("POST ID => ", docId)
    console.log("USER ID => ", userId)
    console.log("OWNER ID => ", ownerId)
    const pack = await getDoc(doc(db, "users", ownerId, "docs", docId)) 
    const users: Record<string, MekUser> = Object.assign({}, ...(await MekUser.getUsers(user, [userId, ownerId])).map(u => ({[u.uid]: u})))
    if (users[userId]) {
        addDoc(this.collection(), {
            date: dbTimestamp(),
            message: `${users[userId].displayName} Like your post.`,
            to: ownerId,
            picture: users[userId].photoURL,
            link: `http://localhost:3000/post/${ownerId}/${docId}` 
        })
    }
    // const snapshot = await getDocs(query(collectionGroup(db, "docs"), where(documentId(), "==" ,docId)))
    // console.log(snapshot.docs.map(doc => doc.data()))
  }
  static collection() {
    return collection(db, "notifications")
  }
}
