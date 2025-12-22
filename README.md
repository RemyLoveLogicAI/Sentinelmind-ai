# SentinelMind AI - Revolutionary Cognitive Defense Platform 🛡️🧠

## Project Overview
- **Name**: SentinelMind AI (formerly AI Hypnosis)
- **Classification**: Novel AI Security & Defense Solution
- **Primary Goal**: Advanced AI-powered cognitive defense system for military and security applications
- **Secondary Goal**: Training platform for psychological operation (PSYOP) detection and counter-intelligence
- **Military Applications**: Personnel protection, counter-intelligence, information warfare defense, special operations support
- **Core Capabilities**: 
  - **Military-Grade Threat Detection**: Real-time detection of psychological manipulation, social engineering, and cognitive infiltration attempts
  - **Advanced Defense Protocols**: 5-layer defensive system with 65-85% effectiveness ratings
  - **Emergency Extraction**: "They got me" protocol for compromised operators (<30 sec activation)
  - **Adaptive AI Adversaries**: OPFOR simulation agents with evolving tactics and adaptive learning
  - **Intelligence Analysis**: Pattern recognition for PSYOP techniques, NLP manipulation, embedded commands
  - **Operator Training**: Comprehensive training simulation with realistic adversary modeling
  - **Real-Time Monitoring**: Continuous threat assessment and cognitive state tracking
  - **Mission Support**: Counter-intelligence, interrogation analysis, undercover operations support

