import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import confetti from "canvas-confetti"
import toast from "react-hot-toast"
import { LANGUAGE_CONFIG, PROBLEMS } from "../data/problems"
import Navbar from "../components/Navbar"

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import ProblemDescription from "../components/ProblemDescription"
import OutputPanel from "../components/OutputPanel"
import CodeEditorPanel from "../components/CodeEditorPanel"
import { executeCode } from "../lib/piston"

const ProblemPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const initialProblemId = id && PROBLEMS[id] ? id : "two-sum"

  const [currentProblemId, setCurrentProblemId] = useState(initialProblemId)
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [code, setCode] = useState(
    PROBLEMS[initialProblemId].starterCode.javascript,
  )
  const [output, setOutput] = useState(null)
  const [isRunning, setIsRunning] = useState(false)

  const currentProblem = PROBLEMS[currentProblemId]

  // update problem when URL param changes
  useEffect(() => {
    if (!id || !PROBLEMS[id]) {
      navigate("/problems", { replace: true })
      return
    }

    setCurrentProblemId(id)
    setCode(PROBLEMS[id].starterCode[selectedLanguage])
    setOutput(null)
  }, [id, navigate, selectedLanguage])

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language)
    setCode(currentProblem.starterCode[language])
    setOutput(null)
  }

  const handleProblemChange = (newProblemId) => {
    navigate(`/problem/${newProblemId}`)
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    })

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    })
  }

  const checkIfTestsPassed = (resultOutput) => {
    const normalize = (value) => value.replace(/\s|["']/g, "")
    return (
      normalize(resultOutput.trim()) ===
      normalize(currentProblem.expectedOutput[selectedLanguage].trim())
    )
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    setOutput(null)

    const result = await executeCode(selectedLanguage, code)
    const nextOutput = result.output || result.error || "No output"

    setOutput({
      success: result.success,
      text: nextOutput,
      error: result.error,
    })

    if (result.success && checkIfTestsPassed(nextOutput)) {
      triggerConfetti()
      toast.success("All sample tests passed")
    } else if (result.success) {
      toast.error("Tests failed. Check your output!")
    } else {
      toast.error("Code execution failed")
    }

    setIsRunning(false)
  }

  return (
    <div className="h-screen w-screen bg-base-100 flex flex-col">
      <Navbar />
      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* left panel - problem desc */}
          <Panel defaultSize={40} minSize={30}>
            {/* left panel - problem desc */}
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* right panel - code editor & output  */}
          <Panel defaultSize={40} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - Code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  code={code}
                  onCodeChange={setCode}
                  onLanguageChange={handleLanguageChange}
                  onRunCode={handleRunCode}
                  selectedLanguage={selectedLanguage}
                  isRunning={isRunning}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              <Panel defaultSize={30} minSize={30}>
                <OutputPanel output={output} isRunning={isRunning} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}

export default ProblemPage
