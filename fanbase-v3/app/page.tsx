"use client";
import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";

import Layout from "./components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Home</h1>
        <p className="text-gray-300">Discover the latest music NFTs trending on Fanbase.</p>
      </div>
    </Layout>
  );
}
