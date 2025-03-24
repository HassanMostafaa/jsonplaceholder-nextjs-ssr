import Link from 'next/link';

async function getPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return res.json();
}

async function getUsers() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return res.json();
}

export default async function Home() {
  const [posts, users] = await Promise.all([getPosts(), getUsers()]);
  
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">JSONPlaceholder Explorer</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Latest Posts</h2>
            <div className="space-y-4">
              {posts.slice(0, 5).map((post: any) => (
                <Link 
                  href={`/posts/${post.id}`}
                  key={post.id}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <h3 className="text-lg font-medium text-gray-900 capitalize">{post.title}</h3>
                  <p className="mt-1 text-gray-600 line-clamp-2">{post.body}</p>
                </Link>
              ))}
            </div>
            <Link 
              href="/posts"
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
            >
              View all posts →
            </Link>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users</h2>
            <div className="space-y-4">
              {users.map((user: any) => (
                <Link
                  href={`/users/${user.id}`}
                  key={user.id}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-500 text-sm">{user.company.name}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}