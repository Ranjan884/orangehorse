import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Fallback generator for coach summary
function generateFallbackCoachSummary(data: any): string {
  const { currentACWR, recoveryScore, injuryRiskPct, acuteLoad, chronicLoad, upcomingMatches } = data;
  let riskAssessment = 'optimal physiological adaptation';
  if (currentACWR > 1.5) {
    riskAssessment = 'elevated soft-tissue strain and spike in neuromuscular fatigue (ACWR > 1.5)';
  } else if (currentACWR > 1.3) {
    riskAssessment = 'moderate accumulation of acute stress approaching the upper boundary';
  } else if (currentACWR < 0.8) {
    riskAssessment = 'under-loading risk with potential deconditioning if sustained';
  }

  const nextMatch = upcomingMatches && upcomingMatches.length > 0 ? upcomingMatches[0] : null;
  const matchNotice = nextMatch
    ? `Target fixture vs ${nextMatch.opponent} in ${nextMatch.daysAway} days necessitates strict tapering on MD-1.`
    : 'No critical fixtures scheduled within the next 72 hours, permitting standard overload progression.';

  return `Athlete presents an Acute:Chronic Workload Ratio of ${currentACWR.toFixed(2)} (Acute: ${Math.round(acuteLoad)} AU, Chronic: ${Math.round(chronicLoad)} AU) alongside a recovery readiness score of ${recoveryScore}%. The risk engine computes an injury vulnerability index of ${Math.round(injuryRiskPct)}%, placing the athlete in ${riskAssessment}. ${matchNotice} Microcycle loads have been dynamically balanced to preserve neuromuscular freshness while reinforcing mitochondrial stamina.`;
}

// Fallback coach chat
function generateFallbackChatReply(message: string, context: any): string {
  const lower = message.toLowerCase();
  const { currentACWR, recoveryScore, injuryRiskPct } = context;

  if (lower.includes('recover') || lower.includes('rest') || lower.includes('sore')) {
    return `Based on your recovery score of ${recoveryScore}% and ACWR of ${currentACWR.toFixed(2)}, sleep quality and HRV should dictate your training tolerance. If recovery remains below 50%, the agent will automatically substitute high-impact plyometrics with non-eccentric spin or pool mobility to flush lactate without inducing further myofibrillar trauma.`;
  }
  if (lower.includes('match') || lower.includes('game') || lower.includes('fixture')) {
    return `Match Day minus 1 (MD-1) is strictly reserved for an activation taper at ~40% chronic load. We prioritize short high-speed coordination drills (<10m accelerations) with extended rest intervals to stimulate central nervous system potentiation while ensuring glycogen stores remain fully replenished for kickoff.`;
  }
  if (lower.includes('override') || lower.includes('change') || lower.includes('heavy')) {
    return `You can freely adjust target AU for any microcycle day in the 7-Day Plan tab. Keep in mind that forcing load increments beyond +15% week-over-week risks exceeding the 1.3-1.5 ACWR caution threshold, which our deterministic model flags as high injury risk.`;
  }
  return `Under the Gabbett ACWR framework, maintaining a 0.8–1.3 sweet spot provides a protective vaccine effect against soft-tissue injuries. Your current ACWR is ${currentACWR.toFixed(2)} with an estimated injury risk score of ${Math.round(injuryRiskPct)}%. Focus on completing planned sessions without exceeding prescribed volume caps.`;
}

// ============ API ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Coach Summary Endpoint
app.post('/api/coach-summary', async (req, res) => {
  try {
    const data = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Return high-fidelity sports-science summary if API key is not set
      const summary = generateFallbackCoachSummary(data);
      return res.json({ summary, source: 'sports-science-engine' });
    }

    const prompt = `You are an elite, approachable High-Performance Sports Coach.
The athlete is ${data.athleteName || 'Alexandre'} competing in ${data.sport || 'Soccer'} (Goal: ${data.goal || 'Competition'}).
Analyze their biometrics:
- Training Balance (ACWR): ${data.currentACWR}
- This Week's Effort (Acute Load): ${data.acuteLoad} AU
- Fitness Base Engine (Chronic Load): ${data.chronicLoad} AU
- Recovery & Body Battery: ${data.recoveryScore}%
- Calculated Injury Risk: ${data.injuryRiskPct}%
- Upcoming Events: ${JSON.stringify(data.upcomingMatches || [])}
- 7-Day Plan: ${JSON.stringify(data.sevenDayPlan || [])}

Provide a clear, encouraging, friendly 3-sentence coach briefing that a normal person can easily understand.
Cover:
1. Are they in the safe Training Sweet Spot (0.80 to 1.30) or pushing too hard?
2. How ready their body feels based on recovery/sleep.
3. Simple advice for the next upcoming event or today's session.
Speak clearly, warmly, without dense jargon.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.4,
      },
    });

    const summary = response.text?.trim() || generateFallbackCoachSummary(data);
    res.json({ summary, source: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('Error in /api/coach-summary:', error);
    res.json({
      summary: generateFallbackCoachSummary(req.body),
      source: 'sports-science-engine-fallback',
    });
  }
});

// Coach Chat Endpoint
app.post('/api/coach-chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const reply = generateFallbackChatReply(message, context || {});
      return res.json({ reply, source: 'sports-science-engine' });
    }

    const prompt = `You are Coach Marcus, a supportive and knowledgeable High-Performance Sports Coach.
The athlete is ${context?.athleteName || 'Alexandre'} (${context?.sport || 'Soccer'}).
Their biometric context:
- Training Balance (ACWR): ${context?.currentACWR}
- This Week's Effort (Acute Load): ${context?.acuteLoad} AU
- Fitness Base Engine (Chronic Load): ${context?.chronicLoad} AU
- Body Battery / Recovery: ${context?.recoveryScore}%
- Injury Risk: ${context?.injuryRiskPct}%
- Upcoming Events: ${JSON.stringify(context?.upcomingMatches || [])}
- 7-Day Plan: ${JSON.stringify(context?.sevenDayPlan || [])}

The athlete asks:
"${message}"

Respond warmly, practically, and in plain language (2-3 concise paragraphs).
Ground your answer in sports science (like the 0.8–1.3 sweet spot, sleep, and proper pacing) but explain concepts so that normal people and weekend warriors can immediately apply the advice.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
      },
    });

    const reply = response.text?.trim() || generateFallbackChatReply(message, context || {});
    res.json({ reply, source: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('Error in /api/coach-chat:', error);
    res.json({
      reply: generateFallbackChatReply(req.body.message, req.body.context || {}),
      source: 'sports-science-engine-fallback',
    });
  }
});

// ============ VITE MIDDLEWARE ============
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Autonomous Athlete Performance Planner running on port ${PORT}`);
  });
}

startServer();
