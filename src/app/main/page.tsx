"use client";

import { getData } from "@/apis/api";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const { data } = useQuery({
    queryKey: ["data"],
    queryFn: getData,
  });

  return <div>{data}</div>;
};

export default Page;
