import { useUser } from "@clerk/clerk-react"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router"
import { useState } from "react"
import WelcomeSection from "./WelcomeSection"
import ActiveSessions from "../components/ActiveSessions"
import CreateSessionModal from "../components/CreateSessionModal"
import StatsCards from "../components/StatsCards"
import {
  useActiveSessions,
  useCreateSession,
  useMyRecentSessions,
} from "../hooks/useSessions"
import RecentSessions from "../components/RecentSessions"

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" })

  const createSessionsMutation = useCreateSession()

  const { data: activeSessionsData, isLoading: loadingActiveSessions } =
    useActiveSessions()
  const { data: recentSessionsData, isLoading: loadingRecentSessions } =
    useMyRecentSessions()

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return

    createSessionsMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          const sessionId = data.session?._id || data._id

          setShowCreateModal(false)
          setRoomConfig({ problem: "", difficulty: "" })

          if (sessionId) navigate(`/session/${sessionId}`)
        },
      },
    )
  }

  const activeSessions = activeSessionsData?.sessions || []
  const recentSessions = recentSessionsData?.sessions || []

  const isUserInSession = (session) => {
    if (!user?.id) return false

    return (
      session.host?.clerkId === user.id ||
      session.participant?.clerkId === user.id
    )
  }

  return (
    <>
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />
        {/* Grid layout */}
        <div className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>

          <RecentSessions
            sessions={recentSessions}
            isLoading={loadingRecentSessions}
          />

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Recent Sessions</h2>
            {loadingRecentSessions ? (
              <p className="text-base-content/60">Loading recent sessions...</p>
            ) : recentSessions.length ? (
              <div className="grid gap-3">
                {recentSessions.map((session) => (
                  <div
                    key={session._id}
                    className="rounded-lg bg-base-100 p-4 shadow-sm"
                  >
                    <h3 className="font-semibold">{session.problem}</h3>
                    <p className="text-sm text-base-content/60">
                      {session.difficulty}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base-content/60">No recent sessions yet.</p>
            )}
          </section>
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateRoom}
        isCreating={createSessionsMutation.isPending}
      />
    </>
  )
}

export default DashboardPage
