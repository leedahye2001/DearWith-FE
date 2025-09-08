"use client";

import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "./useKakaoLoader";
import { useEffect, useState } from "react";

interface KakaoMapProps {
  address?: string;
  lat?: number;
  lng?: number;
}

const KakaoMapPage = ({ address, lat, lng }: KakaoMapProps) => {
  const [coordinates, setCoordinates] = useState({
    lat: lat ?? 33.450701,
    lng: lng ?? 126.570667,
  });

  useKakaoLoader();

  useEffect(() => {
    // 위도/경도가 직접 작성할 경우
    if (lat && lng) {
      setCoordinates({ lat, lng });
      return;
    }

    // 주소가 있는 경우: Geocoder 사용
    if (address && window.kakao && window.kakao.maps) {
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const { x, y } = result[0];
          setCoordinates({ lat: parseFloat(y), lng: parseFloat(x) });
        } else {
          console.error("주소 검색 실패:", address);
        }
      });
    }
  }, [address, lat, lng]);

  const handleCopyLink = () => {
    const kakaoLink = `https://map.kakao.com/link/map/${address ?? ""},${
      coordinates.lat
    },${coordinates.lng}`;
    navigator.clipboard.writeText(kakaoLink).then(() => {
      window.open(kakaoLink, "_blank");
    });
  };

  return (
    <Map
      id="map"
      center={coordinates}
      className="w-full h-[200px] relative border-divider-1 border-[0.8px]"
      level={3}
    >
      <MapMarker position={coordinates} />
      <div className="flex justify-between w-full items-center py-[8px]">
        <p className="flex items-center font-[600] text-[14px] text-text-5">
          📍 {address}
        </p>

        <p
          className="text-[12px] font-[400] text-text-3"
          onClick={handleCopyLink}
        >
          복사
        </p>
      </div>
    </Map>
  );
};

export default KakaoMapPage;
