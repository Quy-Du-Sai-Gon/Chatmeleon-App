// Import dependencies
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/authentication",
  },
});

export const config = {
  matcher: ["/conversations/:path*"],
};
