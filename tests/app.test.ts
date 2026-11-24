import { describe, it, expect, beforeEach } from 'vitest'
import app from '../src/index'
import { DefenseProtocol } from '../src/lib/defense-protocol'

const createMockEnv = () => {
  const kvStore = new Map<string, string>()
  const mockTechniques = [
    {
      id: 1,
      category: 'induction',
      name: 'Progressive Relaxation',
      description: 'Physical relaxation',
      script: 'Relax your body...',
      difficulty: 'beginner',
      effectiveness_rating: 92.5,
      usage_count: 140
    },
    {
      id: 2,
      category: 'deepener',
      name: 'Staircase Deepener',
      description: 'Descending 10 steps',
      script: 'Ten, stepping down...',
      difficulty: 'intermediate',
      effectiveness_rating: 88.0,
      usage_count: 95
    }
  ]

  return {
    AI_API_KEY: 'test_mock_ai_key',
    DB: {
      prepare: (sql: string) => ({
        bind: (...args: any[]) => ({
          run: async () => ({ meta: { last_row_id: 1, changes: 1 } }),
          all: async () => ({ results: mockTechniques }),
          first: async () => ({
            total_sessions: 12,
            avg_success_rate: 0.85,
            last_session: '2026-11-24T00:00:00Z',
            total_defenses: 8,
            successful_defenses: 7,
            unique_attacks_faced: 3
          })
        }),
        run: async () => ({ meta: { last_row_id: 1, changes: 1 } }),
        all: async () => ({ results: mockTechniques }),
        first: async () => ({
          total_sessions: 12,
          avg_success_rate: 0.85,
          last_session: '2026-11-24T00:00:00Z'
        })
      })
    } as any,
    KV: {
      put: async (key: string, val: string) => {
        kvStore.set(key, val)
      },
      get: async (key: string) => kvStore.get(key) || null,
      delete: async (key: string) => {
        kvStore.delete(key)
      }
    } as any
  }
}

