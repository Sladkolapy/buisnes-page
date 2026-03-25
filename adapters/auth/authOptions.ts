import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { container } from "@/config/containers";
import { Email, Phone } from "@/core/shared/value-objects";
import { BusinessRuleException } from "@/core/shared/errors";

const providers: NextAuthOptions["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

providers.push(
  CredentialsProvider({
    id: "credentials",
    name: "Email или телефон",
    credentials: {
      email: { label: "Email", type: "email" },
      phone: { label: "Телефон", type: "tel" },
    },
    async authorize(credentials) {
      try {
        if (credentials?.email) {
          const emailVO = new Email(credentials.email);
          const user = await container.userRepository.findByEmail(emailVO);
          if (!user) return null;
          if (user.isBlocked()) return null;
          return {
            id: user.getId().getValue(),
            email: user.getEmail()?.getValue() ?? null,
            role: user.getRole(),
          };
        }

        if (credentials?.phone) {
          const phoneVO = new Phone(credentials.phone);
          const user = await container.userRepository.findByPhone(phoneVO);
          if (!user) return null;
          if (user.isBlocked()) return null;
          return {
            id: user.getId().getValue(),
            email: user.getEmail()?.getValue() ?? null,
            role: user.getRole(),
          };
        }

        return null;
      } catch (e) {
        if (e instanceof BusinessRuleException) return null;
        throw e;
      }
    },
  }),
);

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
};
