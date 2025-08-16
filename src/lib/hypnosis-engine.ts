/**
 * Hypnosis Engine - Core hypnotic script generation and technique implementation
 */

export interface ScriptParameters {
  type: 'induction' | 'deepener' | 'suggestion' | 'emergence' | 'full_session';
  goal: string;
  intensity: 'light' | 'medium' | 'deep' | 'extreme';
  customization?: {
    description?: string;
    preferences?: string[];
    avoidances?: string[];
    duration?: number;
  };
}

export interface HypnoticScript {
  title: string;
  type: string;
  sections: ScriptSection[];
  totalDuration: number;
  intensity: string;
  techniques: string[];
}

export interface ScriptSection {
  name: string;
  content: string;
  duration: number;
  technique: string;
  voiceModulation?: VoiceModulation;
}

export interface VoiceModulation {
  pace: 'slow' | 'normal' | 'fast' | 'variable';
  tone: 'monotone' | 'soothing' | 'commanding' | 'rhythmic';
  volume: 'whisper' | 'soft' | 'normal' | 'loud';
  emphasis: string[];
}

export class HypnosisEngine {
  private apiKey: string;
  private techniques: Map<string, TechniqueTemplate>;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.techniques = this.initializeTechniques();
  }

  private initializeTechniques(): Map<string, TechniqueTemplate> {
    const techniques = new Map();

    // Induction Techniques
    techniques.set('progressive_relaxation', {
      name: 'Progressive Relaxation',
      category: 'induction',
      baseScript: 'Take a deep breath... and as you exhale, feel your body beginning to relax...',
      variations: ['muscle groups', 'visualization', 'counting'],
      duration: 5
    });

    techniques.set('rapid_induction', {
      name: 'Rapid Induction',
      category: 'induction',
      baseScript: 'In a moment, I\'m going to count from 3 to 1, and on 1...',
      variations: ['handshake', 'pattern interrupt', 'shock'],
      duration: 1
    });

    techniques.set('confusion_induction', {
      name: 'Confusion Induction',
      category: 'induction',
      baseScript: 'As you listen to my voice, you might wonder which part of you...',
      variations: ['double bind', 'paradox', 'overload'],
      duration: 3
    });

    // NLP Patterns
    techniques.set('embedded_commands', {
      name: 'Embedded Commands',
      category: 'nlp',
      baseScript: 'And you can... [COMMAND]... now',
      variations: ['analog marking', 'tonal shift', 'pause pattern'],
      duration: 0
    });

    techniques.set('milton_model', {
      name: 'Milton Model',
      category: 'nlp',
      baseScript: 'You might find yourself wondering...',
      variations: ['ambiguity', 'nominalization', 'presupposition'],
      duration: 0
    });

    // Deepeners
    techniques.set('countdown_deepener', {
      name: 'Countdown Deepener',
      category: 'deepener',
      baseScript: 'With each number I count, going deeper and deeper...',
      variations: ['10-1', '20-1', 'elevator', 'staircase'],
      duration: 2
    });

    techniques.set('fractionation', {
      name: 'Fractionation',
      category: 'deepener',
      baseScript: 'In a moment, I\'ll have you open your eyes, then close them again...',
      variations: ['rapid', 'slow', 'compound'],
      duration: 3
    });

    return techniques;
  }

  async generateScript(params: ScriptParameters): Promise<HypnoticScript> {
    const sections: ScriptSection[] = [];
    const techniquesUsed: string[] = [];
    let totalDuration = 0;

    // Build script based on type
    switch (params.type) {
      case 'full_session':
        sections.push(...await this.generateFullSession(params));
        break;
      case 'induction':
        sections.push(await this.generateInduction(params));
        break;
      case 'deepener':
        sections.push(await this.generateDeepener(params));
        break;
      case 'suggestion':
        sections.push(await this.generateSuggestion(params));
        break;
      case 'emergence':
        sections.push(await this.generateEmergence(params));
        break;
    }

    // Calculate total duration
    totalDuration = sections.reduce((acc, section) => acc + section.duration, 0);

    // Extract techniques used
    techniquesUsed.push(...new Set(sections.map(s => s.technique)));

    return {
      title: `${params.type} - ${params.goal}`,
      type: params.type,
      sections,
      totalDuration,
      intensity: params.intensity,
      techniques: techniquesUsed
    };
  }

  private async generateFullSession(params: ScriptParameters): Promise<ScriptSection[]> {
    const sections: ScriptSection[] = [];

    // Pre-talk
    sections.push({
      name: 'Pre-talk',
      content: this.generatePreTalk(params),
      duration: 2,
      technique: 'rapport_building',
      voiceModulation: {
        pace: 'normal',
        tone: 'soothing',
        volume: 'normal',
        emphasis: []
      }
    });

    // Induction
    sections.push(await this.generateInduction(params));

    // Deepener
    sections.push(await this.generateDeepener(params));

    // Main suggestions
    sections.push(await this.generateSuggestion(params));

    // Post-hypnotic suggestions
    if (params.intensity === 'deep' || params.intensity === 'extreme') {
      sections.push(this.generatePostHypnoticSuggestion(params));
    }

    // Emergence
    sections.push(await this.generateEmergence(params));

    return sections;
  }

  private async generateInduction(params: ScriptParameters): Promise<ScriptSection> {
    let technique = 'progressive_relaxation';
    let content = '';

    // Select induction based on intensity
    switch (params.intensity) {
      case 'extreme':
        technique = 'rapid_induction';
        content = this.buildRapidInduction(params);
        break;
      case 'deep':
        technique = 'confusion_induction';
        content = this.buildConfusionInduction(params);
        break;
      default:
        content = this.buildProgressiveInduction(params);
    }

    return {
      name: 'Induction',
      content,
      duration: this.techniques.get(technique)?.duration || 5,
      technique,
      voiceModulation: {
        pace: params.intensity === 'extreme' ? 'fast' : 'slow',
        tone: 'soothing',
        volume: 'soft',
        emphasis: ['deeper', 'relax', 'now']
      }
    };
  }

  private buildRapidInduction(params: ScriptParameters): string {
    return `
[RAPID INDUCTION PROTOCOL]

Look at me... right here... [point to eyes]

That's right... and as you focus on this point...

SLEEP! [snap fingers]

[Hand motion downward]

That's right... all the way down... deeper and deeper...

Perfect. You're doing wonderfully.

Each breath taking you deeper... 10 times deeper with each breath...
    `.trim();
  }

  private buildConfusionInduction(params: ScriptParameters): string {
    return `
[CONFUSION INDUCTION PROTOCOL]

As you sit there, listening to my voice, you might begin to wonder...

Which happens first - the relaxation in your shoulders, or the heaviness in your eyelids?

And while you're wondering about that, you haven't noticed yet...

How your breathing has already changed... or has it?

Because the conscious mind likes to analyze... while the unconscious already knows...

What it means to let go... completely... now.

[Pause]

That's right... and you can close those eyes... whenever they feel ready...

Or have they already closed? It doesn't matter...

Because you're already beginning to drift... deeper... and deeper...
    `.trim();
  }

  private buildProgressiveInduction(params: ScriptParameters): string {
    return `
[PROGRESSIVE RELAXATION INDUCTION]

Take a comfortable breath in... and as you exhale... allow your eyes to close...

That's right... just like that...

And with each breath you take... you can feel yourself relaxing more and more...

Starting at the top of your head... feel a wave of relaxation...

Flowing down... over your forehead... your eyes... your face...

Down through your neck... your shoulders... 

Feel those shoulders dropping... releasing all tension...

The relaxation spreading down your arms... to your fingertips...

Down through your chest... your stomach... your back...

All the way down through your hips... your thighs... your legs...

To the very tips of your toes...

Completely relaxed now... drifting deeper... and deeper...
    `.trim();
  }

  private async generateDeepener(params: ScriptParameters): Promise<ScriptSection> {
    const content = params.intensity === 'extreme' 
      ? this.buildFractionationDeepener()
      : this.buildCountdownDeepener();

    return {
      name: 'Deepener',
      content,
      duration: 3,
      technique: params.intensity === 'extreme' ? 'fractionation' : 'countdown_deepener',
      voiceModulation: {
        pace: 'slow',
        tone: 'rhythmic',
        volume: 'soft',
        emphasis: ['deeper', 'down', 'now']
      }
    };
  }

  private buildCountdownDeepener(): string {
    return `
[COUNTDOWN DEEPENER]

In a moment, I'm going to count from 10 down to 1...

And with each number... you'll drift twice as deep...

10... beginning to drift deeper...

9... twice as relaxed...

8... letting go completely...

7... deeper and deeper...

6... drifting down...

5... halfway there... so relaxed...

4... almost there...

3... so deep now...

2... almost at the deepest level...

1... completely relaxed... deeply hypnotized...

Perfect. You're doing wonderfully.
    `.trim();
  }

  private buildFractionationDeepener(): string {
    return `
[FRACTIONATION DEEPENER]

In a moment, I'll have you open your eyes...

And when you close them again, you'll go 10 times deeper...

Open your eyes... now... [snap]

And close them... [snap]

Dropping 10 times deeper...

Again... open... [snap]

And close... [snap]

100 times deeper now...

One more time... open... [snap]

And SLEEP! [snap]

1000 times deeper... perfect...

So deep... so relaxed... completely in trance now...
    `.trim();
  }

  private async generateSuggestion(params: ScriptParameters): Promise<ScriptSection> {
    const content = this.buildSuggestion(params.goal, params.intensity);

    return {
      name: 'Main Suggestion',
      content,
      duration: 5,
      technique: 'direct_suggestion',
      voiceModulation: {
        pace: 'variable',
        tone: params.intensity === 'extreme' ? 'commanding' : 'soothing',
        volume: 'normal',
        emphasis: this.extractKeyWords(params.goal)
      }
    };
  }

  private buildSuggestion(goal: string, intensity: string): string {
    // This would be enhanced with AI generation
    return `
[MAIN SUGGESTION]

${goal}

And as you integrate this suggestion...

You find it becoming part of who you are...

Natural... automatic... effortless...

Growing stronger with each passing moment...

${intensity === 'extreme' ? 'This is your reality now...' : 'Allowing this positive change...'}

Yes... that's right... perfect...
    `.trim();
  }

  private generatePostHypnoticSuggestion(params: ScriptParameters): ScriptSection {
    return {
      name: 'Post-Hypnotic Suggestion',
      content: `
[POST-HYPNOTIC SUGGESTION]

And after you emerge from this trance...

You'll find that ${params.goal} continues...

Automatically... naturally... without conscious effort...

Every time you [TRIGGER], you'll remember this feeling...

And it will grow stronger... more powerful... more permanent...

This is now part of your unconscious programming...
      `.trim(),
      duration: 2,
      technique: 'post_hypnotic',
      voiceModulation: {
        pace: 'slow',
        tone: 'commanding',
        volume: 'soft',
        emphasis: ['automatically', 'naturally', 'permanent']
      }
    };
  }

  private async generateEmergence(params: ScriptParameters): Promise<ScriptSection> {
    return {
      name: 'Emergence',
      content: `
[EMERGENCE]

In a moment, I'll count from 1 to 5...

And on 5, you'll be wide awake, feeling wonderful...

1... beginning to return...

2... energy returning to your body...

3... feeling refreshed and alert...

4... eyes beginning to flutter...

5... eyes open, wide awake, feeling fantastic!

Welcome back. How do you feel?
      `.trim(),
      duration: 1,
      technique: 'emergence',
      voiceModulation: {
        pace: 'normal',
        tone: 'soothing',
        volume: 'normal',
        emphasis: ['1', '2', '3', '4', '5', 'awake']
      }
    };
  }

  private generatePreTalk(params: ScriptParameters): string {
    return `
Welcome. Before we begin, I want you to know that you're in complete control.

Hypnosis is a natural state that you experience every day.

All hypnosis is self-hypnosis. I'm simply here to guide you.

Your goal today is: ${params.goal}

Are you ready to begin this journey?
    `.trim();
  }

  private extractKeyWords(text: string): string[] {
    // Simple keyword extraction - would be enhanced with NLP
    const words = text.toLowerCase().split(/\s+/);
    const keywords = words.filter(word => 
      word.length > 4 && !['that', 'this', 'with', 'from', 'have'].includes(word)
    );
    return keywords.slice(0, 5);
  }
}

interface TechniqueTemplate {
  name: string;
  category: string;
  baseScript: string;
  variations: string[];
  duration: number;
}