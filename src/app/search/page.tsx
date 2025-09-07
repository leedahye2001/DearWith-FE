"use client";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Search from "@/svgs/Search.svg";
import Cancel from "@/svgs/CancelSmall.svg";
import { useState } from "react";

const Page = () => {
  const [search, setSearch] = useState<string>("");

  const handleSearchChange = (search: string) => {
    setSearch(search);
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center mt-[54px] gap-[12px]">
      <Input
        _value={search}
        _state="textbox-basic"
        _rightNode={<Search />}
        _onChange={handleSearchChange}
        _inputProps={{
          placeholder: "어떤 가수의 이벤트를 찾고있나요?",
          className: `placeholder:text-text-3`,
        }}
        _containerProps={{ className: `py-[10px]` }}
      />

      <div className="flex flex-col gap-[20px] mt-[12px]">
        <div className="flex justify-between w-full items-center">
          <h3 className="flex items-center font-[700] text-[16px] text-text-5">
            최근 검색어
          </h3>
          <p className="text-[12px] font-[400] text-text-5">모두 지우기</p>
        </div>
        <div className="flex flex-wrap w-[327px] gap-[8px]">
          <Button _state="tag" _node="데이식스" _rightNode={<Cancel />} />
          <Button _state="tag" _node="데이식스" _rightNode={<Cancel />} />
          <Button _state="tag" _node="데" _rightNode={<Cancel />} />
          <Button _state="tag" _node="식스" _rightNode={<Cancel />} />
          <Button _state="tag" _node="데이식스" _rightNode={<Cancel />} />
          <Button _state="tag" _node="데이식스" _rightNode={<Cancel />} />
          <Button _state="tag" _node="데이식스" _rightNode={<Cancel />} />
        </div>
      </div>

      <div className="flex flex-col gap-[20px] my-[12px]">
        <div className="flex justify-between w-full items-center">
          <h3 className="flex items-center font-[700] text-[16px] text-text-5">
            실시간 검색어
          </h3>
          <p className="text-[12px] font-[400] text-text-3">22:00 기준</p>
        </div>

        <div className="flex justify-start w-full items-center">
          <p className="flex justify-start w-[40px] items-center font-[600] text-[14px] text-text-6">
            1위
          </p>
          <div className="w-[40px] h-[40px] bg-divider-1 rounded-[50px]" />
          <div className="flex flex-col ml-[8px]">
            <p className="text-[14px] font-[600] text-text-5">데이식스</p>
            <p className="text-[12px] font-[400] text-text-4">2015.09.07</p>
          </div>
        </div>
        <div className="flex justify-start w-full items-center">
          <p className="flex justify-start w-[40px] items-center font-[600] text-[14px] text-text-6">
            2위
          </p>
          <div className="w-[40px] h-[40px] bg-divider-1 rounded-[50px]" />
          <div className="flex flex-col ml-[8px]">
            <p className="text-[14px] font-[600] text-text-5">데이식스</p>
            <p className="text-[12px] font-[400] text-text-4">2015.09.07</p>
          </div>
        </div>
        <div className="flex justify-start w-full items-center">
          <p className="flex justify-start w-[40px] items-center font-[600] text-[14px] text-text-6">
            3위
          </p>
          <div className="w-[40px] h-[40px] bg-divider-1 rounded-[50px]" />
          <div className="flex flex-col ml-[8px]">
            <p className="text-[14px] font-[600] text-text-5">데이식스</p>
            <p className="text-[12px] font-[400] text-text-4">2015.09.07</p>
          </div>
        </div>
        <div className="flex justify-start w-full items-center">
          <p className="flex justify-start w-[40px] items-center font-[600] text-[14px] text-text-5">
            4위
          </p>
          <div className="w-[40px] h-[40px] bg-divider-1 rounded-[50px]" />
          <div className="flex flex-col ml-[8px]">
            <p className="text-[14px] font-[600] text-text-5">데이식스</p>
            <p className="text-[12px] font-[400] text-text-4">2015.09.07</p>
          </div>
        </div>
        <div className="flex justify-start w-full items-center">
          <p className="flex justify-start w-[40px] items-center font-[600] text-[14px] text-text-5">
            5위
          </p>
          <div className="w-[40px] h-[40px] bg-divider-1 rounded-[50px]" />
          <div className="flex flex-col ml-[8px]">
            <p className="text-[14px] font-[600] text-text-5">데이식스</p>
            <p className="text-[12px] font-[400] text-text-4">2015.09.07</p>
          </div>
        </div>
        <div className="flex justify-start w-full items-center">
          <p className="flex justify-start w-[40px] items-center font-[600] text-[14px] text-text-5">
            6위
          </p>
          <div className="w-[40px] h-[40px] bg-divider-1 rounded-[50px]" />
          <div className="flex flex-col ml-[8px]">
            <p className="text-[14px] font-[600] text-text-5">데이식스</p>
            <p className="text-[12px] font-[400] text-text-4">2015.09.07</p>
          </div>
        </div>
        <div className="flex justify-start w-full items-center">
          <p className="flex justify-start w-[40px] items-center font-[600] text-[14px] text-text-5">
            7위
          </p>
          <div className="w-[40px] h-[40px] bg-divider-1 rounded-[50px]" />
          <div className="flex flex-col ml-[8px]">
            <p className="text-[14px] font-[600] text-text-5">데이식스</p>
            <p className="text-[12px] font-[400] text-text-4">2015.09.07</p>
          </div>
        </div>
        <div className="flex justify-start w-full items-center">
          <p className="flex justify-start w-[40px] items-center font-[600] text-[14px] text-text-5">
            8위
          </p>
          <div className="w-[40px] h-[40px] bg-divider-1 rounded-[50px]" />
          <div className="flex flex-col ml-[8px]">
            <p className="text-[14px] font-[600] text-text-5">데이식스</p>
            <p className="text-[12px] font-[400] text-text-4">2015.09.07</p>
          </div>
        </div>
        <div className="flex justify-start w-full items-center">
          <p className="flex justify-start w-[40px] items-center font-[600] text-[14px] text-text-5">
            9위
          </p>
          <div className="w-[40px] h-[40px] bg-divider-1 rounded-[50px]" />
          <div className="flex flex-col ml-[8px]">
            <p className="text-[14px] font-[600] text-text-5">데이식스</p>
            <p className="text-[12px] font-[400] text-text-4">2015.09.07</p>
          </div>
        </div>
        <div className="flex justify-start w-full items-center">
          <p className="flex justify-start w-[40px] items-center font-[600] text-[14px] text-text-5">
            10위
          </p>
          <div className="w-[40px] h-[40px] bg-divider-1 rounded-[50px]" />
          <div className="flex flex-col ml-[8px]">
            <p className="text-[14px] font-[600] text-text-5">데이식스</p>
            <p className="text-[12px] font-[400] text-text-4">2015.09.07</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
