"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Backward from "@/svgs/Backward.svg";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import Bottombar from "@/components/template/Bottombar";
import Topbar from "@/components/template/Topbar";
import ProgressBar from "@/components/Progressbar/Progressbar";

const Page = () => {
  const router = useRouter();

  const totalSteps = 6;
  const [currentStep, setCurrentStep] = useState(1);

  const [checkedItems, setCheckedItems] = useState({
    item1: false,
    item2: false,
    item3: false,
    item4: false,
    item5: false,
  });

  const allChecked = Object.values(checkedItems).every(Boolean);

  const handleItemChange = (
    key: keyof typeof checkedItems,
    checked: boolean
  ) => {
    setCheckedItems((prev) => ({ ...prev, [key]: checked }));
  };

  const handleAllChange = (checked: boolean) => {
    const newState: typeof checkedItems = {
      item1: checked,
      item2: checked,
      item3: checked,
      item4: checked,
      item5: checked,
    };
    setCheckedItems(newState);
  };

  const fetchAgreeData = () => {
    router.push("/mail-send");
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar _leftImage={<Backward />} _topNode="제목" />
      <div className="px-[24px] pt-[30px]">
        <h2 className="font-[700] text-text-5 text-[20px] pb-[20px]">
          디어위드와 함께하기 위해
          <br />
          약관동의가 필요해요
        </h2>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <Checkbox
          _id="selectAll"
          _value="모두 동의하기 (선택 항목 포함)"
          _type="neutral1100"
          _checked={allChecked}
          _onChange={handleAllChange}
          _inputWrapperProps={{
            className: "text-text-5 text-[16px] font-[600]",
          }}
        />
        <div className="h-[1px] w-full bg-divider-1 mt-[12px] mb-[16px]" />
        <Checkbox
          _id="item1"
          _value="[필수] 만 14세 이상입니다."
          _type="icon2"
          _checked={checkedItems.item1}
          _onChange={(checked) => handleItemChange("item1", checked)}
        />
        <Checkbox
          _id="item2"
          _value="[필수] 서비스 이용 약관 동의"
          _type="icon2"
          _checked={checkedItems.item2}
          _onChange={(checked) => handleItemChange("item2", checked)}
        />
        <Checkbox
          _id="item3"
          _value="[필수] 개인정보 수집 및 이용 동의"
          _type="icon2"
          _checked={checkedItems.item3}
          _onChange={(checked) => handleItemChange("item3", checked)}
        />
        <Checkbox
          _id="item4"
          _value="[선택] 마케팅 개인정보 제3자 제공 동의"
          _type="icon2"
          _checked={checkedItems.item4}
          _onChange={(checked) => handleItemChange("item4", checked)}
        />
        <Checkbox
          _id="item5"
          _value="[선택] PUSH 알림 동의"
          _type="icon2"
          _checked={checkedItems.item5}
          _onChange={(checked) => handleItemChange("item5", checked)}
        />
      </div>

      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="동의하고 진행하기"
            _buttonProps={{
              className: `hover:cursor-pointer ${
                !(
                  checkedItems.item1 &&
                  checkedItems.item2 &&
                  checkedItems.item3
                )
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`,
              disabled: !(
                checkedItems.item1 &&
                checkedItems.item2 &&
                checkedItems.item3
              ),
            }}
            _onClick={fetchAgreeData}
          />
        }
      />
    </div>
  );
};

export default Page;
