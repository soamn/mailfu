import { Ratelimit } from "@unkey/ratelimit";
export const quickMailLimiter = new Ratelimit({
  rootKey: process.env.UNKEY_ROOT_KEY as string,
  namespace: "mailfu",
  limit: 3,
  duration: 10000 * 60,
  async: true,
});

export const mailLimiter = new Ratelimit({
  rootKey: process.env.UNKEY_ROOT_KEY as string,
  namespace: "mailfu",
  limit: 20,
  duration: 10000 * 60 * 10,
  async: true,
});
