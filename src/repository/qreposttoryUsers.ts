import { SortDirection } from "mongodb";
import { dbT } from "../db/mongo-.db";
import { PaginatorUsers, UserViewModel2, UserViewModelConfidential, qureUsers } from "../types/typeUser";

export const qrepostoryUsers = {
  async getUsers(query: qureUsers): Promise<PaginatorUsers | { error: string }> {
    const searchEmail = query.searchEmailTerm ? { email: { $regex: query.searchEmailTerm, $options: "i" } } : {};
    const searchLogin = query.searchLoginTerm ? { login: { $regex: query.searchLoginTerm, $options: "i" } } : {};

    const filter = {
      $or: [
      { email: { $regex: query.searchEmailTerm ?? "", $options: "i" } },
      { login: { $regex: query.searchLoginTerm ?? "", $options: "i" } }
     ],
    };
    // const filter: Filter<UserAccountDBModel> = {
    //   $or: [
    //     { "accountData.login": { $regex: searchLoginTerm ?? "", $options: "i" } },
    //     { "accountData.email": { $regex: searchEmailTerm ?? "", $options: "i" } },
    //   ],
    // };
    // const filter = {
    //   $or: [
    //     { email: { $regex: `.*${query.searchEmailTerm}.*`, $options: "i" } },
    //     { login: { $regex: `.*${query.searchLoginTerm}.*`, $options: "i" }}
    //   ]
    // };

    // const filter = {
    //   $or: [searchEmail, searchLogin],
    // };

    try {
      const items: UserViewModelConfidential[] = (await dbT
        .getCollections()
        .userCollection.find(filter)
        .sort(query.sortBy, query.sortDirection as SortDirection)
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize)
        .toArray()) as UserViewModelConfidential[];

      const userMapData: UserViewModel2[] = items.map((user: UserViewModelConfidential) => {
        return {
          id: user._id,
          login: user.login,
          email: user.email,
          createdAt: user.createdAt,
        };
      });
      const totalCount = await dbT.getCollections().userCollection.countDocuments(filter);
      return {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items: userMapData,
      };
    } catch (e) {
      console.log(e);
      return { error: "some error" };
    }
  },
};
