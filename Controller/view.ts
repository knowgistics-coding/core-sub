import { User } from "firebase/auth";
import { BookDocument } from "./book.realm";
import { PostRealmData } from "./post.realm";

type AppUser = User | null;
type Options = {
  local?: boolean;
};

export class ViewMongo {
  baseURL: string = this.options?.local
    ? "http://localhost:8080"
    : "https://clownfish-app-rgti2.ondigitalocean.app";

  constructor(private options?: Options) {}

  get = async <T extends unknown>(
    input: RequestInfo,
    method: string,
    user: AppUser
  ): Promise<T> => {
    const token = user && (await user.getIdToken());
    return (await fetch(input, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    }).then((res) => res.json())) as T;
  };

  book = async (
    id: string,
    user: AppUser
  ): Promise<{ book: BookDocument; posts: Record<string, PostRealmData> }> => {
    const book = await this.get<BookDocument>(
      `${this.baseURL}/book/${id}`,
      "GET",
      user
    );
    const postsId = book?.contents
      ?.reduce((total: string[], content) => {
        if (content.type === "post" && content.post) {
          return total.concat(content.post);
        } else if (content.type === "folder" && content.folder?.length) {
          return total.concat(...content.folder.map((item) => item.post!));
        }
        return total;
      }, [])
      .filter((s, i, a) => a.indexOf(s) === i);

    const posts = await Promise.all(
      (postsId || []).map(async (id) => ({ [id]: await this.post(id, user) }))
    );
    return { book, posts: Object.assign({}, ...posts) };
  };

  post = async (id: string, user: AppUser): Promise<PostRealmData> => {
    const post = await this.get<PostRealmData>(
      `${this.baseURL}/post/${id}`,
      "GET",
      user
    );
    return post;
  };
}
