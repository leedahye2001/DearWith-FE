import React from "react";
import EventPhotoReviewsClient from "../components/EventPhotoReviewsClient";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return <EventPhotoReviewsClient id={id} />;
}
