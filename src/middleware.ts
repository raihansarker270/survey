import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "session_token";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const token = req.cookies.get(COOKIE)?.value;

  // শুধু ইউজার রুটগুলো প্রোটেক্টেড রাখুন
  if (!token && (url.startsWith("/dashboard") || url.startsWith("/withdraw") || url.startsWith("/earn"))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // /admin রুটগুলো পেজ-লেভেলে চেক করবে (আমরা admin layout/pages-এ 403 দেখাচ্ছি)
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/withdraw/:path*", "/earn/:path*"], // এখানে /admin বাদ
};
