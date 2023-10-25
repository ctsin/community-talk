import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Plan = "personal" | "team" | "enterprise";
type Pricing = number | ((users: number) => number);

const plans = {
  personal: 10,
  team: (users) => users * 5,
  enterprise: (users) => users * 20,
} satisfies Record<Plan, Pricing>;

const pricingA = plans.personal.toFixed(2);
const pricingB = plans.team(10).toFixed(2);

const createPost = async () => {
  const postCreate = {
    title: "Title Baz",
    body: "It is a long established fact that a reader will be distracted by the readable content.",
    author: {
      connect: {
        id: "653612b54a44aeb6a7ea066b",
      },
    },
  } satisfies Prisma.PostCreateInput;

  const postCreated = await prisma.post.create({
    data: postCreate,
  });
  console.log("🚀 ~ postCreated:", postCreated);
};

// createPost();

const getPosts = async () => {
  const postSelect = {
    title: true,
    createdAt: true,
    author: {
      select: {
        name: true,
        email: true,
      },
    },
  } satisfies Prisma.PostSelect;

  const posts = await prisma.post.findMany({
    select: postSelect,
  });

  console.log("🚀 ~ posts:", posts);
};

// getPosts();

const countSelect = {
  _all: true,
  name: true,
} satisfies Prisma.AuthorCountAggregateInputType;

const groupByArgs = {
  by: ["name"],
} satisfies Prisma.AuthorGroupByArgs;