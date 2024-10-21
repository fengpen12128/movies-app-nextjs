import { createClient } from "@supabase/supabase-js";

// 假设您已经在环境变量中设置了 Supabase URL 和 API Key
const supabase = createClient(
  "https://gswlvfimbybyxmcwyroz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdzd2x2ZmltYnlieXhtY3d5cm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4ODc1NDYsImV4cCI6MjA0MTQ2MzU0Nn0.SPppyX95C6OGYYrdlrOz48t5bhhbIDNhQM5KXIBsuzs"
);

export async function getPublicUrlFromDemoAa(fileName) {
  try {
    const { data } = supabase.storage
      .from("demo")
      .getPublicUrl(`aa/${fileName}`);

    return data.publicUrl;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
}

async function main() {
  const url = await getPublicUrlFromDemoAa("10.jpg");
  console.log(url);
}

main();
