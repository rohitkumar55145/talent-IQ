import { Link, useParams } from "react-router"
import Navbar from "../components/Navbar"
import { useSessionById } from "../hooks/useSessions"

const SessionPage = () => {
  const { id } = useParams()
  const { data, isLoading, isError } = useSessionById(id)

  const session = data?.session || data

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />

      <main className="container mx-auto px-6 py-10">
        {isLoading ? (
          <p className="text-base-content/60">Loading session...</p>
        ) : isError || !session ? (
          <div className="rounded-lg bg-base-100 p-6 shadow-sm">
            <h1 className="text-2xl font-bold">Session not found</h1>
            <p className="mt-2 text-base-content/60">
              This session may have ended or is no longer available.
            </p>
            <Link className="btn btn-primary mt-5" to="/dashboard">
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <section className="rounded-lg bg-base-100 p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-primary">
                  {session.status}
                </p>
                <h1 className="mt-2 text-3xl font-black">{session.problem}</h1>
                <p className="mt-2 text-base-content/60">
                  Difficulty: {session.difficulty}
                </p>
              </div>

              <Link className="btn btn-outline" to="/dashboard">
                Back to Dashboard
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-base-300 p-4">
                <p className="text-sm text-base-content/60">Host</p>
                <p className="mt-1 font-semibold">
                  {session.host?.name || session.host?.email || "Unknown host"}
                </p>
              </div>

              <div className="rounded-lg border border-base-300 p-4">
                <p className="text-sm text-base-content/60">Participant</p>
                <p className="mt-1 font-semibold">
                  {session.participant?.name ||
                    session.participant?.email ||
                    "Waiting for participant"}
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default SessionPage
