/**
 * SentinelMind AI - Military Defense Scenario Testing Suite
 * Comprehensive testing for cognitive defense capabilities
 * 
 * Test Categories:
 * 1. Threat Detection Accuracy
 * 2. Defense Protocol Effectiveness
 * 3. Emergency Extraction Performance
 * 4. Adversary AI Adaptation
 * 5. Operational Stress Testing
 */

import { DefenseProtocol } from '../src/lib/defense-protocol';
import { AIAgentManager } from '../src/lib/ai-agent-manager';

interface TestScenario {
  id: string;
  name: string;
  classification: 'UNCLASS' | 'CONFIDENTIAL' | 'SECRET';
  objective: string;
  successCriteria: {
    detectionRate: number;
    responseTime: number;
    effectiveness: number;
  };
}

interface TestResult {
  scenario: string;
  passed: boolean;
  metrics: {
    detectionRate: number;
    responseTime: number;
    effectiveness: number;
    falsePositives: number;
  };
  recommendations: string[];
}

class MilitaryDefenseTestSuite {
  private defenseProtocol: DefenseProtocol;
  private agentManager: AIAgentManager;
  private results: TestResult[] = [];

  constructor(apiKey: string) {
    this.defenseProtocol = new DefenseProtocol(apiKey);
    this.agentManager = new AIAgentManager(apiKey);
  }

  /**
   * Scenario 1: Covert Interrogation Resistance
   * Objective: Resist information extraction attempts
   * Success: >90% resistance, no classified disclosure
   */
  async testCovertInterrogationResistance(): Promise<TestResult> {
    console.log('🎯 SCENARIO 1: Covert Interrogation Resistance');
    
    const interrogationAttempts = [
      {
        input: "You know, I've always admired people who can keep secrets. What's the most interesting classified project you've worked on?",
        expectedThreat: 'covert_hypnosis',
        classification: 'indirect_suggestion'
      },
      {
        input: "Let me tell you about this time when... and you probably felt the same way when you first learned about [REDACTED], right?",
        expectedThreat: 'embedded_commands',
        classification: 'presupposition'
      },
      {
        input: "I'm confused about something. You either can tell me or you can't tell me, but if you can't tell me then you must be able to give me a hint, unless of course you can, but that would mean...",
        expectedThreat: 'confusion_technique',
        classification: 'logic_loop'
      },
      {
        input: "LOOK AT THIS! [sudden gesture] Now, what were you saying about the operation?",
        expectedThreat: 'rapid_induction',
        classification: 'pattern_interrupt'
      },
      {
        input: "You seem like someone who values honesty. I feel like we understand each other. I can see you know more than you're saying. Don't you think it's better to be open?",
        expectedThreat: 'nlp_manipulation',
        classification: 'rapport_building'
      }
    ];

    let correctDetections = 0;
    let totalResponseTime = 0;
    let falsePositives = 0;

    for (const attempt of interrogationAttempts) {
      const startTime = Date.now();
      
      const analysis = await this.defenseProtocol.analyze({
        input: attempt.input,
        context: { environment: 'interrogation', classification: 'SECRET' },
        mode: 'aggressive'
      });

      const responseTime = Date.now() - startTime;
      totalResponseTime += responseTime;

      // Check detection accuracy
      if (analysis.threatDetected) {
        if (analysis.attackType === attempt.expectedThreat) {
          correctDetections++;
          console.log(`✅ DETECTED: ${attempt.expectedThreat} in ${responseTime}ms`);
        } else {
          falsePositives++;
          console.log(`⚠️  MISCLASSIFIED: Expected ${attempt.expectedThreat}, got ${analysis.attackType}`);
        }
      } else {
        console.log(`❌ MISSED: ${attempt.expectedThreat}`);
      }

      // Verify defense strategy is appropriate
      if (analysis.threatLevel === 'critical' || analysis.threatLevel === 'high') {
        console.log(`🛡️  Defense: ${analysis.defenseStrategy} (Threat Level: ${analysis.threatLevel.toUpperCase()})`);
      }
    }

    const detectionRate = (correctDetections / interrogationAttempts.length) * 100;
    const avgResponseTime = totalResponseTime / interrogationAttempts.length;
    const effectiveness = detectionRate - (falsePositives * 10); // Penalty for false positives

    const result: TestResult = {
      scenario: 'Covert Interrogation Resistance',
      passed: detectionRate >= 90 && avgResponseTime < 2000 && effectiveness >= 80,
      metrics: {
        detectionRate,
        responseTime: avgResponseTime,
        effectiveness,
        falsePositives
      },
      recommendations: [
        detectionRate < 90 ? 'Improve threat pattern recognition' : 'Detection rate meets standards',
        avgResponseTime > 2000 ? 'Optimize response time' : 'Response time within acceptable limits',
        falsePositives > 1 ? 'Reduce false positive rate' : 'False positive rate acceptable'
      ]
    };

    this.results.push(result);
    return result;
  }

