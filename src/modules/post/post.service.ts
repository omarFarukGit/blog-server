import { count } from "node:console";
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IcreatePostPayload } from "./post.interface";

const createPost = async (payload: IcreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return posts;
};

const getPostById = async (postId: string) => {
  //   await prisma.post.update({
  //     where: { id: postId },
  //     data: {
  //       views: {
  //         increment: 1,
  //       },
  //     },
  //   });
  // //Transaction And Rollback =>amar sob sucess hole hobe nah hole sob  hobe nah
  //   // throw new Error("Fake error");

  //   const post = await prisma.post.findFirstOrThrow({
  //     where: {
  //       id: postId,
  //     },
  //     include: {
  //       author: {
  //         omit: {
  //           password: true,
  //         },
  //       },
  //       comments: {
  //         where: {
  //           status: CommentStatus.APPROVED,
  //         },
  //         orderBy: {
  //           createdAt: "desc",
  //         },
  //       },
  //       _count: {
  //         select: {
  //           comments: true,
  //         },
  //       },
  //     },
  //   });

  //   return post;

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    // throw new Error("Fake error");
    const post = await tx.post.findFirstOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  });

  return transactionResult;
};

const updatePost = async (
  postId: string,
  payload: Partial<IcreatePostPayload>,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("you are not the owner of this post");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return result;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("you are not owner this post");
  }
  const result = await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return result;
};

const getPostsStats = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const totalPosts = await tx.post.count();
    const totalPublishedPost = await tx.post.count({
      where: {
        status: PostStatus.PUBLISHED,
      },
    });
    const totalDraftPost = await tx.post.count({
      where: {
        status: PostStatus.DRAFT,
      },
    });
    const totalArcharivePost = await tx.post.count({
      where: {
        status: PostStatus.ARCHIVED,
      },
    });

    const totalComment = await tx.comment.count();

    const totalApprovedComment = await tx.comment.count({
      where: {
        status: CommentStatus.APPROVED,
      },
    });
    const totalRejectdComment = await tx.comment.count({
      where: {
        status: CommentStatus.REJECT,
      },
    });

    //not a good aprovece
    // const allPots=await tx.post.findMany();
    // let totalPostViews=0;
    // allPots.forEach((post)=>{
    //   totalPostViews=totalPostViews+ post.views
    // })

    const totalPostViewsAvg = await tx.post.aggregate({
      _sum: {
        views: true,
      },
    });

    const totalPostViews = totalPostViewsAvg._sum.views;
    return {
      totalPosts,
      totalPublishedPost,
      totalArcharivePost,
      totalDraftPost,
      totalComment,
      totalApprovedComment,
      totalRejectdComment,
      totalPostViews,
    };
  });

  return transactionResult;
};

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },

    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return result;
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsStats,
  getMyPosts,
};
