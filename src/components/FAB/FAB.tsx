// // "use client";
// // import { useRouter } from "next/navigation";

// // interface FABProps {
// //   _url?: string;
// //   _node?: React.ReactNode;
// // }

// // export const FAB = ({ _url, _node }: FABProps) => {
// //   const router = useRouter();

// //   return (
// //     <button
// //       className="fixed right-0 bottom-0 z-50 p-[10px] w-[44px] h-[44px] bg-primary rounded-full shadow-md mb-[32px] mr-[20px] hover:cursor-pointer"
// //       onClick={() => {
// //         router.push(`${_url}`);
// //       }}
// //     >
// //       {_node && <div>{_node}</div>}
// //     </button>
// //   );
// // };

// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import ReactDOM from "react-dom";

// interface FABProps {
//   _url?: string; // 이동할 URL
//   _node?: React.ReactNode; // 클릭 시 띄울 컴포넌트
//   _icon?: React.ReactNode; // FAB 내부 아이콘 (예: <Plus />)
// }

// export const FAB = ({ _url, _node, _icon }: FABProps) => {
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleClick = () => {
//     if (_url) {
//       // ✅ URL이 있으면 라우터 이동
//       router.push(_url);
//       return;
//     }
//     if (_node) {
//       // ✅ URL이 없고 node가 있으면 컴포넌트 띄우기
//       setIsOpen(true);
//     }
//   };

//   const handleClose = () => setIsOpen(false);

//   return (
//     <>
//       {/* FAB 버튼 */}
//       <button
//         onClick={handleClick}
//         className="fixed right-[20px] bottom-[32px] z-50
//                    flex items-center justify-center w-[56px] h-[56px]
//                    bg-primary text-white rounded-full shadow-lg
//                    hover:scale-105 active:scale-95 transition-transform"
//       >
//         {_icon ? _icon : <span className="text-[24px] font-bold">+</span>}
//       </button>

//       {/* Node가 있을 경우 Overlay로 띄우기 */}
//       {isOpen &&
//         typeof document !== "undefined" &&
//         ReactDOM.createPortal(
//           <div
//             className="fixed inset-0 z-[60] bg-black/40 flex justify-center items-center"
//             onClick={handleClose}
//           >
//             <div
//               className="bg-white dark:bg-bg-1 rounded-2xl p-4 max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫히지 않게
//             >
//               {_node}
//             </div>
//           </div>,
//           document.body
//         )}
//     </>
//   );
// };

"use client";
import { useRouter } from "next/navigation";

interface FABProps {
  _url?: string;
  _icon?: React.ReactNode;
  _onClick?: () => void;
}

export const FAB = ({ _url, _icon, _onClick }: FABProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (_onClick) return _onClick();
    if (_url) router.push(_url);
  };

  return (
    <button
      className="fixed right-[20px] bottom-[32px] z-50 
                 flex items-center justify-center w-[56px] h-[56px]
                 bg-primary text-white rounded-full shadow-lg
                 hover:scale-105 active:scale-95 transition-transform"
      onClick={handleClick}
    >
      {_icon ? _icon : <span className="text-[24px] font-bold">+</span>}
    </button>
  );
};
