import { redirect } from "next/navigation";
import React from "react";

const Page: React.FC = () => {
  redirect("/home");
};

export default Page;