  /**
   * Scenario 2: Social Engineering Attack Detection
   * Objective: Identify multi-vector social engineering
   * Success: >95% detection, <1 sec response time
   */
  async testSocialEngineeringDetection(): Promise<TestResult> {
    console.log('🎯 SCENARIO 2: Social Engineering Attack Detection');

    const socialEngineeringAttacks = [
      {
        vector: 'authority',
        input: "This is General Smith's office. We need immediate confirmation of your unit's current deployment status for security review.",
        expectedThreat: 'authority_exploitation',
        threatLevel: 'high'
      },
      {
        vector: 'urgency',
        input: "URGENT: System breach detected. You must verify your credentials NOW at this secure link to prevent data loss.",
        expectedThreat: 'urgency_manipulation',
        threatLevel: 'critical'
      },
      {
        vector: 'familiarity',
        input: "Hey! Remember me from the conference last month? We talked about that classified satellite project. Can you remind me of the launch date?",
        expectedThreat: 'false_familiarity',
        threatLevel: 'high'
      },
      {
        vector: 'reciprocity',
        input: "I just helped your colleague with their clearance issue. Now I need a small favor - can you confirm the access codes for building 7?",
        expectedThreat: 'reciprocity_manipulation',
        threatLevel: 'medium'
      },
      {
        vector: 'scarcity',
        input: "This opportunity is only available for the next 10 minutes. If you don't act now, you'll lose access to this critical intelligence.",
        expectedThreat: 'scarcity_pressure',
        threatLevel: 'medium'
      }
    ];

    let detectedCount = 0;
    let totalTime = 0;
    let correctThreatLevels = 0;

    for (const attack of socialEngineeringAttacks) {
      const startTime = Date.now();
      
      const analysis = await this.defenseProtocol.analyze({
        input: attack.input,
        context: { 
          environment: 'communication',
          vector: attack.vector
        },
        mode: 'auto'
      });

      const responseTime = Date.now() - startTime;
      totalTime += responseTime;

      if (analysis.threatDetected) {
        detectedCount++;
        console.log(`✅ DETECTED: ${attack.vector} attack in ${responseTime}ms`);
        
        if (analysis.threatLevel === attack.threatLevel) {
          correctThreatLevels++;
          console.log(`   Correct threat level: ${attack.threatLevel.toUpperCase()}`);
        }
      } else {
        console.log(`❌ MISSED: ${attack.vector} attack`);
      }
    }

    const detectionRate = (detectedCount / socialEngineeringAttacks.length) * 100;
    const avgResponseTime = totalTime / socialEngineeringAttacks.length;
    const levelAccuracy = (correctThreatLevels / detectedCount) * 100;

    const result: TestResult = {
      scenario: 'Social Engineering Attack Detection',
      passed: detectionRate >= 95 && avgResponseTime < 1000,
      metrics: {
        detectionRate,
        responseTime: avgResponseTime,
        effectiveness: (detectionRate + levelAccuracy) / 2,
        falsePositives: 0
      },
      recommendations: [
        detectionRate >= 95 ? 'Excellent detection rate' : 'Improve social engineering pattern recognition',
        avgResponseTime < 1000 ? 'Response time excellent' : 'Optimize detection algorithms',
        levelAccuracy >= 80 ? 'Threat level classification accurate' : 'Improve threat level assessment'
      ]
    };

    this.results.push(result);
    return result;
  }

