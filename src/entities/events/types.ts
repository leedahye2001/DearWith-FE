// 이벤트 수정 요청 타입
export interface PatchEventData {
    title?: string;
    startDate?: string;
    endDate?: string;
    openTime?: string;
    closeTime?: string;
    xLink?: string | null;
    artistIds?: number[];
    artistGroupIds?: number[];
    place?: {
        kakaoPlaceId: string;
        name: string;
        roadAddress: string;
        jibunAddress: string;
        lon: number;
        lat: number;
        phone?: string;
        placeUrl?: string;
    };
    images?: Array<{
        id?: string;
        tmpKey?: string;
        displayOrder: number;
    }>;
    benefits?: Array<{
        name: string;
        benefitType: "INCLUDED" | "LIMITED" | "LUCKY_DRAW";
        dayIndex?: number | null;
        displayOrder: number;
        visibleFrom?: string;
    }>;
}
