import prisma from "../libs/prismadb.js"

async function testConnectWithDatabase() {
    try {
      const allUsers = await prisma.user.findMany();
      console.log(allUsers);
      return allUsers;
    } catch (error) {
      console.error('Error retrieving users:', error);
    } finally {
      await prisma.$disconnect();
    }
  }

export default testConnectWithDatabase;