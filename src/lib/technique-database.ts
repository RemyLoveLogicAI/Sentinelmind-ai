/**
 * Technique Database - Comprehensive hypnosis techniques library
 */

export interface Technique {
  id: string;
  name: string;
  category: TechniqueCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master';
  type: 'offensive' | 'defensive' | 'neutral';
  description: string;
  script: string;
  steps: string[];
  duration: number; // in minutes
  effectiveness: number; // 0-100
  requirements: string[];
  contraindications: string[];
  variations: TechniqueVariation[];
  counters: string[]; // IDs of techniques that counter this one
  tags: string[];
}

export interface TechniqueVariation {
  name: string;
  description: string;
  modification: string;
  difficulty_modifier: number;
}

export type TechniqueCategory = 
  | 'induction'
  | 'deepener'
  | 'suggestion'
  | 'emergence'
  | 'nlp'
  | 'defensive'
  | 'analytical'
  | 'covert'
  | 'rapid'
  | 'therapeutic';

export class TechniqueDatabase {
  private techniques: Map<string, Technique>;
  private categories: Map<TechniqueCategory, string[]>;

  constructor() {
    this.techniques = new Map();
    this.categories = new Map();
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    // Offensive Techniques
    this.addTechnique({
      id: 'rapid_handshake',
      name: 'Rapid Handshake Induction',
      category: 'rapid',
      difficulty: 'advanced',
      type: 'offensive',
      description: 'Instant induction using handshake pattern interrupt',
      script: `
[HANDSHAKE INDUCTION]
1. Extend hand for normal handshake
2. As they reach, grasp wrist with other hand
3. Interrupt pattern: "SLEEP!" with downward motion
4. Support and deepen immediately
      `,
      steps: [
        'Initiate handshake',
        'Pattern interrupt at contact',
        'Command with physical guide',
        'Immediate deepening'
      ],
      duration: 0.5,
      effectiveness: 85,
      requirements: ['Physical proximity', 'Element of surprise', 'Confidence'],
      contraindications: ['Anxiety disorders', 'PTSD', 'Trust issues'],
      variations: [
        {
          name: 'Slow Handshake',
          description: 'Gradual pattern interrupt',
          modification: 'Slow the handshake progressively',
          difficulty_modifier: -10
        }
      ],
      counters: ['pattern_awareness', 'physical_resistance'],
      tags: ['instant', 'shock', 'physical']
    });

    this.addTechnique({
      id: 'conversational_hypnosis',
      name: 'Conversational Hypnosis',
      category: 'covert',
      difficulty: 'master',
      type: 'offensive',
      description: 'Induce trance through normal conversation',
      script: `
[CONVERSATIONAL FLOW]
- Establish rapport through mirroring
- Use embedded commands: "You might FIND YOURSELF..."
- Layer suggestions within stories
- Utilize yes sets and compliance patterns
- Fractionate attention naturally
      `,
      steps: [
        'Build rapport and pacing',
        'Embed commands in speech',
        'Use metaphors and stories',
        'Layer multiple suggestions',
        'Test and utilize response'
      ],
      duration: 15,
      effectiveness: 70,
      requirements: ['Excellent rapport', 'Language skills', 'Subtlety'],
      contraindications: ['Suspicious subjects', 'Analytical personalities'],
      variations: [
        {
          name: 'Business Context',
          description: 'Covert hypnosis in professional setting',
          modification: 'Use business metaphors',
          difficulty_modifier: 5
        }
      ],
      counters: ['conscious_analysis', 'conversation_redirect'],
      tags: ['covert', 'linguistic', 'stealth']
    });

    this.addTechnique({
      id: 'confusion_overload',
      name: 'Confusion Overload Technique',
      category: 'induction',
      difficulty: 'advanced',
      type: 'offensive',
      description: 'Overwhelm conscious mind with contradictions',
      script: `
[CONFUSION PATTERN]
"As you sit there, standing here, you might wonder whether you're going up as you go down,
and the more you try to understand, the less you need to know,
because knowing is not knowing when you don't know what you know..."
      `,
      steps: [
        'Begin with simple contradictions',
        'Layer multiple confusions',
        'Increase pace and complexity',
        'Insert direct suggestion at peak',
        'Stabilize trance state'
      ],
      duration: 5,
      effectiveness: 75,
      requirements: ['Complex language patterns', 'Timing', 'Observation skills'],
      contraindications: ['Confusion anxiety', 'Cognitive disorders'],
      variations: [
        {
          name: 'Mathematical Confusion',
          description: 'Use numbers and calculations',
          modification: 'Incorporate counting patterns',
          difficulty_modifier: 0
        }
      ],
      counters: ['single_point_focus', 'logical_analysis'],
      tags: ['confusion', 'overload', 'cognitive']
    });

    // Defensive Techniques
    this.addTechnique({
      id: 'pattern_awareness',
      name: 'Pattern Awareness Protocol',
      category: 'defensive',
      difficulty: 'intermediate',
      type: 'defensive',
      description: 'Conscious recognition of hypnotic patterns',
      script: `
[AWARENESS PROTOCOL]
1. Monitor for language patterns
2. Notice tonal shifts and emphasis
3. Identify embedded commands
4. Recognize yes sets and compliance
5. Call out techniques when detected
      `,
      steps: [
        'Maintain analytical awareness',
        'Identify pattern types',
        'Verbalize recognition',
        'Break pattern flow',
        'Establish counter-pattern'
      ],
      duration: 0,
      effectiveness: 80,
      requirements: ['Knowledge of techniques', 'Mental alertness'],
      contraindications: [],
      variations: [
        {
          name: 'Silent Detection',
          description: 'Detect without revealing awareness',
          modification: 'Internal recognition only',
          difficulty_modifier: 10
        }
      ],
      counters: ['rapid_induction', 'shock_techniques'],
      tags: ['defense', 'awareness', 'analytical']
    });

    this.addTechnique({
      id: 'anchor_breaking',
      name: 'Anchor Breaking Technique',
      category: 'defensive',
      difficulty: 'advanced',
      type: 'defensive',
      description: 'Destroy or scramble hypnotic anchors',
      script: `
[ANCHOR BREAK]
1. Identify anchor (gesture, word, touch)
2. Scramble with random associations
3. Create competing anchors
4. Collapse anchor with opposite state
5. Test for effectiveness
      `,
      steps: [
        'Detect anchor installation',
        'Generate chaos pattern',
        'Install counter-anchor',
        'Collapse original anchor',
        'Verify neutralization'
      ],
      duration: 2,
      effectiveness: 85,
      requirements: ['Anchor awareness', 'State control'],
      contraindications: [],
      variations: [
        {
          name: 'Anchor Hijack',
          description: 'Take control of their anchor',
          modification: 'Reprogram anchor for your use',
          difficulty_modifier: 15
        }
      ],
      counters: [],
      tags: ['defense', 'nlp', 'anchor']
    });

    this.addTechnique({
      id: 'reality_testing',
      name: 'Reality Testing Protocol',
      category: 'defensive',
      difficulty: 'beginner',
      type: 'defensive',
      description: 'Ground in physical reality to prevent trance',
      script: `
[REALITY CHECK]
- State current date and time
- Name 5 things you can see
- Name 4 things you can touch
- Name 3 things you can hear
- Name 2 things you can smell
- Name 1 thing you can taste
      `,
      steps: [
        'Engage sensory awareness',
        'Verbalize observations',
        'Physical movement',
        'Temporal orientation',
        'Maintain groundedness'
      ],
      duration: 1,
      effectiveness: 70,
      requirements: ['Basic awareness'],
      contraindications: [],
      variations: [
        {
          name: 'Quick Ground',
          description: 'Rapid reality check',
          modification: 'Focus on one strong sensation',
          difficulty_modifier: -5
        }
      ],
      counters: ['sensory_deprivation', 'dissociation'],
      tags: ['defense', 'grounding', 'basic']
    });

    // NLP Techniques
    this.addTechnique({
      id: 'milton_model_mastery',
      name: 'Milton Model Language Patterns',
      category: 'nlp',
      difficulty: 'advanced',
      type: 'offensive',
      description: 'Artfully vague language for unconscious communication',
      script: `
[MILTON MODEL PATTERNS]
- Nominalizations: "Your learning, understanding, changing..."
- Unspecified verbs: "You can begin to wonder..."
- Presuppositions: "After you've gone into trance..."
- Mind reading: "I know you're curious..."
- Lost performatives: "It's good to relax..."
      `,
      steps: [
        'Establish vague language frame',
        'Layer presuppositions',
        'Use unspecified referents',
        'Create beneficial ambiguity',
        'Guide unconscious processing'
      ],
      duration: 10,
      effectiveness: 75,
      requirements: ['Language mastery', 'Subtlety', 'Calibration'],
      contraindications: ['Literal thinkers', 'Language barriers'],
      variations: [
        {
          name: 'Inverse Milton',
          description: 'Meta Model for precision',
          modification: 'Use specific language to break patterns',
          difficulty_modifier: 0
        }
      ],
      counters: ['meta_model_challenge', 'specific_questioning'],
      tags: ['nlp', 'language', 'milton']
    });

    this.addTechnique({
      id: 'double_bind',
      name: 'Double Bind Technique',
      category: 'nlp',
      difficulty: 'intermediate',
      type: 'offensive',
      description: 'Offer choices that lead to same outcome',
      script: `
[DOUBLE BIND STRUCTURE]
"Would you like to go into trance now, or in a few moments?"
"You can close your eyes now or when you're ready to relax"
"I don't know if you'll go deep quickly or take your time"
      `,
      steps: [
        'Frame presupposition',
        'Offer illusory choice',
        'Emphasize freedom',
        'Guide to outcome',
        'Utilize response'
      ],
      duration: 1,
      effectiveness: 65,
      requirements: ['Framing skills', 'Confidence'],
      contraindications: ['Oppositional subjects'],
      variations: [
        {
          name: 'Triple Bind',
          description: 'Three options, same outcome',
          modification: 'Add third alternative',
          difficulty_modifier: 5
        }
      ],
      counters: ['third_option', 'refuse_premise'],
      tags: ['nlp', 'choice', 'illusion']
    });
  }

