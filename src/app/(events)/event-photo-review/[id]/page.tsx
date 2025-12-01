import React from "react";
import EventPhotoReviewsClient from "../components/EventPhotoReviewsClient";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return <EventPhotoReviewsClient id={id} />;
}
