import Link from "next/link"

const posts = [
  {
    slug: "why-consultants-lose-deals-after-proposal",
    title: "Why Consultants Lose Deals After Sending Proposals"
  },
  {
    slug: "how-to-follow-up-with-high-ticket-clients",
    title: "How to Follow Up With High-Ticket Clients"
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-20 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-10">
        Consultant Revenue Insights
      </h1>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">
              {post.title}
            </h2>
          </Link>
        ))}
      </div>

    </div>
  )
}