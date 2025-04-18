import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function ContractsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const proposals = await db.proposal.findMany({
    where: {
      OR: [
        { clientId: session.user.id },
        { freelancerId: session.user.id },
      ],
    },
    include: {
      client: true,
      freelancer: true,
      job: true,
    },
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Contracts</h1>
      {proposals.length === 0 ? (
        <p>No contracts found.</p>
      ) : (
        <div className="grid gap-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="border rounded-lg p-4 shadow-sm"
            >
              <h2 className="text-lg font-semibold">
                {proposal.job.title}
              </h2>
              <p className="text-gray-600">
                {session.user.role === "CLIENT"
                  ? `Freelancer: ${proposal.freelancer.name}`
                  : `Client: ${proposal.client.name}`}
              </p>
              <p className="mt-2">Status: {proposal.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 