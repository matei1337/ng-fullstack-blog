import { Injectable } from '@angular/core';

// Import Angular Firestore.
import {
	AngularFirestore,
	AngularFirestoreDocument,
	AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

// Import Post model.
import { Post } from '../models/post';

// Import rxJs map operator.
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class PostService {
	postsCollection: AngularFirestoreCollection<Post>;
	postDoc!: AngularFirestoreDocument<Post>;
	constructor(private afs: AngularFirestore) {
		this.postsCollection = this.afs.collection('posts', (ref) =>
			ref.orderBy('date', 'desc')
		);
	}

	/**
	 * Get all posts.
	 */
	getPosts() {
		return this.postsCollection.snapshotChanges().pipe(
			map((actions: any) => {
				return actions.map((action: any) => {
					const data = action.payload.doc.data() as Post;
					const id = action.payload.doc.id;
					return { id, ...data };
				});
			})
		);
	}

	/**
	 * Get post data by id.
	 * @param id - Post ID.
	 */
	getPosteData(id: string) {
		this.postDoc = this.afs.doc<Post>(`posts/${id}`);
		return this.postDoc.valueChanges();
	}

	/**
	 * Get post by id.
	 * @param id - Post ID.
	 */
	getPost(id: string) {
		return this.afs.doc<Post>(`posts/${id}`);
	}

	/**
	 * Create new post.
	 * @param data - Post data.
	 */
	createPost(data: Post) {
		return this.postsCollection.add(data);
	}

	/**
	 * Delete post.
	 * @param id - Post ID.
	 */
	deletePost(id: string) {
		return this.getPost(id).delete();
	}

	/**
	 * Update post.
	 * @param id - Post ID.
	 * @param data - Post data.
	 */
	updatePost(id: string, data: Post) {
		return this.getPost(id).update(data);
	}
}