/**
 * AI Hypnosis - Frontend Application
 * Revolutionary hypnotism platform with AI-powered capabilities
 */

// Global state
const AppState = {
  currentSession: null,
  currentAgent: null,
  defenseActive: false,
  emergencyMode: false,
  userId: localStorage.getItem('userId') || generateUserId(),
  sessionId: null,
  techniques: [],
  progress: null
};

// Save userId
if (!localStorage.getItem('userId')) {
  localStorage.setItem('userId', AppState.userId);
}

// Utility functions
function generateUserId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// API client
const API = {
  baseURL: '/api',
  
  async request(endpoint, options = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'X-User-Id': AppState.userId,
      'X-Session-Id': AppState.sessionId || generateSessionId()
    };
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      UI.showNotification('error', error.message);
      throw error;
    }
  },
  
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },
  
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

// UI Controller
const UI = {
  init() {
    this.renderMainInterface();
    this.attachEventListeners();
    this.initializeVoiceCommands();
  },
  
  renderMainInterface() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="min-h-screen bg-gray-900 text-gray-100">
        <!-- Header -->
        <header class="bg-gray-800 border-b border-purple-600 p-4">
          <div class="max-w-7xl mx-auto flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <i class="fas fa-brain text-3xl text-hypno-purple"></i>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-hypno-purple to-hypno-blue bg-clip-text text-transparent">
                AI Hypnosis
              </h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-400">User: ${AppState.userId.substr(0, 8)}...</span>
              <button id="emergencyBtn" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                Emergency Protocol
              </button>
            </div>
          </div>
        </header>
        
        <!-- Main Content -->
        <div class="max-w-7xl mx-auto p-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Left Panel - Controls -->
            <div class="lg:col-span-1 space-y-6">
              <!-- Mode Selection -->
              <div class="bg-gray-800 rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4 text-hypno-purple">Mode Selection</h2>
                <div class="space-y-3">
                  <button onclick="HypnosisApp.startOffensiveMode()" class="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all flex items-center justify-between">
                    <span><i class="fas fa-bolt mr-2"></i>Offensive Mode</span>
                    <i class="fas fa-chevron-right"></i>
                  </button>
                  <button onclick="HypnosisApp.startDefensiveMode()" class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all flex items-center justify-between">
                    <span><i class="fas fa-shield-alt mr-2"></i>Defensive Mode</span>
                    <i class="fas fa-chevron-right"></i>
                  </button>
                  <button onclick="HypnosisApp.startPracticeMode()" class="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-all flex items-center justify-between">
                    <span><i class="fas fa-graduation-cap mr-2"></i>Practice Mode</span>
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              
              <!-- Quick Commands -->
              <div class="bg-gray-800 rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4 text-hypno-blue">Quick Commands</h2>
                <div class="space-y-2">
                  <button onclick="Commands.analyzeMoment()" class="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-left">
                    "Analyze this moment"
                  </button>
                  <button onclick="Commands.groundMe()" class="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-left">
                    "Ground me"
                  </button>
                  <button onclick="Commands.scrambleThis()" class="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-left">
                    "Scramble this"
                  </button>
                  <button onclick="Commands.updateCaseFile()" class="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-left">
                    "Update the case file"
                  </button>
                </div>
              </div>
              
              <!-- Status Panel -->
              <div class="bg-gray-800 rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4 text-green-500">System Status</h2>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>Defense Protocol:</span>
                    <span id="defenseStatus" class="text-green-400">Active</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Threat Level:</span>
                    <span id="threatLevel" class="text-yellow-400">Low</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Session Active:</span>
                    <span id="sessionStatus" class="text-gray-400">None</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Center Panel - Main Workspace -->
            <div class="lg:col-span-2">
              <div id="mainWorkspace" class="bg-gray-800 rounded-lg p-6 min-h-[600px]">
                <!-- Welcome Screen -->
                <div id="welcomeScreen" class="flex flex-col items-center justify-center h-full">
                  <i class="fas fa-brain text-6xl text-hypno-purple mb-6 animate-pulse"></i>
                  <h2 class="text-3xl font-bold mb-4">Welcome to AI Hypnosis</h2>
                  <p class="text-gray-400 text-center mb-8 max-w-md">
                    Revolutionary hypnotism platform powered by advanced AI agents.
                    Select a mode from the left panel to begin.
                  </p>
                  <div class="flex space-x-4">
                    <button onclick="HypnosisApp.showTechniques()" class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg">
                      <i class="fas fa-book mr-2"></i>
                      Technique Library
                    </button>
                    <button onclick="HypnosisApp.showProgress()" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg">
                      <i class="fas fa-chart-line mr-2"></i>
                      View Progress
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Notification Area -->
        <div id="notificationArea" class="fixed bottom-4 right-4 space-y-2"></div>
        
        <!-- Emergency Modal -->
        <div id="emergencyModal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div class="bg-gray-800 border-2 border-red-600 rounded-lg p-8 max-w-2xl">
            <h2 class="text-3xl font-bold text-red-600 mb-4">EMERGENCY PROTOCOL ACTIVATED</h2>
            <div id="emergencyContent" class="text-gray-200 space-y-4"></div>
            <button onclick="UI.closeEmergencyModal()" class="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg">
              <i class="fas fa-check mr-2"></i>
              Understood - I'm Safe
            </button>
          </div>
        </div>
      </div>
    `;
  },
  
  attachEventListeners() {
    // Emergency button
    const emergencyBtn = document.getElementById('emergencyBtn');
    if (emergencyBtn) {
      emergencyBtn.addEventListener('click', () => {
        HypnosisApp.activateEmergencyProtocol();
      });
    }
    
    // Voice command activation
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === ' ') {
        VoiceCommands.startListening();
      }
    });
  },
  
  initializeVoiceCommands() {
    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      VoiceCommands.init();
    }
  },
  
  updateWorkspace(content) {
    const workspace = document.getElementById('mainWorkspace');
    if (workspace) {
      workspace.innerHTML = content;
    }
  },
  
  showNotification(type, message, duration = 5000) {
    const notificationArea = document.getElementById('notificationArea');
    const id = 'notif_' + Date.now();
    
    const colors = {
      success: 'bg-green-600',
      error: 'bg-red-600',
      warning: 'bg-yellow-600',
      info: 'bg-blue-600'
    };
    
    const notification = document.createElement('div');
    notification.id = id;
    notification.className = `${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    notification.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle mr-3"></i>
        <span>${message}</span>
      </div>
    `;
    
    notificationArea.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, duration);
  },
  
  updateStatus(status) {
    if (status.defense !== undefined) {
      document.getElementById('defenseStatus').textContent = status.defense ? 'Active' : 'Inactive';
    }
    if (status.threat) {
      document.getElementById('threatLevel').textContent = status.threat;
      document.getElementById('threatLevel').className = 
        status.threat === 'Critical' ? 'text-red-500' :
        status.threat === 'High' ? 'text-orange-500' :
        status.threat === 'Medium' ? 'text-yellow-400' :
        'text-green-400';
    }
    if (status.session) {
      document.getElementById('sessionStatus').textContent = status.session;
    }
  },
  
  closeEmergencyModal() {
    document.getElementById('emergencyModal').classList.add('hidden');
    AppState.emergencyMode = false;
  }
};

// Main Application Controller
const HypnosisApp = {
  async init() {
    // Check system health
    try {
      const health = await API.get('/health');
      console.log('System status:', health);
    } catch (error) {
      console.error('System check failed:', error);
    }
    
    // Initialize UI
    UI.init();
    
    // Load user progress
    await this.loadUserProgress();
  },
  
  async loadUserProgress() {
    try {
      const progress = await API.get('/progress/stats');
      AppState.progress = progress.stats;
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  },
  
  async startOffensiveMode() {
    UI.updateWorkspace(`
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-hypno-purple">Offensive Hypnosis Mode</h2>
        
        <div class="grid grid-cols-2 gap-4">
          <button onclick="OffensiveTechniques.rapidInduction()" class="p-4 bg-purple-700 hover:bg-purple-600 rounded-lg">
            <i class="fas fa-bolt text-2xl mb-2"></i>
            <h3 class="font-semibold">Rapid Induction</h3>
            <p class="text-sm text-gray-300">Instant trance technique</p>
          </button>
          
          <button onclick="OffensiveTechniques.covertHypnosis()" class="p-4 bg-purple-700 hover:bg-purple-600 rounded-lg">
            <i class="fas fa-user-secret text-2xl mb-2"></i>
            <h3 class="font-semibold">Covert Hypnosis</h3>
            <p class="text-sm text-gray-300">Conversational induction</p>
          </button>
          
          <button onclick="OffensiveTechniques.embeddedCommands()" class="p-4 bg-purple-700 hover:bg-purple-600 rounded-lg">
            <i class="fas fa-comment-dots text-2xl mb-2"></i>
            <h3 class="font-semibold">Embedded Commands</h3>
            <p class="text-sm text-gray-300">Hidden suggestions</p>
          </button>
          
          <button onclick="OffensiveTechniques.confusionTechnique()" class="p-4 bg-purple-700 hover:bg-purple-600 rounded-lg">
            <i class="fas fa-random text-2xl mb-2"></i>
            <h3 class="font-semibold">Confusion Technique</h3>
            <p class="text-sm text-gray-300">Overload conscious mind</p>
          </button>
        </div>
        
        <div class="bg-gray-700 rounded-lg p-4">
          <h3 class="font-semibold mb-2">Script Generator</h3>
          <div class="space-y-3">
            <input id="scriptGoal" type="text" placeholder="Enter hypnosis goal..." class="w-full px-4 py-2 bg-gray-800 rounded-lg">
            <select id="scriptIntensity" class="w-full px-4 py-2 bg-gray-800 rounded-lg">
              <option value="light">Light</option>
              <option value="medium" selected>Medium</option>
              <option value="deep">Deep</option>
              <option value="extreme">Extreme</option>
            </select>
            <button onclick="OffensiveTechniques.generateScript()" class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
              Generate Custom Script
            </button>
          </div>
        </div>
        
        <div id="techniqueOutput" class="bg-gray-700 rounded-lg p-4 hidden">
          <h3 class="font-semibold mb-2">Output</h3>
          <pre id="outputContent" class="text-sm text-gray-300 whitespace-pre-wrap"></pre>
        </div>
      </div>
    `);
    
    UI.updateStatus({ session: 'Offensive Mode' });
  },
  
  async startDefensiveMode() {
    AppState.defenseActive = true;
    
    UI.updateWorkspace(`
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-hypno-blue">Defensive Mode Active</h2>
        
        <div class="bg-blue-900 bg-opacity-50 border border-blue-600 rounded-lg p-4">
          <h3 class="font-semibold mb-2 text-blue-400">
            <i class="fas fa-shield-alt mr-2"></i>
            Real-Time Protection Enabled
          </h3>
          <p class="text-sm text-gray-300">
            All incoming communication is being analyzed for hypnotic patterns.
          </p>
        </div>
        
        <div class="space-y-4">
          <div class="bg-gray-700 rounded-lg p-4">
            <h3 class="font-semibold mb-3">Input Analysis</h3>
            <textarea id="defenseInput" placeholder="Paste text or conversation to analyze..." 
              class="w-full h-32 px-4 py-2 bg-gray-800 rounded-lg resize-none"></textarea>
            <button onclick="DefensiveTechniques.analyzeInput()" 
              class="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
              <i class="fas fa-search mr-2"></i>
              Analyze for Threats
            </button>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <button onclick="DefensiveTechniques.activateShield()" class="p-4 bg-blue-700 hover:bg-blue-600 rounded-lg">
              <i class="fas fa-shield-virus text-2xl mb-2"></i>
              <h3 class="font-semibold">Mental Shield</h3>
              <p class="text-sm text-gray-300">Activate protection</p>
            </button>
            
            <button onclick="DefensiveTechniques.patternInterrupt()" class="p-4 bg-blue-700 hover:bg-blue-600 rounded-lg">
              <i class="fas fa-hand-paper text-2xl mb-2"></i>
              <h3 class="font-semibold">Pattern Interrupt</h3>
              <p class="text-sm text-gray-300">Break hypnotic flow</p>
            </button>
          </div>
        </div>
        
        <div id="analysisResult" class="hidden bg-gray-700 rounded-lg p-4">
          <h3 class="font-semibold mb-2">Analysis Results</h3>
          <div id="analysisContent"></div>
        </div>
      </div>
    `);
    
    UI.updateStatus({ session: 'Defensive Mode', defense: true });
  },
  
  async startPracticeMode() {
    UI.updateWorkspace(`
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-green-500">Practice Mode</h2>
        
        <div class="bg-gray-700 rounded-lg p-4">
          <h3 class="font-semibold mb-3">Select Practice Partner</h3>
          
          <div class="grid grid-cols-3 gap-3 mb-4">
            <button onclick="Practice.selectAgent('susceptible')" class="p-3 bg-green-700 hover:bg-green-600 rounded-lg">
              <i class="fas fa-user-check"></i>
              <p class="text-sm mt-1">Susceptible</p>
            </button>
            <button onclick="Practice.selectAgent('resistant')" class="p-3 bg-yellow-700 hover:bg-yellow-600 rounded-lg">
              <i class="fas fa-user-shield"></i>
              <p class="text-sm mt-1">Resistant</p>
            </button>
            <button onclick="Practice.selectAgent('offensive')" class="p-3 bg-red-700 hover:bg-red-600 rounded-lg">
              <i class="fas fa-user-ninja"></i>
              <p class="text-sm mt-1">Master</p>
            </button>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm mb-2">Difficulty Level</label>
            <select id="practiceDifficulty" class="w-full px-4 py-2 bg-gray-800 rounded-lg">
              <option value="easy">Easy</option>
              <option value="medium" selected>Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          <button onclick="Practice.startSession()" class="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg">
            <i class="fas fa-play mr-2"></i>
            Start Practice Session
          </button>
        </div>
        
        <div id="practiceArea" class="hidden space-y-4">
          <div class="bg-gray-700 rounded-lg p-4">
            <h3 class="font-semibold mb-2">Practice Partner</h3>
            <div id="agentProfile"></div>
          </div>
          
          <div class="bg-gray-700 rounded-lg p-4">
            <h3 class="font-semibold mb-2">Interaction</h3>
            <div id="practiceChat" class="h-64 overflow-y-auto bg-gray-800 rounded p-3 mb-3"></div>
            <div class="flex space-x-2">
              <input id="practiceInput" type="text" placeholder="Your technique or response..." 
                class="flex-1 px-4 py-2 bg-gray-800 rounded-lg">
              <button onclick="Practice.sendTechnique()" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    `);
    
    UI.updateStatus({ session: 'Practice Mode' });
  },
  
  async activateEmergencyProtocol() {
    AppState.emergencyMode = true;
    
    try {
      const response = await API.post('/hypnosis/emergency-protocol', {});
      
      const modal = document.getElementById('emergencyModal');
      const content = document.getElementById('emergencyContent');
      
      content.innerHTML = `
        <div class="space-y-4">
          <div class="bg-red-900 bg-opacity-50 border border-red-600 rounded p-3">
            <p class="font-bold text-red-400">Protocol Status: ${response.protocol.status.toUpperCase()}</p>
          </div>
          
          <div>
            <h3 class="font-semibold mb-2">Extraction Steps:</h3>
            <ol class="list-decimal list-inside space-y-1 text-sm">
              ${response.protocol.extractionSteps.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>
          
          <div>
            <h3 class="font-semibold mb-2">Grounding Sequence:</h3>
            <p class="text-sm mb-2">${response.protocol.groundingSequence.affirmation}</p>
            <p class="text-sm">Breathing: ${response.protocol.groundingSequence.breathingPattern}</p>
          </div>
          
          <div class="bg-gray-700 rounded p-3">
            <p class="text-sm">Safe Word: <span class="font-bold text-yellow-400">${response.protocol.safeWord}</span></p>
          </div>
        </div>
      `;
      
      modal.classList.remove('hidden');
      
      UI.showNotification('warning', 'Emergency Protocol Activated!');
      UI.updateStatus({ threat: 'Critical', defense: true });
      
    } catch (error) {
      console.error('Emergency protocol failed:', error);
      alert('EMERGENCY: Manual extraction required. Leave situation immediately.');
    }
  },
  
  async showTechniques() {
    try {
      const techniques = await API.get('/techniques/library');
      
      UI.updateWorkspace(`
        <div class="space-y-6">
          <h2 class="text-2xl font-bold">Technique Library</h2>
          
          <div class="grid grid-cols-1 gap-4">
            ${techniques.techniques.map(tech => `
              <div class="bg-gray-700 rounded-lg p-4">
                <h3 class="font-semibold mb-2">${tech.name}</h3>
                <p class="text-sm text-gray-300 mb-2">${tech.description}</p>
                <div class="flex justify-between text-xs text-gray-400">
                  <span>Category: ${tech.category}</span>
                  <span>Difficulty: ${tech.difficulty}</span>
                  <span>Rating: ${tech.effectiveness_rating || 0}/5</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `);
    } catch (error) {
      console.error('Failed to load techniques:', error);
    }
  },
  
  async showProgress() {
    if (!AppState.progress) {
      await this.loadUserProgress();
    }
    
    UI.updateWorkspace(`
      <div class="space-y-6">
        <h2 class="text-2xl font-bold">Your Progress</h2>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-700 rounded-lg p-4">
            <h3 class="text-3xl font-bold">${AppState.progress?.practice?.total_sessions || 0}</h3>
            <p class="text-gray-400">Practice Sessions</p>
          </div>
          
          <div class="bg-gray-700 rounded-lg p-4">
            <h3 class="text-3xl font-bold">${Math.round(AppState.progress?.practice?.avg_success_rate || 0)}%</h3>
            <p class="text-gray-400">Success Rate</p>
          </div>
          
          <div class="bg-gray-700 rounded-lg p-4">
            <h3 class="text-3xl font-bold">${AppState.progress?.defense?.successful_defenses || 0}</h3>
            <p class="text-gray-400">Successful Defenses</p>
          </div>
          
          <div class="bg-gray-700 rounded-lg p-4">
            <h3 class="text-3xl font-bold">${AppState.progress?.defense?.unique_attacks_faced || 0}</h3>
            <p class="text-gray-400">Attack Types Faced</p>
          </div>
        </div>
      </div>
    `);
  }
};

// Offensive Techniques Controller
const OffensiveTechniques = {
  async rapidInduction() {
    const result = await API.post('/hypnosis/offensive/execute', {
      technique: 'rapid_induction',
      target: 'practice',
      parameters: {}
    });
    
    this.showResult(result);
  },
  
  async covertHypnosis() {
    const result = await API.post('/hypnosis/offensive/execute', {
      technique: 'covert_induction',
      target: 'practice',
      parameters: {}
    });
    
    this.showResult(result);
  },
  
  async embeddedCommands() {
    const result = await API.post('/hypnosis/offensive/execute', {
      technique: 'embedded_command',
      target: 'practice',
      parameters: { command: 'RELAX NOW' }
    });
    
    this.showResult(result);
  },
  
  async confusionTechnique() {
    const result = await API.post('/hypnosis/offensive/execute', {
      technique: 'confusion_technique',
      target: 'practice',
      parameters: {}
    });
    
    this.showResult(result);
  },
  
  async generateScript() {
    const goal = document.getElementById('scriptGoal').value;
    const intensity = document.getElementById('scriptIntensity').value;
    
    if (!goal) {
      UI.showNotification('error', 'Please enter a hypnosis goal');
      return;
    }
    
    try {
      const result = await API.post('/hypnosis/generate-script', {
        type: 'full_session',
        goal,
        intensity
      });
      
      this.showResult(result);
    } catch (error) {
      console.error('Script generation failed:', error);
    }
  },
  
  showResult(result) {
    const output = document.getElementById('techniqueOutput');
    const content = document.getElementById('outputContent');
    
    if (result.script) {
      content.textContent = typeof result.script === 'object' 
        ? JSON.stringify(result.script, null, 2)
        : result.script;
    } else {
      content.textContent = JSON.stringify(result.result, null, 2);
    }
    
    output.classList.remove('hidden');
    UI.showNotification('success', 'Technique executed successfully');
  }
};

// Defensive Techniques Controller
const DefensiveTechniques = {
  async analyzeInput() {
    const input = document.getElementById('defenseInput').value;
    
    if (!input) {
      UI.showNotification('error', 'Please enter text to analyze');
      return;
    }
    
    try {
      const analysis = await API.post('/hypnosis/defensive/analyze', {
        input,
        mode: 'auto'
      });
      
      this.showAnalysis(analysis.analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  },
  
  showAnalysis(analysis) {
    const resultDiv = document.getElementById('analysisResult');
    const content = document.getElementById('analysisContent');
    
    const threatColors = {
      none: 'text-green-400',
      low: 'text-yellow-400',
      medium: 'text-orange-400',
      high: 'text-red-400',
      critical: 'text-red-600'
    };
    
    content.innerHTML = `
      <div class="space-y-3">
        <div class="flex justify-between">
          <span>Threat Detected:</span>
          <span class="${analysis.threatDetected ? 'text-red-400' : 'text-green-400'}">
            ${analysis.threatDetected ? 'YES' : 'NO'}
          </span>
        </div>
        
        <div class="flex justify-between">
          <span>Threat Level:</span>
          <span class="${threatColors[analysis.threatLevel]}">
            ${analysis.threatLevel.toUpperCase()}
          </span>
        </div>
        
        ${analysis.attackType ? `
          <div>
            <span class="font-semibold">Attack Type:</span>
            <p class="text-sm text-gray-300">${analysis.attackType}</p>
          </div>
        ` : ''}
        
        <div>
          <span class="font-semibold">Defense Strategy:</span>
          <p class="text-sm text-gray-300">${analysis.defenseStrategy}</p>
        </div>
        
        <div>
          <span class="font-semibold">Counter-Measures:</span>
          <ul class="text-sm text-gray-300 list-disc list-inside mt-1">
            ${analysis.counterMeasures.map(measure => `<li>${measure}</li>`).join('')}
          </ul>
        </div>
        
        ${analysis.recommendations.length > 0 ? `
          <div>
            <span class="font-semibold">Recommendations:</span>
            <ul class="text-sm text-gray-300 mt-1">
              ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
    
    resultDiv.classList.remove('hidden');
    UI.updateStatus({ threat: analysis.threatLevel });
  },
  
  async activateShield() {
    UI.showNotification('info', 'Mental shield activated - You are protected');
    UI.updateStatus({ defense: true });
  },
  
  async patternInterrupt() {
    UI.showNotification('success', 'Pattern interrupt executed - Flow broken');
  }
};

// Practice Mode Controller
const Practice = {
  selectedAgent: null,
  
  selectAgent(type) {
    this.selectedAgent = type;
    UI.showNotification('info', `Selected ${type} agent`);
  },
  
  async startSession() {
    if (!this.selectedAgent) {
      UI.showNotification('error', 'Please select a practice partner');
      return;
    }
    
    const difficulty = document.getElementById('practiceDifficulty').value;
    
    try {
      const session = await API.post('/practice/start-session', {
        mode: this.selectedAgent,
        difficulty,
        agentType: this.selectedAgent
      });
      
      AppState.currentSession = session.sessionId;
      AppState.currentAgent = session.agent;
      
      this.showPracticeArea(session);
    } catch (error) {
      console.error('Failed to start practice session:', error);
    }
  },
  
  showPracticeArea(session) {
    const practiceArea = document.getElementById('practiceArea');
    const agentProfile = document.getElementById('agentProfile');
    
    agentProfile.innerHTML = `
      <div class="space-y-2 text-sm">
        <p><span class="font-semibold">Name:</span> ${session.agent.name}</p>
        <p><span class="font-semibold">Type:</span> ${session.agent.type}</p>
        <p><span class="font-semibold">Skill Level:</span> ${session.agent.skillLevel}/10</p>
        <p><span class="font-semibold">Current State:</span></p>
        <div class="grid grid-cols-2 gap-2 mt-2">
          <div>Trance: ${session.agent.currentState.tranceDepth}%</div>
          <div>Resistance: ${session.agent.currentState.resistance}%</div>
          <div>Suggestibility: ${session.agent.currentState.suggestibility}%</div>
          <div>Awareness: ${session.agent.currentState.awareness}%</div>
        </div>
      </div>
      
      <div class="mt-4 p-3 bg-gray-800 rounded">
        <p class="text-xs">${session.instructions}</p>
      </div>
    `;
    
    practiceArea.classList.remove('hidden');
    
    // Add initial message to chat
    this.addChatMessage('system', session.instructions);
  },
  
  async sendTechnique() {
    const input = document.getElementById('practiceInput');
    const technique = input.value;
    
    if (!technique) return;
    
    this.addChatMessage('user', technique);
    input.value = '';
    
    // Simulate agent response (in production, this would call the API)
    setTimeout(() => {
      this.addChatMessage('agent', 'Agent response to your technique...');
    }, 1500);
  },
  
  addChatMessage(sender, message) {
    const chat = document.getElementById('practiceChat');
    const messageDiv = document.createElement('div');
    messageDiv.className = `mb-3 ${sender === 'user' ? 'text-right' : ''}`;
    
    const senderColors = {
      user: 'bg-purple-600',
      agent: 'bg-gray-600',
      system: 'bg-blue-600'
    };
    
    messageDiv.innerHTML = `
      <div class="inline-block max-w-xs">
        <div class="text-xs text-gray-400 mb-1">${sender}</div>
        <div class="${senderColors[sender]} rounded-lg px-4 py-2 text-sm">
          ${message}
        </div>
      </div>
    `;
    
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
  }
};

// Commands Controller
const Commands = {
  async analyzeMoment() {
    const result = await API.post('/command/analyze-moment', {
      context: window.location.href,
      data: { timestamp: new Date().toISOString() }
    });
    
    UI.showNotification('info', 'Moment analyzed - Check console for details');
    console.log('Analysis:', result);
  },
  
  async groundMe() {
    const result = await API.post('/command/ground-me', {
      context: 'User requested grounding'
    });
    
    UI.showNotification('success', 'Grounding protocol activated');
    console.log('Grounding:', result);
  },
  
  async scrambleThis() {
    const result = await API.post('/command/scramble-this', {
      data: 'Current interaction patterns'
    });
    
    UI.showNotification('success', 'NLP patterns scrambled');
    console.log('Scrambled:', result);
  },
  
  async updateCaseFile() {
    const result = await API.post('/command/update-case-file', {
      data: {
        timestamp: new Date().toISOString(),
        session: AppState.currentSession,
        notes: 'User-initiated case file update'
      }
    });
    
    UI.showNotification('success', 'Case file updated');
  }
};

// Voice Commands Controller
const VoiceCommands = {
  recognition: null,
  
  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      this.processCommand(transcript);
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
  },
  
  startListening() {
    if (this.recognition) {
      this.recognition.start();
      UI.showNotification('info', 'Listening for voice commands...');
    }
  },
  
  processCommand(transcript) {
    console.log('Voice command:', transcript);
    
    // Check for emergency phrase
    if (transcript.includes('they got me')) {
      HypnosisApp.activateEmergencyProtocol();
      return;
    }
    
    // Check for other commands
    const commands = {
      'analyze this moment': () => Commands.analyzeMoment(),
      'ground me': () => Commands.groundMe(),
      'scramble this': () => Commands.scrambleThis(),
      'update the case file': () => Commands.updateCaseFile()
    };
    
    for (const [phrase, action] of Object.entries(commands)) {
      if (transcript.includes(phrase)) {
        action();
        break;
      }
    }
  }
};

// Initialize application
function initializeApp() {
  HypnosisApp.init();
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Don't auto-initialize if we're showing the welcome screen
  // User must click "Initialize System" button
});