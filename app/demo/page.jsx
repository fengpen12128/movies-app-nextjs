import { Card, Inset } from "@radix-ui/themes";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center h-screen justify-center ">
      <Card>
        <div className="relative">
          <img className="w-[300px]" src="/temp.jpg" />
          {/* <div className="absolute inset-0 bg-black bg-opacity-50 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
          <img style={{
              width: "100%",
              clipPath: "inset(0 0 0 50%)",
            }}
            src="/temp.jpg"
          />
        </div> */}
        </div>
      </Card>
    </div>
  );
};

export default page;
