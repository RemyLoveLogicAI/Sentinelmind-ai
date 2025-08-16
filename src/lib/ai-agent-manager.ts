/**
 * AI Agent Manager - Manages different AI agents for hypnosis practice and execution
 */

export interface AgentProfile {
  id: string;
  name: string;
  type: 'susceptible' | 'resistant' | 'offensive' | 'defensive';
  personality: string;
  skillLevel: number; // 1-10
  adaptability: number; // 1-10
  specialties: string[];
  weaknesses: string[];
  currentState: AgentState;
}

export interface AgentState {
  tranceDepth: number; // 0-100
  resistance: number; // 0-100
  suggestibility: number; // 0-100
  awareness: number; // 0-100
  emotional: string;
  history: InteractionHistory[];
}

export interface InteractionHistory {
  timestamp: Date;
  technique: string;
  effectiveness: number;
  response: string;
}

export interface PracticeAgentConfig {
  type: 'susceptible' | 'resistant' | 'offensive';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  adaptiveLearning: boolean;
  personality?: string;
}

export class AIAgentManager {
  private apiKey: string;
  private agents: Map<string, PracticeAgent>;
  private learningData: Map<string, LearningProfile>;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.agents = new Map();
    this.learningData = new Map();
  }

  async createPracticeAgent(config: PracticeAgentConfig): Promise<PracticeAgent> {
    const agentId = this.generateAgentId();
    const profile = this.generateAgentProfile(config);
    
    const agent = new PracticeAgent(agentId, profile, config);
    this.agents.set(agentId, agent);
    
    // Initialize learning profile
    this.learningData.set(agentId, {
      totalInteractions: 0,
      techniqueEffectiveness: new Map(),
      adaptationLevel: 0,
      userPatterns: []
    });
    
    return agent;
  }

  async getAgent(type: string): Promise<OffensiveAgent | DefensiveAgent> {
    switch(type) {
      case 'offensive':
        return new OffensiveAgent(this.apiKey);
      case 'defensive':
        return new DefensiveAgent(this.apiKey);
      default:
        throw new Error(`Unknown agent type: ${type}`);
    }
  }

  private generateAgentId(): string {
    return `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateAgentProfile(config: PracticeAgentConfig): AgentProfile {
    const profiles: Record<string, Partial<AgentProfile>> = {
      susceptible_easy: {
        name: 'Alex (Highly Susceptible)',
        personality: 'Trusting, imaginative, and eager to experience hypnosis',
        skillLevel: 2,
        adaptability: 3,
        specialties: [],
        weaknesses: ['visualization', 'relaxation', 'trust'],
        currentState: {
          tranceDepth: 0,
          resistance: 10,
          suggestibility: 90,
          awareness: 50,
          emotional: 'curious',
          history: []
        }
      },
      susceptible_medium: {
        name: 'Jordan (Moderately Susceptible)',
        personality: 'Open-minded but occasionally analytical',
        skillLevel: 4,
        adaptability: 5,
        specialties: ['pattern_recognition'],
        weaknesses: ['confusion', 'fractionation'],
        currentState: {
          tranceDepth: 0,
          resistance: 30,
          suggestibility: 70,
          awareness: 60,
          emotional: 'neutral',
          history: []
        }
      },
      resistant_hard: {
        name: 'Morgan (Highly Resistant)',
        personality: 'Skeptical, analytical, and consciously resistant',
        skillLevel: 7,
        adaptability: 8,
        specialties: ['critical_thinking', 'pattern_detection', 'conscious_resistance'],
        weaknesses: ['overload', 'double_binds'],
        currentState: {
          tranceDepth: 0,
          resistance: 80,
          suggestibility: 20,
          awareness: 90,
          emotional: 'skeptical',
          history: []
        }
      },
      offensive_expert: {
        name: 'Dr. Shadow (Master Hypnotist)',
        personality: 'Cunning, adaptive, uses advanced techniques',
        skillLevel: 10,
        adaptability: 10,
        specialties: ['rapid_induction', 'covert_hypnosis', 'nlp_mastery', 'confusion_techniques'],
        weaknesses: [],
        currentState: {
          tranceDepth: 0,
          resistance: 95,
          suggestibility: 5,
          awareness: 100,
          emotional: 'focused',
          history: []
        }
      }
    };

    const key = `${config.type}_${config.difficulty}`;
    const baseProfile = profiles[key] || profiles.susceptible_easy;

    return {
      id: this.generateAgentId(),
      type: config.type,
      ...baseProfile
    } as AgentProfile;
  }

  updateLearningProfile(agentId: string, interaction: InteractionHistory): void {
    const profile = this.learningData.get(agentId);
    if (!profile) return;

    profile.totalInteractions++;
    
    // Update technique effectiveness
    const current = profile.techniqueEffectiveness.get(interaction.technique) || {
      count: 0,
      totalEffectiveness: 0
    };
    
    current.count++;
    current.totalEffectiveness += interaction.effectiveness;
    profile.techniqueEffectiveness.set(interaction.technique, current);
    
    // Adapt agent based on learning
    if (profile.totalInteractions % 5 === 0) {
      this.adaptAgent(agentId);
    }
  }

  private adaptAgent(agentId: string): void {
    const agent = this.agents.get(agentId);
    const learning = this.learningData.get(agentId);
    
    if (!agent || !learning) return;
    
    // Increase adaptation level
    learning.adaptationLevel++;
    
    // Adjust agent resistance based on technique effectiveness
    learning.techniqueEffectiveness.forEach((data, technique) => {
      const avgEffectiveness = data.totalEffectiveness / data.count;
      
      if (avgEffectiveness > 70) {
        // Agent learns to resist this technique
        agent.profile.currentState.resistance += 5;
        agent.addResistancePattern(technique);
      }
    });
    
    // Cap resistance at reasonable levels
    agent.profile.currentState.resistance = Math.min(95, agent.profile.currentState.resistance);
  }
}

export class PracticeAgent {
  public id: string;
  public profile: AgentProfile;
  private config: PracticeAgentConfig;
  private resistancePatterns: Set<string>;
  private responseGenerator: ResponseGenerator;

  constructor(id: string, profile: AgentProfile, config: PracticeAgentConfig) {
    this.id = id;
    this.profile = profile;
    this.config = config;
    this.resistancePatterns = new Set();
    this.responseGenerator = new ResponseGenerator(profile);
  }

  async respond(technique: string, content: string): Promise<AgentResponse> {
    // Check if agent has learned to resist this technique
    const hasResistance = this.resistancePatterns.has(technique);
    const resistanceBonus = hasResistance ? 20 : 0;
    
    // Calculate effectiveness based on current state
    const effectiveness = this.calculateEffectiveness(technique, resistanceBonus);
    
    // Generate response based on effectiveness
    const response = await this.responseGenerator.generate(
      technique,
      content,
      effectiveness,
      this.profile.currentState
    );
    
    // Update agent state
    this.updateState(technique, effectiveness);
    
    // Record interaction
    this.profile.currentState.history.push({
      timestamp: new Date(),
      technique,
      effectiveness,
      response: response.verbal
    });
    
    return response;
  }

  private calculateEffectiveness(technique: string, resistanceBonus: number): number {
    const baseEffectiveness = 50;
    const suggestibilityFactor = this.profile.currentState.suggestibility / 100;
    const resistanceFactor = (100 - this.profile.currentState.resistance - resistanceBonus) / 100;
    const awarenessPenalty = (this.profile.currentState.awareness / 100) * 20;
    
    let effectiveness = baseEffectiveness * suggestibilityFactor * resistanceFactor - awarenessPenalty;
    
    // Technique-specific modifiers
    if (this.profile.weaknesses.includes(technique)) {
      effectiveness += 30;
    }
    
    if (this.profile.specialties.includes(`resist_${technique}`)) {
      effectiveness -= 30;
    }
    
    return Math.max(0, Math.min(100, effectiveness));
  }

  private updateState(technique: string, effectiveness: number): void {
    const state = this.profile.currentState;
    
    // Update trance depth
    if (effectiveness > 50) {
      state.tranceDepth = Math.min(100, state.tranceDepth + effectiveness / 10);
    }
    
    // Update awareness (decreases with trance depth)
    state.awareness = Math.max(10, 100 - state.tranceDepth);
    
    // Update suggestibility (increases with trance depth)
    state.suggestibility = Math.min(95, 30 + state.tranceDepth * 0.7);
    
    // Update emotional state
    if (effectiveness > 70) {
      state.emotional = 'compliant';
    } else if (effectiveness > 40) {
      state.emotional = 'relaxed';
    } else if (effectiveness < 20) {
      state.emotional = 'resistant';
    }
  }

  addResistancePattern(technique: string): void {
    this.resistancePatterns.add(technique);
  }

  getProfile(): AgentProfile {
    return this.profile;
  }

  getInstructions(): string {
    const instructions = {
      susceptible: `
This practice partner is ${this.profile.name}.
They are ${this.profile.personality}.

Current State:
- Trance Depth: ${this.profile.currentState.tranceDepth}%
- Resistance: ${this.profile.currentState.resistance}%
- Suggestibility: ${this.profile.currentState.suggestibility}%

Weaknesses: ${this.profile.weaknesses.join(', ')}

Try different induction techniques and observe their responses.
The agent will adapt to your techniques over time, becoming more challenging.
      `,
      resistant: `
This practice partner is ${this.profile.name}.
They are ${this.profile.personality}.

Current Defense Level: ${this.profile.currentState.resistance}%
Specialties: ${this.profile.specialties.join(', ')}

This is a challenging subject. They will actively resist your attempts.
Look for their weaknesses: ${this.profile.weaknesses.join(', ')}

The agent learns from your techniques and becomes more resistant over time.
      `,
      offensive: `
WARNING: This is ${this.profile.name}.
They are ${this.profile.personality}.

Skills: ${this.profile.specialties.join(', ')}
Threat Level: ${this.profile.skillLevel}/10

They will attempt to hypnotize YOU. Practice your defensive techniques.
Stay aware and use the defense protocols when needed.

Say "They got me" if you need emergency extraction.
      `
    };

    return instructions[this.config.type] || instructions.susceptible;
  }
}

export class OffensiveAgent {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async execute(params: {
    technique: string;
    target: any;
    parameters: any;
    sessionId: string;
  }): Promise<OffensiveResult> {
    // Implement offensive hypnosis execution
    const techniques: Record<string, Function> = {
      rapid_induction: this.executeRapidInduction,
      covert_induction: this.executeCovertInduction,
      embedded_command: this.executeEmbeddedCommand,
      confusion_technique: this.executeConfusionTechnique
    };

    const executor = techniques[params.technique];
    if (!executor) {
      throw new Error(`Unknown offensive technique: ${params.technique}`);
    }

    return await executor.call(this, params);
  }

  private async executeRapidInduction(params: any): Promise<OffensiveResult> {
    return {
      success: true,
      technique: 'rapid_induction',
      script: `
[RAPID INDUCTION EXECUTED]

LOOK HERE... [gesture]
That's right... focus...
And... SLEEP! [snap]

Subject entering trance rapidly.
Depth: 70%
Resistance: Bypassed
      `,
      effectiveness: 70,
      nextSteps: ['deepen', 'suggest', 'fractionate']
    };
  }

  private async executeCovertInduction(params: any): Promise<OffensiveResult> {
    return {
      success: true,
      technique: 'covert_induction',
      script: `
[COVERT INDUCTION IN PROGRESS]

Embedded patterns woven into conversation...
Subject unaware of induction...
Gradual shift in consciousness detected...

Stealth level: 90%
Detection risk: Low
      `,
      effectiveness: 60,
      nextSteps: ['maintain_cover', 'deepen_covertly', 'embed_suggestion']
    };
  }

  private async executeEmbeddedCommand(params: any): Promise<OffensiveResult> {
    return {
      success: true,
      technique: 'embedded_command',
      script: `
[EMBEDDED COMMAND PLACED]

Command: "${params.parameters?.command || 'RELAX NOW'}"
Delivery: Analog marked with tonal shift
Bypass: Critical factor circumvented

Integration: 80%
      `,
      effectiveness: 75,
      nextSteps: ['reinforce', 'test_compliance', 'layer_suggestions']
    };
  }

  private async executeConfusionTechnique(params: any): Promise<OffensiveResult> {
    return {
      success: true,
      technique: 'confusion_technique',
      script: `
[CONFUSION OVERLOAD INITIATED]

Multiple reality loops created...
Conscious mind overwhelmed...
Unconscious receptivity increased...

Confusion level: 85%
Suggestibility window: OPEN
      `,
      effectiveness: 80,
      nextSteps: ['insert_suggestion', 'stabilize_trance', 'utilize_confusion']
    };
  }
}

export class DefensiveAgent {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async defend(attack: any): Promise<DefenseResult> {
    // Implement defensive responses
    return {
      success: true,
      defenseUsed: 'pattern_interrupt',
      counterMeasure: 'reframe',
      message: 'Attack detected and neutralized'
    };
  }
}

// Response Generator for practice agents
class ResponseGenerator {
  private profile: AgentProfile;

  constructor(profile: AgentProfile) {
    this.profile = profile;
  }

  async generate(
    technique: string,
    content: string,
    effectiveness: number,
    state: AgentState
  ): Promise<AgentResponse> {
    const responses: Record<string, () => AgentResponse> = {
      high_effectiveness: () => ({
        verbal: this.getHighEffectivenessResponse(),
        physical: 'Eyes closing, body relaxing, breathing slowing',
        cognitive: 'Reduced critical thinking, increased suggestibility',
        effectiveness
      }),
      medium_effectiveness: () => ({
        verbal: this.getMediumEffectivenessResponse(),
        physical: 'Some relaxation, occasional eye flutter',
        cognitive: 'Partial focus, some analytical thought remaining',
        effectiveness
      }),
      low_effectiveness: () => ({
        verbal: this.getLowEffectivenessResponse(),
        physical: 'Alert, possibly tensing',
        cognitive: 'Fully analytical, detecting techniques',
        effectiveness
      })
    };

    if (effectiveness > 70) {
      return responses.high_effectiveness();
    } else if (effectiveness > 40) {
      return responses.medium_effectiveness();
    } else {
      return responses.low_effectiveness();
    }
  }

  private getHighEffectivenessResponse(): string {
    const responses = [
      "Mmm... yes... feeling so relaxed...",
      "Going deeper... can't resist...",
      "So heavy... so comfortable...",
      "Yes... whatever you say..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getMediumEffectivenessResponse(): string {
    const responses = [
      "I feel... different... but still here...",
      "That's... interesting... I can feel something...",
      "Part of me wants to let go...",
      "I'm relaxed but... still aware..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getLowEffectivenessResponse(): string {
    const responses = [
      "I see what you're trying to do.",
      "That technique won't work on me.",
      "Nice try, but I'm fully aware.",
      "I'm consciously resisting that suggestion."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Type definitions
interface LearningProfile {
  totalInteractions: number;
  techniqueEffectiveness: Map<string, { count: number; totalEffectiveness: number }>;
  adaptationLevel: number;
  userPatterns: string[];
}

interface AgentResponse {
  verbal: string;
  physical: string;
  cognitive: string;
  effectiveness: number;
}

interface OffensiveResult {
  success: boolean;
  technique: string;
  script: string;
  effectiveness: number;
  nextSteps: string[];
}

interface DefenseResult {
  success: boolean;
  defenseUsed: string;
  counterMeasure: string;
  message: string;
}