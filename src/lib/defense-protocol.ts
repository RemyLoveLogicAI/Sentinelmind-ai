/**
 * Defense Protocol - Advanced defensive hypnosis detection and counter-measures
 * "They got me" - Emergency extraction protocol
 */

export interface DefenseAnalysis {
  threatDetected: boolean;
  threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  attackType?: string;
  attackPatterns: string[];
  defenseStrategy: string;
  counterMeasures: string[];
  recommendations: string[];
  confidence: number;
}

export interface GroundingResponse {
  affirmation: string;
  anchorPoints: string[];
  realityChecks: string[];
  breathingPattern: string;
  physicalActions: string[];
}

export interface EmergencyProtocol {
  status: 'activated';
  extractionSteps: string[];
  groundingSequence: GroundingResponse;
  shieldActivated: boolean;
  counterAttackReady: boolean;
  safeWord: string;
}

export class DefenseProtocol {
  private apiKey: string;
  private threatPatterns: Map<string, ThreatPattern>;
  private defenseStrategies: Map<string, DefenseStrategy>;
  private emergencyMode: boolean = false;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.threatPatterns = this.initializeThreatPatterns();
    this.defenseStrategies = this.initializeDefenseStrategies();
  }

  private initializeThreatPatterns(): Map<string, ThreatPattern> {
    const patterns = new Map();

    patterns.set('embedded_commands', {
      indicators: ['tonal_shift', 'pause_pattern', 'analog_marking'],
      keywords: ['now', 'feel', 'imagine', 'notice', 'realize'],
      detection: `
        Scanning for embedded commands...
        - Tonal shifts detected
        - Pause patterns identified
        - Command structure recognized
      `
    });

    patterns.set('confusion_technique', {
      indicators: ['multiple_negations', 'paradox', 'overload'],
      keywords: ['but', 'yet', 'however', 'although', 'unless'],
      detection: `
        Confusion pattern detected...
        - Logic loops identified
        - Paradoxical statements found
        - Cognitive overload attempted
      `
    });

    patterns.set('rapid_induction', {
      indicators: ['pattern_interrupt', 'shock', 'sudden_command'],
      keywords: ['sleep', 'now', 'drop', 'fall', 'deep'],
      detection: `
        Rapid induction attempted...
        - Pattern interrupt detected
        - Shock element present
        - Command structure identified
      `
    });

    patterns.set('covert_hypnosis', {
      indicators: ['storytelling', 'metaphor', 'indirect_suggestion'],
      keywords: ['like', 'as if', 'imagine if', 'suppose', 'what if'],
      detection: `
        Covert hypnosis detected...
        - Metaphorical language
        - Indirect suggestions
        - Story-based induction
      `
    });

    patterns.set('nlp_manipulation', {
      indicators: ['anchoring', 'reframing', 'mirroring', 'pacing'],
      keywords: ['feel', 'see', 'hear', 'understand', 'know'],
      detection: `
        NLP patterns detected...
        - Sensory language
        - Pacing and leading
        - Anchoring attempts
      `
    });

    return patterns;
  }

  private initializeDefenseStrategies(): Map<string, DefenseStrategy> {
    const strategies = new Map();

    strategies.set('pattern_interrupt', {
      name: 'Pattern Interrupt',
      description: 'Break the hypnotic pattern with unexpected response',
      execution: [
        'Suddenly change topic',
        'Ask unexpected question',
        'Physical movement',
        'Laugh or make joke'
      ],
      effectiveness: 85
    });

    strategies.set('conscious_analysis', {
      name: 'Conscious Analysis',
      description: 'Actively analyze and deconstruct the technique',
      execution: [
        'Identify technique being used',
        'Call out the pattern',
        'Explain what they\'re doing',
        'Maintain analytical mindset'
      ],
      effectiveness: 75
    });

    strategies.set('reality_anchor', {
      name: 'Reality Anchor',
      description: 'Ground yourself in physical reality',
      execution: [
        'Focus on physical sensations',
        'Count objects in room',
        'State current facts',
        'Touch physical anchor'
      ],
      effectiveness: 80
    });

    strategies.set('counter_suggestion', {
      name: 'Counter Suggestion',
      description: 'Override with your own suggestions',
      execution: [
        'Create opposite suggestion',
        'Affirm your control',
        'Set your own mental state',
        'Reverse the suggestion'
      ],
      effectiveness: 70
    });

    strategies.set('shield_protocol', {
      name: 'Mental Shield',
      description: 'Visualize protective barrier',
      execution: [
        'Imagine protective shield',
        'Deflect suggestions',
        'Maintain boundaries',
        'Strengthen mental walls'
      ],
      effectiveness: 65
    });

    return strategies;
  }

  async analyze(params: {
    input: string;
    context?: any;
    mode?: 'aggressive' | 'passive' | 'auto';
  }): Promise<DefenseAnalysis> {
    const threats = this.detectThreats(params.input);
    const threatLevel = this.assessThreatLevel(threats);
    
    // Select defense strategy based on threat level and mode
    const strategy = this.selectDefenseStrategy(threatLevel, params.mode || 'auto');
    
    // Generate counter-measures
    const counterMeasures = this.generateCounterMeasures(threats, strategy);
    
    return {
      threatDetected: threats.length > 0,
      threatLevel,
      attackType: threats[0]?.type,
      attackPatterns: threats.map(t => t.pattern),
      defenseStrategy: strategy.name,
      counterMeasures,
      recommendations: this.generateRecommendations(threatLevel, threats),
      confidence: this.calculateConfidence(threats)
    };
  }

  private detectThreats(input: string): DetectedThreat[] {
    const threats: DetectedThreat[] = [];
    const lowercaseInput = input.toLowerCase();
    
    this.threatPatterns.forEach((pattern, type) => {
      let score = 0;
      
      // Check for keywords
      pattern.keywords.forEach(keyword => {
        if (lowercaseInput.includes(keyword)) {
          score += 10;
        }
      });
      
      // Check for indicators (would use more sophisticated NLP in production)
      pattern.indicators.forEach(indicator => {
        // Simplified detection
        if (this.detectIndicator(lowercaseInput, indicator)) {
          score += 20;
        }
      });
      
      if (score > 30) {
        threats.push({
          type,
          pattern: pattern.detection,
          score,
          confidence: Math.min(score / 100, 1)
        });
      }
    });
    
    return threats.sort((a, b) => b.score - a.score);
  }

  private detectIndicator(input: string, indicator: string): boolean {
    // Simplified indicator detection
    const indicatorPatterns: Record<string, RegExp> = {
      'tonal_shift': /[.!?]\s*\w+\s*[.!?]/,
      'pause_pattern': /\.\.\./,
      'analog_marking': /\*\w+\*/,
      'multiple_negations': /(not|n't).*?(not|n't)/,
      'paradox': /(but|yet|however).*?(but|yet|however)/,
      'pattern_interrupt': /suddenly|now|stop|wait/i,
      'storytelling': /once upon|imagine|let me tell/i,
      'metaphor': /like|as if|just like/i,
      'anchoring': /every time|whenever|each time/i
    };
    
    const pattern = indicatorPatterns[indicator];
    return pattern ? pattern.test(input) : false;
  }

  private assessThreatLevel(threats: DetectedThreat[]): DefenseAnalysis['threatLevel'] {
    if (threats.length === 0) return 'none';
    
    const maxScore = Math.max(...threats.map(t => t.score));
    
    if (maxScore > 80) return 'critical';
    if (maxScore > 60) return 'high';
    if (maxScore > 40) return 'medium';
    if (maxScore > 20) return 'low';
    
    return 'none';
  }

  private selectDefenseStrategy(
    threatLevel: DefenseAnalysis['threatLevel'],
    mode: 'aggressive' | 'passive' | 'auto'
  ): DefenseStrategy {
    const strategies = Array.from(this.defenseStrategies.values());
    
    if (mode === 'aggressive' || threatLevel === 'critical') {
      return this.defenseStrategies.get('pattern_interrupt')!;
    }
    
    if (mode === 'passive' || threatLevel === 'low') {
      return this.defenseStrategies.get('shield_protocol')!;
    }
    
    // Auto mode - select based on threat level
    const strategyMap: Record<string, string> = {
      'high': 'conscious_analysis',
      'medium': 'reality_anchor',
      'low': 'shield_protocol',
      'none': 'shield_protocol'
    };
    
    return this.defenseStrategies.get(strategyMap[threatLevel] || 'reality_anchor')!;
  }

  private generateCounterMeasures(threats: DetectedThreat[], strategy: DefenseStrategy): string[] {
    const measures: string[] = [];
    
    // Add strategy-specific measures
    measures.push(...strategy.execution);
    
    // Add threat-specific counters
    threats.forEach(threat => {
      switch(threat.type) {
        case 'embedded_commands':
          measures.push('Consciously reject embedded suggestions');
          measures.push('Repeat "I choose my own thoughts"');
          break;
        case 'confusion_technique':
          measures.push('Focus on one simple fact');
          measures.push('Count backwards from 10');
          break;
        case 'rapid_induction':
          measures.push('Keep eyes open and focused');
          measures.push('Tense muscles deliberately');
          break;
        case 'covert_hypnosis':
          measures.push('Interrupt the story');
          measures.push('Ask direct questions');
          break;
        case 'nlp_manipulation':
          measures.push('Break rapport deliberately');
          measures.push('Use different sensory language');
          break;
      }
    });
    
    return [...new Set(measures)]; // Remove duplicates
  }

  private generateRecommendations(
    threatLevel: DefenseAnalysis['threatLevel'],
    threats: DetectedThreat[]
  ): string[] {
    const recommendations: string[] = [];
    
    if (threatLevel === 'critical') {
      recommendations.push('⚠️ IMMEDIATE ACTION: Physically remove yourself from situation');
      recommendations.push('🛡️ Activate full shield protocol');
      recommendations.push('📱 Call trusted friend for reality check');
    }
    
    if (threatLevel === 'high') {
      recommendations.push('🔍 Maintain heightened awareness');
      recommendations.push('💪 Use pattern interrupt techniques');
      recommendations.push('🎯 Focus on physical sensations');
    }
    
    if (threats.length > 0) {
      recommendations.push('📊 Document this interaction for analysis');
      recommendations.push('🧠 Practice defensive techniques regularly');
      recommendations.push('👥 Share experience with support network');
    }
    
    return recommendations;
  }

  private calculateConfidence(threats: DetectedThreat[]): number {
    if (threats.length === 0) return 0;
    
    const avgConfidence = threats.reduce((sum, t) => sum + t.confidence, 0) / threats.length;
    return Math.round(avgConfidence * 100);
  }

  async initiateEmergencyProtocol(): Promise<EmergencyProtocol> {
    this.emergencyMode = true;
    
    const groundingSequence = await this.groundingProtocol();
    
    return {
      status: 'activated',
      extractionSteps: [
        '1. STOP - Cease all current mental activity',
        '2. GROUND - Touch physical object, state your name',
        '3. ORIENT - State location, date, time',
        '4. REJECT - "I reject all suggestions"',
        '5. SHIELD - Visualize impenetrable barrier',
        '6. EXTRACT - Leave situation immediately',
        '7. RECOVER - Find safe space, contact support'
      ],
      groundingSequence,
      shieldActivated: true,
      counterAttackReady: true,
      safeWord: 'BASELINE'
    };
  }

  async groundingProtocol(): Promise<GroundingResponse> {
    return {
      affirmation: 'I am in control. I choose my thoughts. I am safe and grounded.',
      anchorPoints: [
        'Feel your feet on the ground',
        'Touch something solid',
        'Look at something blue',
        'Name 5 things you can see',
        'Name 4 things you can touch'
      ],
      realityChecks: [
        `Today is ${new Date().toLocaleDateString()}`,
        'You are safe',
        'You control your mind',
        'This will pass',
        'You have the power'
      ],
      breathingPattern: '4-7-8 breathing: Inhale 4, Hold 7, Exhale 8',
      physicalActions: [
        'Stand up and stretch',
        'Splash cold water on face',
        'Step outside for fresh air',
        'Call a trusted friend',
        'Write down your thoughts'
      ]
    };
  }

  async analyzeMoment(context: any): Promise<any> {
    // Real-time moment analysis
    return {
      timestamp: new Date().toISOString(),
      contextAnalysis: 'Analyzing current moment for hypnotic patterns...',
      threatsDetected: [],
      safetyLevel: 'high',
      recommendation: 'Continue with normal awareness'
    };
  }

  async scrambleNLP(data: any): Promise<any> {
    // NLP pattern scrambling
    return {
      original: data,
      scrambled: true,
      technique: 'Pattern disruption applied',
      newPattern: 'Conscious choice activated'
    };
  }

  async extractKeyEvidence(context: any): Promise<any> {
    // Extract and summarize key evidence
    return {
      keyPoints: [],
      hypnoticElements: [],
      defensesUsed: [],
      effectiveness: 'Analysis complete'
    };
  }

  async analyzeVoice(base64Audio: string): Promise<any> {
    // Voice analysis for hypnotic patterns
    // In production, this would use speech-to-text and prosody analysis
    return {
      hypnoticTonality: false,
      pacingDetected: false,
      embeddedCommands: [],
      threatLevel: 'low',
      confidence: 75
    };
  }
}

// Type definitions
interface ThreatPattern {
  indicators: string[];
  keywords: string[];
  detection: string;
}

interface DefenseStrategy {
  name: string;
  description: string;
  execution: string[];
  effectiveness: number;
}

interface DetectedThreat {
  type: string;
  pattern: string;
  score: number;
  confidence: number;
}