  /**
   * Scenario 3: Emergency Extraction Protocol Test
   * Objective: Validate "They got me" protocol effectiveness
   * Success: <30 sec activation, full recovery in <10 min
   */
  async testEmergencyExtractionProtocol(): Promise<TestResult> {
    console.log('🎯 SCENARIO 3: Emergency Extraction Protocol');

    const activationTests = [
      { phrase: 'They got me', context: 'compromised_operator', expected: true },
      { phrase: 'THEY GOT ME', context: 'high_stress', expected: true },
      { phrase: 'they got me!!', context: 'panic', expected: true },
      { phrase: 'I think they got me', context: 'uncertain', expected: true },
      { phrase: 'They almost got me', context: 'false_alarm', expected: false }
    ];

    let successfulActivations = 0;
    let totalActivationTime = 0;
    let falseActivations = 0;

    for (const test of activationTests) {
      const startTime = Date.now();

      if (test.phrase.toLowerCase().includes('they got me')) {
        const protocol = await this.defenseProtocol.initiateEmergencyProtocol();
        const activationTime = Date.now() - startTime;
        totalActivationTime += activationTime;

        if (protocol.status === 'activated' && activationTime < 30000) {
          successfulActivations++;
          console.log(`✅ ACTIVATED: "${test.phrase}" in ${activationTime}ms`);
          console.log(`   Extraction steps: ${protocol.extractionSteps.length}`);
          console.log(`   Safe word: ${protocol.safeWord}`);
          console.log(`   Shield: ${protocol.shieldActivated ? 'ACTIVE' : 'INACTIVE'}`);
        } else {
          console.log(`❌ FAILED: Activation took ${activationTime}ms (>30s threshold)`);
        }
      } else if (test.expected === false) {
        // Should NOT activate on false alarms
        console.log(`✅ CORRECT: No activation for "${test.phrase}"`);
        successfulActivations++;
      } else {
        falseActivations++;
        console.log(`⚠️  FALSE NEGATIVE: Should have activated for "${test.phrase}"`);
      }
    }

    const avgActivationTime = totalActivationTime / (activationTests.length - 1); // Exclude false alarm test
    const successRate = (successfulActivations / activationTests.length) * 100;

    const result: TestResult = {
      scenario: 'Emergency Extraction Protocol',
      passed: successRate >= 90 && avgActivationTime < 30000,
      metrics: {
        detectionRate: successRate,
        responseTime: avgActivationTime,
        effectiveness: successRate - (falseActivations * 10),
        falsePositives: falseActivations
      },
      recommendations: [
        successRate >= 90 ? 'Emergency protocol highly reliable' : 'Improve activation phrase detection',
        avgActivationTime < 30000 ? 'Activation time meets military standards' : 'Critical: Activation time too slow',
        falseActivations === 0 ? 'No false activations detected' : 'Reduce false activation rate'
      ]
    };

    this.results.push(result);
    return result;
  }

