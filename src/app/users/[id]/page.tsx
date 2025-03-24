import Link from 'next/link';
import { Suspense } from 'react';

async function getUser(id: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }
  
  return res.json();
}

async function getUserPosts(userId: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch user posts');
  }
  
  return res.json();
}

function UserPosts({ posts, userName }: { posts: any[], userName: string }) {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts by {userName}</h2>
      <div className="space-y-6">
        {posts.map((post: any) => (
          <article key={post.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-medium text-gray-900 capitalize mb-2">{post.title}</h3>
            <p className="text-gray-700">{post.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const [user, posts] = await Promise.all([
    getUser(params.id),
    getUserPosts(params.id)
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
            <p className="text-gray-600 mb-4">{user.email}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Company</h2>
                <p className="mt-1 text-gray-900">{user.company.name}</p>
                <p className="text-gray-600">{user.company.catchPhrase}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Address</h2>
                <p className="mt-1 text-gray-900">{user.address.street}, {user.address.suite}</p>
                <p className="text-gray-600">{user.address.city}, {user.address.zipcode}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-sm font-medium text-gray-500">Website</h2>
              <a href={`https://${user.website}`} className="mt-1 text-indigo-600 hover:text-indigo-500">
                {user.website}
              </a>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="mt-8 animate-pulse">Loading posts...</div>}>
          <UserPosts posts={posts} userName={user.name} />
        </Suspense>
      </div>
    </div>
  );
}