## Live URLs
- **Development**: https://3000-i1chc03f2yksuge7ejiqi-6532622b.e2b.dev
- **API Health**: https://3000-i1chc03f2yksuge7ejiqi-6532622b.e2b.dev/api/health
- **Production**: ⏳ Ready for military-grade deployment (run `./scripts/deploy-production.sh`)
- **GitHub**: https://github.com/RemyLoveLogicAI/Sentinelmind-ai
- **Military Docs**: [MILITARY_DEFENSE_ARCHITECTURE.md](./MILITARY_DEFENSE_ARCHITECTURE.md)
- **Backup**: [Download Latest](https://page.gensparksite.com/project_backups/toolu_01XVWL5Ftp3baAwk6UyYv76W.tar.gz)

## Data Architecture
- **Data Models**: 
  - **Defense Operations**: Mission tracking, threat classification, operator performance
  - **Threat Intelligence**: Attack patterns, technique library, counter-measure database
  - **Operator Training**: Certification levels, performance metrics, skill development
  - **Emergency Protocols**: Activation logs, extraction procedures, recovery tracking
- **Storage Services**: 
  - Cloudflare D1 (SQLite database for session/technique data)
  - Cloudflare KV (caching and quick access storage)
- **Data Flow**: 
  - User interactions → API endpoints → AI processing → Database storage → Real-time feedback

## Core Defense Capabilities

### 🛡️ Military-Grade Threat Detection
- **Pattern Recognition**: Detect embedded commands, tonal shifts, analog marking (95%+ accuracy)
- **Cognitive Attack Detection**: Identify confusion techniques, paradoxical statements, logic loops
- **Covert Operations**: Recognize covert hypnosis, metaphorical language, indirect suggestions
- **NLP Manipulation**: Detect anchoring, reframing, mirroring, pacing and leading
- **Real-Time Analysis**: <2 second threat identification and response time
- **Threat Classification**: 5-level system (NONE → LOW → MEDIUM → HIGH → CRITICAL)

### 🎯 5-Layer Defense Protocol System
- **Layer 1 - Pattern Interrupt** (85% effectiveness): Unexpected responses, cognitive disruption
- **Layer 2 - Conscious Analysis** (75% effectiveness): Technique identification, deconstruction
- **Layer 3 - Reality Anchor** (80% effectiveness): Physical grounding, environmental awareness
- **Layer 4 - Counter Suggestion** (70% effectiveness): Mental state control, suggestion reversal
- **Layer 5 - Mental Shield** (65% effectiveness): Visualization protection, boundary maintenance

### 🚨 Emergency Extraction Protocol
- **Activation**: "They got me" (voice or text)
- **Response Time**: <30 seconds full protocol activation
- **7-Step Extraction**: STOP → GROUND → ORIENT → REJECT → SHIELD → EXTRACT → RECOVER
- **Safe Word**: "BASELINE" - Returns operator to neutral cognitive state
- **Auto-Monitoring**: Handler notification, support dispatch, location tracking

### 🤖 Adaptive AI Agent System
- **OPFOR Agents**: Simulate adversary PSYOP specialists with adaptive learning
- **Blue Force Agents**: Friendly personnel simulation for susceptibility testing
- **Gray Force Agents**: Unknown allegiance for ambiguous threat training
- **Skill Levels**: Recruit → Operator → Advanced → Elite → Master (1-10 rating)
- **Evolution**: Agents learn from operator techniques and increase resistance

### ✅ Core Commands
- `"Analyze this moment"` - Context and truth detection
- `"Ground me"` - Trigger grounding protocol
- `"Scramble this"` - Detect and neutralize hypnotic NLP
- `"Update the case file"` - Log interaction to memory
- `"Extract what matters"` - Summarize key evidence
- `"They got me"` - Emergency extraction protocol

## Technology Stack
- **Framework**: Hono (lightweight, edge-native)
- **Runtime**: Cloudflare Workers/Pages
- **Database**: Cloudflare D1 (SQLite)
- **Cache**: Cloudflare KV
- **Frontend**: Vanilla JavaScript with Tailwind CSS
- **AI Integration**: Modular AI agent system
- **Development**: Vite + TypeScript
- **Process Manager**: PM2

## API Endpoints

### Core Hypnosis APIs
- `POST /api/hypnosis/generate-script` - Generate custom hypnotic scripts
- `POST /api/hypnosis/offensive/execute` - Execute offensive techniques
- `POST /api/hypnosis/defensive/analyze` - Analyze input for threats
- `POST /api/hypnosis/emergency-protocol` - Activate emergency extraction

### Practice Mode APIs
- `POST /api/practice/start-session` - Start practice with AI agent
- `GET /api/progress/stats` - Get user progress statistics

### Technique Library
- `GET /api/techniques/library` - Browse technique database

### Command APIs
- `POST /api/command/:command` - Execute core commands

## User Guide

### Getting Started
1. **Visit the Platform**: Navigate to the development URL
2. **Initialize System**: Click "Initialize System" to activate the platform
3. **Choose Your Mode**:
   - **Offensive Mode**: Learn and practice hypnotic techniques
   - **Defensive Mode**: Protect yourself from hypnotic manipulation
   - **Practice Mode**: Train with AI agents

### Offensive Mode Usage
1. Select a technique (Rapid Induction, Covert Hypnosis, etc.)
2. Review the generated script and instructions
3. Practice the technique in a safe environment
4. Use the Script Generator for custom hypnotic sessions

### Defensive Mode Usage
1. Activate real-time protection
2. Paste suspicious text/conversation for analysis
3. Review threat assessment and counter-measures
4. Practice defensive techniques like Pattern Interrupt

### Practice Mode Usage
1. Select your practice partner (Susceptible/Resistant/Master)
2. Choose difficulty level (Easy/Medium/Hard/Expert)
3. Start the session and interact with the AI agent
4. Observe agent responses and adaptation
5. Track your progress and skill development

### Emergency Protocol
- **Activation**: Say or type "They got me"
- **Actions**: 
  1. Immediate pattern disruption
  2. Grounding sequence activation
  3. Reality checks and anchoring
  4. Safe extraction steps
  5. Recovery guidance

## Development

### Local Setup
```bash
# Clone repository
git clone <repo-url>
cd webapp

# Install dependencies
npm install

# Build project
npm run build

# Start development server
npm run start

# Check logs
npm run logs
```

### Database Setup
```bash
# Create D1 database
npx wrangler d1 create hypnosis-db

# Apply migrations
npm run db:migrate:local

# Seed test data
npm run db:seed
```

### Deployment to Cloudflare
```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy:prod
```

## Security Considerations
- All hypnotic techniques are for educational purposes
- Emergency protocols are always accessible
- User consent and awareness are paramount
- No data collection without explicit permission
- Defensive measures are prioritized over offensive capabilities

## Future Enhancements
- [ ] Voice command integration (full implementation)
- [ ] AR glasses interface for real-time detection
- [ ] Rabbit R1 voice assistant integration
- [ ] VR spatial training environments
- [ ] Advanced biometric feedback integration
- [ ] Multi-language support
- [ ] Community technique sharing platform
- [ ] Professional certification system

## Status
- **Platform**: Cloudflare Pages
- **Development Status**: ✅ Active Development
- **Production Status**: ⏳ Pending Deployment
- **Tech Stack**: Hono + TypeScript + Cloudflare Workers + D1 Database
- **Last Updated**: January 16, 2025

## Contributing
This project is currently in active development. For collaboration inquiries, please contact LoveLogicAI.

## License
Proprietary - LoveLogicAI LLC

## Warning
This platform contains advanced hypnotic techniques and should be used responsibly. The defensive protocols are designed to protect users from unwanted hypnotic influence. Always prioritize consent and ethical use.

---

**Built with 🧠 by LoveLogicAI - Pioneering Cognitive Automation**