export type CommentInputModel = {
  content: string;
};

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
};

export type CommentViewModelDb = {
  _id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  IdPost: string;
};


export type commenQu  = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};