  private addTechnique(technique: Technique): void {
    this.techniques.set(technique.id, technique);
    
    // Add to category index
    if (!this.categories.has(technique.category)) {
      this.categories.set(technique.category, []);
    }
    this.categories.get(technique.category)!.push(technique.id);
  }

  getTechnique(id: string): Technique | undefined {
    return this.techniques.get(id);
  }

  getTechniquesByCategory(category: TechniqueCategory): Technique[] {
    const ids = this.categories.get(category) || [];
    return ids.map(id => this.techniques.get(id)!).filter(Boolean);
  }

  getTechniquesByType(type: 'offensive' | 'defensive' | 'neutral'): Technique[] {
    return Array.from(this.techniques.values()).filter(t => t.type === type);
  }

  getTechniquesByDifficulty(difficulty: Technique['difficulty']): Technique[] {
    return Array.from(this.techniques.values()).filter(t => t.difficulty === difficulty);
  }

  searchTechniques(query: string): Technique[] {
    const lowQuery = query.toLowerCase();
    return Array.from(this.techniques.values()).filter(t => 
      t.name.toLowerCase().includes(lowQuery) ||
      t.description.toLowerCase().includes(lowQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowQuery))
    );
  }

  getCounterTechniques(techniqueId: string): Technique[] {
    const technique = this.techniques.get(techniqueId);
    if (!technique) return [];
    
    return technique.counters
      .map(id => this.techniques.get(id))
      .filter((t): t is Technique => t !== undefined);
  }

  getRelatedTechniques(techniqueId: string): Technique[] {
    const technique = this.techniques.get(techniqueId);
    if (!technique) return [];
    
    // Find techniques with similar tags or same category
    return Array.from(this.techniques.values()).filter(t => 
      t.id !== techniqueId && (
        t.category === technique.category ||
        t.tags.some(tag => technique.tags.includes(tag))
      )
    ).slice(0, 5);
  }

  getAllTechniques(): Technique[] {
    return Array.from(this.techniques.values());
  }

  getCategories(): TechniqueCategory[] {
    return Array.from(this.categories.keys());
  }

  getTechniqueCount(): number {
    return this.techniques.size;
  }

  exportTechniques(): string {
    return JSON.stringify(
      Array.from(this.techniques.values()),
      null,
      2
    );
  }

  importTechniques(json: string): void {
    try {
      const techniques = JSON.parse(json) as Technique[];
      techniques.forEach(t => this.addTechnique(t));
    } catch (error) {
      throw new Error('Invalid techniques JSON format');
    }
  }
}