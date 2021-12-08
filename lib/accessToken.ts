import prisma from "./prisma";
const accessToken = async (id: string) => {
  const accounts = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      accounts: true,
    },
  });
  const token = accounts?.accounts[0]?.access_token;
  return token;
};

export default accessToken;
