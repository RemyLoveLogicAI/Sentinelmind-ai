import { describe, it, expect, beforeEach } from 'vitest'
import app from '../src/index'
import { DefenseProtocol } from '../src/lib/defense-protocol'

const createMockEnv = () => {
  const kvStore = new Map<string, string>()
  return {
    AI_API_KEY: 'test_mock_ai_key',
    DB: {
      prepare: (sql: string) => ({
        bind: (...args: any[]) => ({
          run: async () => ({ meta: { last_row_id: 1, changes: 1 } }),
          all: async () => ({ results: [] }),
          first: async () => null
        }),
        run: async () => ({ meta: { last_row_id: 1, changes: 1 } }),
        all: async () => ({ results: [] }),
        first: async () => null
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
})
