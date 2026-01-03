import React, { Suspense } from "react";
import EventPhotoReviewsClient from "../components/EventPhotoReviewsClient";
import Spinner from "@/components/Spinner/Spinner";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    }>
      <EventPhotoReviewsClient id={id} />
    </Suspense>
  );
}
