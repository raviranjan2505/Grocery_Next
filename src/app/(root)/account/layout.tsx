"use client";
import CommonSideBarLayout from "@/components/Account/CommonSideBar/CommanSideBarLayout";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CommonSideBarLayout>{children}</CommonSideBarLayout>;
}