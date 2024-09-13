"use client";

import { Suspense } from "react";
import DownloadContentSection from "./DownloadContentSection.jsx";

const Download = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DownloadContentSection />
        </Suspense>
    );
};

export default Download;
