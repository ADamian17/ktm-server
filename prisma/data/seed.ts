const prisma = require("@prisma/client");

const db = new prisma.PrismaClient();
const boardsData = [
  {
    name: "Platform Launch",
    uri: "/platform-launch/",
    columns: {
      create: [
        {
          name: "Todo",
          tasks: {
            create: [
              {
                title: "Build UI for onboarding flow",
                description: "",
                status: "Todo",
                subtasks: {
                  create: [
                    {
                      title: "Sign up page",
                      isCompleted: false,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const boardData of boardsData) {
    const board = await db.board.create({
      data: boardData,
    });
    console.log(`Created user with id: ${board.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
