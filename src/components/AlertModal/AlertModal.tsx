import useModalStore from "@/app/stores/useModalStore";
import Button from "@/components/Button/Button";

export default function AlertModal() {
  const { showModal, message, closeModal, onConfirm, type } = useModalStore();

  if (!showModal) return null;

  const handleConfirm = async () => {
    if (onConfirm) await onConfirm();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="w-[327px] h-[160px] bg-bg-1 rounded-[12px] flex flex-col justify-between p-[20px] shadow-lg">
        <p className="text-text-5 text-[16px] font-[600] text-center mt-[20px]">
          {message}
        </p>

        <div className="mb-[10px]">
          {type === "alert" && (
            <div className="flex justify-center ">
              <Button _state="main" _node="확인" _onClick={closeModal} />
            </div>
          )}

          {type === "confirm" && (
            <div className="flex justify-between gap-[12px]">
              <Button
                _state="main"
                _buttonProps={{ className: "bg-bg-2" }}
                _node="아니오"
                _onClick={closeModal}
              />
              <Button _state="main" _node="네" _onClick={handleConfirm} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
