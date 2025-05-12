import Layout from "../components/Layout";

export default function ProfilePage() {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <p className="text-gray-300">Your profile information and stats.</p>
      </div>
    </Layout>
  );
}
