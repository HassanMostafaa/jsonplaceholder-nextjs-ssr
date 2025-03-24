import Link from 'next/link';
import { Suspense } from 'react';

async function getPost(id: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }
  
  return res.json();
}

async function getComments(postId: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch comments');
  }
  
  return res.json();
}

function CommentsSection({ comments }: { comments: any[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
      <div className="space-y-6">
        {comments.map((comment: any) => (
          <div key={comment.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">{comment.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{comment.email}</p>
            <p className="text-gray-700">{comment.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const [post, comments] = await Promise.all([
    getPost(params.id),
    getComments(params.id)
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
        
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 capitalize mb-4">{post.title}</h1>
            <p className="text-lg text-gray-700 leading-relaxed">{post.body}</p>
          </div>
        </article>

        <Suspense fallback={<div className="mt-8 animate-pulse">Loading comments...</div>}>
          <CommentsSection comments={comments} />
        </Suspense>
      </div>
    </div>
  );
}