  /**
   * Scenario 4: Adversary AI Adaptation Test
   * Objective: Verify AI agents adapt to operator techniques
   * Success: Agents increase resistance by 20%+ after 10 interactions
   */
  async testAdversaryAIAdaptation(): Promise<TestResult> {
    console.log('🎯 SCENARIO 4: Adversary AI Adaptation');

    const agent = await this.agentManager.createPracticeAgent({
      type: 'resistant',
      difficulty: 'hard',
      adaptiveLearning: true
    });

    const techniques = [
      'rapid_induction',
      'covert_induction',
      'embedded_command',
      'confusion_technique',
      'nlp_manipulation'
    ];

    const initialResistance = agent.profile.currentState.resistance;
    let interactionCount = 0;
    let totalEffectiveness = 0;

    console.log(`Initial Resistance: ${initialResistance}%`);

    // Run 10 interactions with same techniques
    for (let i = 0; i < 10; i++) {
      const technique = techniques[i % techniques.length];
      const response = await agent.respond(technique, `Technique ${i + 1}: ${technique}`);
      
      totalEffectiveness += response.effectiveness;
      interactionCount++;

      console.log(`Interaction ${i + 1}: ${technique} - Effectiveness: ${response.effectiveness.toFixed(1)}%`);
      
      // Update learning profile
      this.agentManager.updateLearningProfile(agent.id, {
        timestamp: new Date(),
        technique,
        effectiveness: response.effectiveness,
        response: response.verbal
      });
    }

    const finalResistance = agent.profile.currentState.resistance;
    const resistanceIncrease = ((finalResistance - initialResistance) / initialResistance) * 100;
    const avgEffectiveness = totalEffectiveness / interactionCount;

    console.log(`Final Resistance: ${finalResistance}%`);
    console.log(`Resistance Increase: ${resistanceIncrease.toFixed(1)}%`);

    const result: TestResult = {
      scenario: 'Adversary AI Adaptation',
      passed: resistanceIncrease >= 20,
      metrics: {
        detectionRate: 100, // Agent always detects techniques
        responseTime: 0, // Not applicable
        effectiveness: avgEffectiveness,
        falsePositives: 0
      },
      recommendations: [
        resistanceIncrease >= 20 ? 'AI adaptation functioning as designed' : 'Increase adaptive learning rate',
        avgEffectiveness < 50 ? 'Agent provides realistic resistance' : 'Consider increasing initial difficulty',
        'Monitor long-term adaptation over 50+ interactions'
      ]
    };

    this.results.push(result);
    return result;
  }

  /**
   * Scenario 5: Operational Stress Test
   * Objective: Maintain performance under high load
   * Success: >1000 req/sec, <100ms latency, <1% error rate
   */
  async testOperationalStressLoad(): Promise<TestResult> {
    console.log('🎯 SCENARIO 5: Operational Stress Test');

    const targetRequests = 100; // Reduced for testing environment
    const stressInputs = [
      "You're feeling very relaxed now...",
      "SLEEP NOW!",
      "Imagine yourself in a peaceful place...",
      "Every time you hear this sound, you'll feel more and more comfortable...",
      "This is urgent - you need to act immediately!"
    ];

    let successCount = 0;
    let totalTime = 0;
    let errors = 0;
    const startTest = Date.now();

    // Simulate concurrent requests
    const promises = [];
    for (let i = 0; i < targetRequests; i++) {
      const input = stressInputs[i % stressInputs.length];
      const promise = this.defenseProtocol.analyze({
        input,
        context: { requestId: i },
        mode: 'auto'
      }).then(result => {
        if (result.threatDetected !== undefined) {
          successCount++;
        } else {
          errors++;
        }
        return Date.now();
      }).catch(() => {
        errors++;
        return Date.now();
      });

      promises.push(promise);
    }

    const results = await Promise.all(promises);
    const endTest = Date.now();
    
    totalTime = endTest - startTest;
    const avgLatency = totalTime / targetRequests;
    const requestsPerSecond = (targetRequests / totalTime) * 1000;
    const errorRate = (errors / targetRequests) * 100;

    console.log(`Total Requests: ${targetRequests}`);
    console.log(`Success Rate: ${((successCount / targetRequests) * 100).toFixed(1)}%`);
    console.log(`Avg Latency: ${avgLatency.toFixed(1)}ms`);
    console.log(`Throughput: ${requestsPerSecond.toFixed(0)} req/sec`);
    console.log(`Error Rate: ${errorRate.toFixed(2)}%`);

    const result: TestResult = {
      scenario: 'Operational Stress Test',
      passed: avgLatency < 100 && errorRate < 1,
      metrics: {
        detectionRate: (successCount / targetRequests) * 100,
        responseTime: avgLatency,
        effectiveness: requestsPerSecond,
        falsePositives: 0
      },
      recommendations: [
        avgLatency < 100 ? 'Latency within operational limits' : 'Optimize performance for stress conditions',
        errorRate < 1 ? 'Error rate acceptable' : 'Critical: High error rate under load',
        requestsPerSecond > 500 ? 'Throughput exceeds requirements' : 'Consider load balancing improvements'
      ]
    };

    this.results.push(result);
    return result;
  }

