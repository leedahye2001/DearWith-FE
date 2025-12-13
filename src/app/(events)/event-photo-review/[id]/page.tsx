import React from "react";
import EventPhotoReviewsClient from "../components/EventPhotoReviewsClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventPhotoReviewsClient id={id} />;
}
