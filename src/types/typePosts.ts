export type PostViewModelTdb = {
  _id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostViewModelT = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostInputModelT = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type dbPT = {
  dbPosts: PostViewModelT[];
};

export type PaginatorPosts = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostViewModelT[];
};