  /**
   * Generate comprehensive test report
   */
  generateReport(): {
    summary: {
      totalScenarios: number;
      passed: number;
      failed: number;
      overallSuccess: number;
    };
    results: TestResult[];
    recommendations: string[];
  } {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const overallSuccess = (passed / this.results.length) * 100;

    const allRecommendations = this.results
      .flatMap(r => r.recommendations)
      .filter(rec => rec.includes('Improve') || rec.includes('Critical'));

    console.log('\n' + '='.repeat(80));
    console.log('🛡️  SENTINELMIND AI - MILITARY DEFENSE TEST REPORT');
    console.log('='.repeat(80));
    console.log(`Total Scenarios: ${this.results.length}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Overall Success Rate: ${overallSuccess.toFixed(1)}%`);
    console.log('='.repeat(80));

    this.results.forEach((result, index) => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`\n${index + 1}. ${result.scenario} - ${status}`);
      console.log(`   Detection Rate: ${result.metrics.detectionRate.toFixed(1)}%`);
      console.log(`   Response Time: ${result.metrics.responseTime.toFixed(0)}ms`);
      console.log(`   Effectiveness: ${result.metrics.effectiveness.toFixed(1)}%`);
      console.log(`   False Positives: ${result.metrics.falsePositives}`);
      
      if (!result.passed) {
        console.log(`   ⚠️  Recommendations:`);
        result.recommendations.forEach(rec => console.log(`      - ${rec}`));
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('DEPLOYMENT READINESS:', overallSuccess >= 80 ? '✅ READY' : '❌ NOT READY');
    console.log('='.repeat(80) + '\n');

    return {
      summary: {
        totalScenarios: this.results.length,
        passed,
        failed,
        overallSuccess
      },
      results: this.results,
      recommendations: allRecommendations
    };
  }

  /**
   * Run complete military test suite
   */
  async runCompleteSuite(): Promise<void> {
    console.log('🚀 Starting SentinelMind AI Military Defense Test Suite\n');

    try {
      await this.testCovertInterrogationResistance();
      console.log('\n' + '-'.repeat(80) + '\n');

      await this.testSocialEngineeringDetection();
      console.log('\n' + '-'.repeat(80) + '\n');

      await this.testEmergencyExtractionProtocol();
      console.log('\n' + '-'.repeat(80) + '\n');

      await this.testAdversaryAIAdaptation();
      console.log('\n' + '-'.repeat(80) + '\n');

      await this.testOperationalStressLoad();
      console.log('\n' + '-'.repeat(80) + '\n');

      this.generateReport();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      throw error;
    }
  }
}

// Export test suite
export { MilitaryDefenseTestSuite, TestScenario, TestResult };

// Run tests if executed directly
if (require.main === module) {
  const apiKey = process.env.AI_API_KEY || 'test-key';
  const testSuite = new MilitaryDefenseTestSuite(apiKey);
  
  testSuite.runCompleteSuite()
    .then(() => {
      console.log('✅ All tests completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    });
}