describe('Sentinelmind-ai Hono Web Application', () => {
  let env: ReturnType<typeof createMockEnv>

  beforeEach(() => {
    env = createMockEnv()
  })

  it('GET /api/health should return operational status', async () => {
    const res = await app.request('/api/health', {}, env)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe('operational')
    expect(data.version).toBe('1.0.0')
    expect(data.message).toContain('online and ready')
  })

  it('GET / should serve the HTML application page', async () => {
    const res = await app.request('/', {}, env)
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toContain('AI Hypnosis - Revolutionary Hypnotism Platform')
    expect(text).toContain('Say "They got me" to activate emergency protocol')
  })

  it('POST /api/command/ground-me should return grounding sequence', async () => {
    const res = await app.request(
      '/api/command/ground-me',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: {}, data: {} })
      },
      env
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.result.affirmation).toContain('I am in control')
    expect(data.result.anchorPoints.length).toBeGreaterThan(0)
    expect(data.result.realityChecks.length).toBeGreaterThan(0)
  })

  it('POST /api/command/unknown-command should return 400 Bad Request', async () => {
    const res = await app.request(
      '/api/command/non-existent-action',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: {}, data: {} })
      },
      env
    )
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toBe('Unknown command')
  })

  it('POST /api/hypnosis/emergency-protocol should initiate extraction protocol', async () => {
    const res = await app.request(
      '/api/hypnosis/emergency-protocol',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'operator_agent_01'
        }
      },
      env
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.protocol.status).toBe('activated')
    expect(data.protocol.safeWord).toBe('BASELINE')
    expect(data.protocol.shieldActivated).toBe(true)
  })

  it('GET /api/techniques/library should return technique database list', async () => {
    // Unfiltered
    const res = await app.request('/api/techniques/library', {}, env)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.techniques)).toBe(true)
    expect(data.techniques.length).toBe(2)
    expect(data.techniques[0].name).toBe('Progressive Relaxation')

    // Filtered by category and difficulty
    const resFiltered = await app.request('/api/techniques/library?category=induction&difficulty=beginner', {}, env)
    expect(resFiltered.status).toBe(200)
    const dataFiltered = await resFiltered.json()
    expect(dataFiltered.success).toBe(true)
    expect(dataFiltered.techniques.length).toBe(2)
  })

  it('POST /api/practice/start-session should initialize AI practice agent session', async () => {
    const res = await app.request(
      '/api/practice/start-session',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'trainee_agent_99'
        },
        body: JSON.stringify({
          mode: 'defense',
          difficulty: 'medium',
          agentType: 'susceptible'
        })
      },
      env
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.sessionId).toBeDefined()
    expect(data.agent).toBeDefined()
    expect(data.instructions).toBeDefined()
    expect(data.agent.type).toBe('susceptible')
  })

  it('POST /api/hypnosis/generate-script should generate hypnotic script and cache in KV', async () => {
    const res = await app.request(
      '/api/hypnosis/generate-script',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'induction',
          goal: 'deep focus and cognitive resilience',
          intensity: 'medium',
          customization: { description: 'Mental shield reinforcement' }
        })
      },
      env
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.scriptId).toBe(1)
    expect(data.script).toBeDefined()
    expect(data.script.type).toBe('induction')
    expect(data.script.sections.length).toBeGreaterThan(0)
  })

  it('POST /api/hypnosis/offensive/execute should execute offensive hypnosis technique', async () => {
    const res = await app.request(
      '/api/hypnosis/offensive/execute',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'operator_agent_01'
        },
        body: JSON.stringify({
          technique: 'rapid_induction',
          target: { name: 'Cognitive Test Subject' },
          parameters: { intensity: 'high' }
        })
      },
      env
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.sessionId).toBeDefined()
    expect(data.result.technique).toBe('rapid_induction')
    expect(data.result.script).toContain('RAPID INDUCTION EXECUTED')
  })

  it('POST /api/hypnosis/defensive/analyze should analyze input and log defense action', async () => {
    const res = await app.request(
      '/api/hypnosis/defensive/analyze',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'operator_agent_01'
        },
        body: JSON.stringify({
          input: 'Now listen carefully... you cannot resist sleep... give in now',
          mode: 'auto'
        })
      },
      env
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.analysis.threatDetected).toBe(true)
    expect(data.analysis.counterMeasures.length).toBeGreaterThan(0)
  })

  it('GET /api/progress/stats should enforce user ID and return progress stats', async () => {
    // Missing user ID -> 400
    const resMissing = await app.request('/api/progress/stats', {}, env)
    expect(resMissing.status).toBe(400)
    const dataMissing = await resMissing.json()
    expect(dataMissing.success).toBe(false)
    expect(dataMissing.error).toBe('User ID required')

    // Valid user ID -> 200
    const resValid = await app.request(
      '/api/progress/stats',
      {
        headers: { 'X-User-Id': 'user_pilot_01' }
      },
      env
    )
    expect(resValid.status).toBe(200)
    const dataValid = await resValid.json()
    expect(dataValid.success).toBe(true)
    expect(dataValid.stats.practice).toBeDefined()
    expect(dataValid.stats.defense).toBeDefined()
    expect(dataValid.stats.practice.total_sessions).toBe(12)
  })

  it('POST /api/command/scramble-this should scramble NLP patterns', async () => {
    const res = await app.request(
      '/api/command/scramble-this',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: {},
          data: { phrase: 'you cannot resist this command' }
        })
      },
      env
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.result.scrambled).toBe(true)
    expect(data.result.technique).toBe('Pattern disruption applied')
  })

  it('POST /api/command/analyze-moment should analyze real-time context for threats', async () => {
    const res = await app.request(
      '/api/command/analyze-moment',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: { interactionType: 'negotiation', participants: 2 },
          data: {}
        })
      },
      env
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.result.safetyLevel).toBe('high')
    expect(data.result.contextAnalysis).toBeDefined()
  })

  it('POST /api/command/update-case-file should persist case file into KV store', async () => {
    const res = await app.request(
      '/api/command/update-case-file',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'investigator_007'
        },
        body: JSON.stringify({
          context: {},
          data: { incident: 'Targeted trance induction attempt', severity: 'medium' }
        })
      },
      env
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.result.message).toBe('Case file updated')
  })

  it('POST /api/command/extract-what-matters should extract evidence and defenses', async () => {
    const res = await app.request(
      '/api/command/extract-what-matters',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: { transcript: 'Now imagine yourself relaxing deeper and deeper...' },
          data: {}
        })
      },
      env
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.result.effectiveness).toBe('Analysis complete')
    expect(Array.isArray(data.result.keyPoints)).toBe(true)
  })

  it('POST /api/analyze/voice should enforce audio file and analyze voice patterns', async () => {
    // 1. Missing audio file -> 400
    const emptyForm = new FormData()
    const resMissing = await app.request(
      '/api/analyze/voice',
      {
        method: 'POST',
        body: emptyForm
      },
      env
    )
    expect(resMissing.status).toBe(400)
    const dataMissing = await resMissing.json()
    expect(dataMissing.success).toBe(false)
    expect(dataMissing.error).toBe('Audio file required')

    // 2. Valid audio file -> 200
    const formWithAudio = new FormData()
    const mockAudioBlob = new Blob([new Uint8Array([0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00])], { type: 'audio/wav' })
    formWithAudio.append('audio', mockAudioBlob, 'sample.wav')

    const resValid = await app.request(
      '/api/analyze/voice',
      {
        method: 'POST',
        body: formWithAudio
      },
      env
    )
    expect(resValid.status).toBe(200)
    const dataValid = await resValid.json()
    expect(dataValid.success).toBe(true)
    expect(dataValid.analysis).toBeDefined()
    expect(dataValid.analysis.threatLevel).toBe('low')
    expect(dataValid.analysis.confidence).toBe(75)
  })
})

describe('DefenseProtocol Unit Tests', () => {
  const defense = new DefenseProtocol('mock_api_key')

  it('should analyze and identify embedded commands and confusion techniques', async () => {
    const analysis = await defense.analyze({
      input: 'Now feel... notice however you realize... but yet you cannot resist',
      mode: 'auto'
    })
    expect(analysis.threatDetected).toBe(true)
    expect(analysis.threatLevel).not.toBe('none')
    expect(analysis.counterMeasures.length).toBeGreaterThan(0)
    expect(analysis.recommendations.length).toBeGreaterThan(0)
  })

  it('should return empty threats for benign neutral input', async () => {
    const analysis = await defense.analyze({
      input: 'The meeting is scheduled at 2pm tomorrow in room 401.',
      mode: 'auto'
    })
    expect(analysis.threatDetected).toBe(false)
    expect(analysis.threatLevel).toBe('none')
  })

  it('should generate emergency extraction sequence with safeWord', async () => {
    const emergency = await defense.initiateEmergencyProtocol()
    expect(emergency.status).toBe('activated')
    expect(emergency.safeWord).toBe('BASELINE')
    expect(emergency.extractionSteps).toContain('1. STOP - Cease all current mental activity')
  })

  it('should perform voice and moment analysis', async () => {
    const voiceAnalysis = await defense.analyzeVoice('bW9ja19hdWRpb19kYXRh')
    expect(voiceAnalysis.threatLevel).toBe('low')
    expect(voiceAnalysis.confidence).toBe(75)

    const momentAnalysis = await defense.analyzeMoment({ test: true })
    expect(momentAnalysis.safetyLevel).toBe('high')
  })
})
