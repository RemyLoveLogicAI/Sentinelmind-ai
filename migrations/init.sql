-- AI Hypnosis Platform - Database Schema
-- Revolutionary hypnotism tracking and analysis

-- Sessions table for tracking all hypnosis sessions
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'offensive', 'defensive', 'practice_susceptible', etc.
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'aborted'
  data TEXT, -- JSON data for session details
  threat_level TEXT, -- For defensive sessions
  effectiveness_score REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME
);

-- Techniques table for hypnosis technique library
CREATE TABLE IF NOT EXISTS techniques (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL, -- 'induction', 'deepener', 'suggestion', 'emergence', 'nlp', 'defensive'
  name TEXT NOT NULL,
  description TEXT,
  script TEXT, -- JSON structure with full script
  difficulty TEXT, -- 'beginner', 'intermediate', 'advanced', 'master'
  type TEXT, -- 'offensive', 'defensive', 'neutral'
  effectiveness_rating REAL DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  success_rate REAL DEFAULT 0,
  counters TEXT, -- JSON array of counter-technique IDs
  tags TEXT, -- JSON array of tags
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  technique_id INTEGER,
  session_id TEXT,
  success_rate REAL,
  trance_depth REAL, -- 0-100 scale
  resistance_level REAL, -- 0-100 scale
  notes TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (technique_id) REFERENCES techniques(id),
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Defense logs for threat detection history
CREATE TABLE IF NOT EXISTS defense_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  session_id TEXT,
  attack_type TEXT, -- 'embedded_commands', 'confusion_technique', 'rapid_induction', etc.
  threat_level TEXT, -- 'none', 'low', 'medium', 'high', 'critical'
  defense_used TEXT, -- 'pattern_interrupt', 'conscious_analysis', 'reality_anchor', etc.
  success BOOLEAN,
  confidence_score REAL,
  patterns_detected TEXT, -- JSON array of detected patterns
  counter_measures TEXT, -- JSON array of applied counter-measures
  details TEXT, -- JSON with full analysis
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Practice agent interactions
CREATE TABLE IF NOT EXISTS agent_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  agent_type TEXT NOT NULL, -- 'susceptible', 'resistant', 'offensive'
  agent_profile TEXT, -- JSON with full agent profile
  technique_used TEXT,
  agent_response TEXT,
  effectiveness REAL,
  agent_adaptation_level INTEGER DEFAULT 0,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Emergency protocol activations
CREATE TABLE IF NOT EXISTS emergency_protocols (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  trigger_phrase TEXT, -- Usually "They got me"
  activation_context TEXT, -- JSON with context data
  grounding_sequence TEXT, -- JSON with grounding steps taken
  extraction_successful BOOLEAN DEFAULT TRUE,
  recovery_time_seconds INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Script generations
CREATE TABLE IF NOT EXISTS generated_scripts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  type TEXT NOT NULL, -- 'induction', 'deepener', 'suggestion', 'emergence', 'full_session'
  goal TEXT NOT NULL,
  intensity TEXT NOT NULL, -- 'light', 'medium', 'deep', 'extreme'
  customization TEXT, -- JSON with customization parameters
  script_content TEXT NOT NULL, -- JSON with full generated script
  duration_minutes INTEGER,
  techniques_used TEXT, -- JSON array of technique IDs
  rating INTEGER, -- User rating 1-5
  usage_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User preferences and settings
CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY,
  defense_mode TEXT DEFAULT 'auto', -- 'aggressive', 'passive', 'auto'
  emergency_contacts TEXT, -- JSON array of emergency contacts
  voice_commands_enabled BOOLEAN DEFAULT TRUE,
  practice_difficulty TEXT DEFAULT 'medium',
  notification_preferences TEXT, -- JSON with notification settings
  custom_triggers TEXT, -- JSON array of custom emergency triggers
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  event_type TEXT NOT NULL,
  event_data TEXT, -- JSON with event details
  session_id TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_type ON sessions(type);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_techniques_category ON techniques(category);
CREATE INDEX IF NOT EXISTS idx_techniques_type ON techniques(type);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_defense_logs_user_id ON defense_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_defense_logs_threat_level ON defense_logs(threat_level);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_session_id ON agent_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_emergency_protocols_user_id ON emergency_protocols(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_scripts_user_id ON generated_scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);

-- Insert default techniques
INSERT OR IGNORE INTO techniques (category, name, type, difficulty, description, script) VALUES
('induction', 'Progressive Relaxation', 'neutral', 'beginner', 'Classic relaxation induction', '{"steps": ["Deep breathing", "Muscle relaxation", "Mental calm"]}'),
('induction', 'Rapid Handshake', 'offensive', 'advanced', 'Instant induction via pattern interrupt', '{"steps": ["Handshake initiation", "Pattern interrupt", "Drop command"]}'),
('defensive', 'Pattern Awareness', 'defensive', 'intermediate', 'Conscious recognition of hypnotic patterns', '{"steps": ["Monitor language", "Identify patterns", "Verbalize recognition"]}'),
('nlp', 'Embedded Commands', 'offensive', 'advanced', 'Hidden suggestions in normal speech', '{"patterns": ["Analog marking", "Tonal shifts", "Pause patterns"]}'),
('defensive', 'Reality Testing', 'defensive', 'beginner', 'Ground in physical reality', '{"steps": ["5-4-3-2-1 technique", "Physical movement", "Temporal orientation"]}');