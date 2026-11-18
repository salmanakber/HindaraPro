import express from 'express';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {
  FunctionCallingConfigMode,
  type FunctionDeclaration,
  GoogleGenAI,
  ThinkingLevel,
  Type,
} from '@google/genai';
import {
  BRAND_VIDEOS,
  ENGAGEMENT_TRACKS,
  FOUNDER_PROFILE,
  SAAS_VENTURES,
  SERVICE_CAPABILITIES,
} from './src/data/portfolio.ts';
import {
  type AssistantLanguageCode,
  type AssistantMode,
  type AssistantToolAction,
  buildBrandVideoFocusAction,
  buildHireBriefDraftAction,
  buildHireScopeSummary,
  buildScopeRecommendationAction,
  buildVentureSpotlightAction,
  resolveAssistantLanguage,
  sanitizeSpeechText,
  validateHireBrief,
  type HireBriefInput,
} from './src/utils/portfolioLogic.ts';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const RECIPIENT_EMAIL = process.env.HIRE_TO_EMAIL || 'hindarapro@gmail.com';
const DATA_DIR = path.resolve(process.cwd(), '.data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'hire-inquiries.json');

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildHtmlEmail(
  summary: ReturnType<typeof buildHireScopeSummary>,
  goals: string
): string {
  const deliverablesList = summary.deliverables
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #15102b; max-width: 640px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #5b21b6; font-weight: 700;">
        Hindara Labs · New Hire Inquiry (${escapeHtml(summary.briefId)})
      </p>
      <h1 style="font-size: 22px; margin: 8px 0 16px;">${escapeHtml(summary.trackTitle)}</h1>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
        <tr><td style="padding: 6px 0; color: #5e567a;">Client</td><td style="padding: 6px 0; font-weight: 600;">${escapeHtml(summary.clientName)} (${escapeHtml(summary.clientEmail)})</td></tr>
        <tr><td style="padding: 6px 0; color: #5e567a;">Company / Venture</td><td style="padding: 6px 0;">${escapeHtml(summary.companyOrProject)}</td></tr>
        <tr><td style="padding: 6px 0; color: #5e567a;">Cadence</td><td style="padding: 6px 0;">${escapeHtml(summary.cadence)}</td></tr>
        <tr><td style="padding: 6px 0; color: #5e567a;">Timeline</td><td style="padding: 6px 0;">${escapeHtml(summary.timelineLabel)}</td></tr>
        <tr><td style="padding: 6px 0; color: #5e567a;">Budget</td><td style="padding: 6px 0;">${escapeHtml(summary.budgetLabel)}</td></tr>
      </table>
      <div style="background: #f6f3ff; border: 1px solid #e3dcf5; border-radius: 12px; padding: 16px; margin-bottom: 18px;">
        <p style="margin: 0 0 8px; font-weight: 700; font-size: 13px;">Scope &amp; Objectives</p>
        <p style="margin: 0; white-space: pre-wrap; line-height: 1.55;">${escapeHtml(goals)}</p>
      </div>
      <p style="font-size: 13px; font-weight: 700; margin-bottom: 6px;">Included Deliverables:</p>
      <ul style="font-size: 13px; color: #3b3454; padding-left: 18px;">${deliverablesList}</ul>
    </div>
  `;
}

function recordInquiry(record: Record<string, unknown>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const existing: unknown[] = fs.existsSync(INQUIRIES_FILE)
      ? JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf-8'))
      : [];
    existing.push(record);
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist inquiry locally:', err);
  }
}

async function sendHireEmail(
  summary: ReturnType<typeof buildHireScopeSummary>,
  goals: string
): Promise<{ emailed: boolean; deliveryMethod: 'resend' | 'smtp' | 'saved'; note?: string }> {
  const subject = `[Hire Inquiry ${summary.briefId}] ${summary.trackTitle} — ${summary.companyOrProject}`;
  const html = buildHtmlEmail(summary, goals);

  // 1. Resend HTTP API if configured
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    const fromAddress =
      process.env.EMAIL_FROM?.trim() || 'Hindara Labs <onboarding@resend.dev>';
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [RECIPIENT_EMAIL],
        reply_to: summary.clientEmail,
        subject,
        text: summary.formattedBriefText,
        html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Resend delivery error: ${detail}`);
    }
    return { emailed: true, deliveryMethod: 'resend' };
  }

  // 2. Nodemailer SMTP if credentials configured
  const smtpUser = (process.env.SMTP_USER || process.env.GMAIL_USER)?.trim();
  const smtpPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD)?.trim();
  if (smtpUser && smtpPass) {
    const smtpHost = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpSecure =
      process.env.SMTP_SECURE !== undefined
        ? process.env.SMTP_SECURE === 'true'
        : smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM?.trim() || `"Hindara Labs Brief" <${smtpUser}>`,
      to: RECIPIENT_EMAIL,
      replyTo: summary.clientEmail,
      subject,
      text: summary.formattedBriefText,
      html,
    });
    return { emailed: true, deliveryMethod: 'smtp' };
  }

  return {
    emailed: false,
    deliveryMethod: 'saved',
    note: 'SMTP/Resend credentials are not set in this environment; brief saved with direct email fallback.',
  };
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/hire-inquiry', async (req, res) => {
    const input = req.body as HireBriefInput;
    const validation = validateHireBrief(input);
    if (!validation.valid) {
      res.status(400).json({ ok: false, errors: validation.errors });
      return;
    }

    const summary = buildHireScopeSummary(input);
    const cleanGoals = input.projectGoals.trim();

    let delivery: { emailed: boolean; deliveryMethod: 'resend' | 'smtp' | 'saved'; note?: string };
    try {
      delivery = await sendHireEmail(summary, cleanGoals);
    } catch (err) {
      console.error('Email dispatch failed:', err);
      delivery = {
        emailed: false,
        deliveryMethod: 'saved',
        note: 'Direct mail relay failed; inquiry recorded locally.',
      };
    }

    recordInquiry({
      briefId: summary.briefId,
      createdAt: new Date().toISOString(),
      emailed: delivery.emailed,
      deliveryMethod: delivery.deliveryMethod,
      clientName: summary.clientName,
      clientEmail: summary.clientEmail,
      companyOrProject: summary.companyOrProject,
      trackTitle: summary.trackTitle,
      timelineLabel: summary.timelineLabel,
      budgetLabel: summary.budgetLabel,
      projectGoals: cleanGoals,
    });

    res.status(201).json({
      ok: true,
      emailed: delivery.emailed,
      deliveryMethod: delivery.deliveryMethod,
      recipientEmail: RECIPIENT_EMAIL,
      note: delivery.note,
      summary,
    });
  });

  const STUDIO_TOOLS: FunctionDeclaration[] = [
    {
      name: 'recommendArchitectureScope',
      description:
        'Generate an interactive project architecture & engagement scope card with recommended track, timeline, budget range, and technical summary when the user asks to scope, estimate, build, or price a new SaaS, mobile, Shopify, or AI project.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          surfaces: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description:
              'Required surfaces from: web-saas, mobile-app, shopify-app, ai-agent.',
          },
          stage: {
            type: Type.STRING,
            description:
              'Project stage from: idea-mvp, integrations, scale-existing.',
          },
          companyOrProject: {
            type: Type.STRING,
            description: 'Optional company or product name mentioned by the visitor.',
          },
          customSummary: {
            type: Type.STRING,
            description:
              'Concise 1-2 sentence tailored scope summary ready to prefill into the Hire Brief form.',
          },
        },
        required: ['surfaces', 'stage'],
      },
    },
    {
      name: 'spotlightSaasVentures',
      description:
        'Display interactive showcase cards for specific Hindara Labs owned SaaS products (tidyflow, tidyagent, tidysync, stocksentry, aftersale, slotwise) when comparing products or recommending a fit.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          ventureIds: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description:
              'Product IDs from: tidyflow, tidyagent, tidysync, stocksentry, aftersale, slotwise.',
          },
          comparisonSummary: {
            type: Type.STRING,
            description: 'Concise 1-sentence reason why these Hindara Labs products fit.',
          },
        },
        required: ['ventureIds', 'comparisonSummary'],
      },
    },
    {
      name: 'prepareHireBrief',
      description:
        'Prepare an interactive Hire Brief card that lets the visitor prefill the Hire Me form or submit directly to Suleman Khan at hindarapro@gmail.com when the visitor wants to start a project inquiry or provides project details/email.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          clientName: { type: Type.STRING },
          clientEmail: { type: Type.STRING },
          companyOrProject: { type: Type.STRING },
          trackId: {
            type: Type.STRING,
            description: 'One of: mvp-build, fractional-cto, mobile-shopify.',
          },
          timeline: {
            type: Type.STRING,
            description: 'One of: immediate, next-month, flexible.',
          },
          budgetRange: {
            type: Type.STRING,
            description: 'One of: under-5k, 5k-15k, 15k-plus, retainer.',
          },
          projectGoals: {
            type: Type.STRING,
            description: 'Clear summary of what the visitor wants built (at least 25 characters).',
          },
        },
        required: ['trackId', 'projectGoals'],
      },
    },
    {
      name: 'showBrandVideoReel',
      description:
        'Offer an interactive action button to jump directly to and play one of Hindara Labs SEO brand films (studio-showcase, operations-ai, commerce-scheduling).',
      parameters: {
        type: Type.OBJECT,
        properties: {
          videoId: {
            type: Type.STRING,
            description: 'One of: studio-showcase, operations-ai, commerce-scheduling.',
          },
        },
        required: ['videoId'],
      },
    },
  ];

  function executeStudioTool(
    name: string,
    args: Record<string, unknown> = {}
  ): AssistantToolAction | null {
    switch (name) {
      case 'recommendArchitectureScope':
        return buildScopeRecommendationAction(args);
      case 'spotlightSaasVentures':
        return buildVentureSpotlightAction(args.ventureIds, args.comparisonSummary);
      case 'prepareHireBrief':
        return buildHireBriefDraftAction(args);
      case 'showBrandVideoReel':
        return buildBrandVideoFocusAction(args.videoId);
      default:
        return null;
    }
  }

  app.post('/api/chat', async (req, res) => {
    const body = req.body as {
      messages?: Array<{ role?: string; content?: string }>;
      contextVentureId?: string;
      mode?: AssistantMode;
      language?: AssistantLanguageCode;
    };

    const rawMessages = Array.isArray(body?.messages) ? body.messages : [];
    const validMessages = rawMessages
      .filter(
        (m): m is { role: 'user' | 'assistant'; content: string } =>
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string' &&
          m.content.trim().length > 0
      )
      .slice(-12);

    if (validMessages.length === 0) {
      res.status(400).json({ ok: false, error: 'Please enter a message to ask the assistant.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(503).json({
        ok: false,
        error:
          'Studio AI Assistant requires GEMINI_API_KEY to be configured in Settings > Secrets. Meanwhile, you can use the Hire Brief form or email hindarapro@gmail.com directly.',
      });
      return;
    }

    const mode: AssistantMode =
      body?.mode === 'architect' || body?.mode === 'brief-builder' ? body.mode : 'advisor';
    const selectedLang = resolveAssistantLanguage(body?.language);

    const ventureContext = SAAS_VENTURES.map(
      (v) =>
        `- [id=${v.id}] ${v.name} (${v.url}): ${v.tagline}. Platforms: ${v.platforms}. Audience: ${v.audience}. Key capabilities: ${v.capabilities.slice(0, 4).join('; ')}.`
    ).join('\n');

    const trackContext = ENGAGEMENT_TRACKS.map(
      (t) => `- [trackId=${t.id}] ${t.title} (${t.cadence}, ideal for ${t.idealFor}): ${t.description}`
    ).join('\n');

    const capabilityContext = SERVICE_CAPABILITIES.map(
      (c) => `- ${c.title} [${c.stack}]: ${c.description}`
    ).join('\n');

    const videoContext = BRAND_VIDEOS.map(
      (vid) => `- [videoId=${vid.id}] ${vid.title} (${vid.displayDuration}): ${vid.subtitle}`
    ).join('\n');

    const focusedVenture = body?.contextVentureId
      ? SAAS_VENTURES.find((v) => v.id === body.contextVentureId)
      : undefined;

    const modeGuidance =
      mode === 'architect'
        ? 'Active Mode: ARCHITECT — Focus on concrete multi-tenant database boundaries, React Native offline sync, Shopify GraphQL/webhook resilience, and LLM tool calling. Proactively call recommendArchitectureScope or spotlightSaasVentures when the visitor describes a build.'
        : mode === 'brief-builder'
          ? 'Active Mode: BRIEF BUILDER — Help convert the visitor request into a clean Hire Brief. Proactively call prepareHireBrief (or recommendArchitectureScope) with structured track, timeline, budgetRange, and projectGoals so they can apply or submit immediately.'
          : 'Active Mode: ADVISOR — Give concise executive answers about Hindara Labs, its six live SaaS products, brand films, and hiring Suleman Khan. Use tools whenever interactive cards (product spotlights, scope estimates, brief drafts, or brand reels) add clear value.';

    const languageRule =
      selectedLang.code === 'auto'
        ? 'Language Rule (Auto-Detect): Detect the exact language of the visitor\'s latest message (for example English, Urdu, Arabic, Spanish, French, German, Hindi, Chinese, Portuguese, Turkish, etc.) and write your entire conversational response—and any descriptive tool summary arguments—fluently in that same language. Always keep proper product and brand names (Hindara Labs, Suleman Khan, TidyFlow, TidyAgent, TidySync, StockSentry, AfterSale OS, SlotWise) and exact URLs/email intact.'
        : `Language Rule (Explicit): Write your entire conversational response—and any descriptive summary parameters passed to tools—strictly and fluently in ${selectedLang.englishName} (${selectedLang.nativeLabel}). Always keep proper brand/product names (Hindara Labs, Suleman Khan, TidyFlow, TidyAgent, TidySync, StockSentry, AfterSale OS, SlotWise) and exact URLs/email intact.`;

    const systemInstruction = `You are the Hindara Labs Studio Concierge AI, representing ${FOUNDER_PROFILE.studioName} and its founder ${FOUNDER_PROFILE.primaryName}.
Rules:
1. Always refer to the founder solely as "${FOUNDER_PROFILE.primaryName}" (even when responding in another language). Never use any other name or alias.
2. Be concise, crisp, authoritative, and helpful (2–4 sentences or short bullet points). Do NOT use markdown [label](url) link brackets or inline backticks — write clean plain URLs (e.g. https://hindaralabs.com/) or hindarapro@gmail.com directly.
3. ${languageRule}
4. ${modeGuidance}
5. Only cite exact URLs listed below (such as https://hindaralabs.com/ or the six product URLs) and the exact email ${FOUNDER_PROFILE.email}. Never invent or guess other domain names or construct https://hindarapro@gmail.com.
6. Invite serious project inquiries to apply the Hire Brief on the page (#hire-me) or email ${FOUNDER_PROFILE.email}.
7. Never invent fake metrics, fake client names, or unverified claims.

Founder: ${FOUNDER_PROFILE.primaryName} (${FOUNDER_PROFILE.role})
Studio: ${FOUNDER_PROFILE.studioName} (${FOUNDER_PROFILE.domain})
Direct Email: ${FOUNDER_PROFILE.email}
LinkedIn: ${FOUNDER_PROFILE.linkedinUrl}

Live Owned SaaS Portfolio:
${ventureContext}

Studio Brand Films:
${videoContext}

Engineering Capabilities:
${capabilityContext}

Hiring & Engagement Tracks:
${trackContext}${
      focusedVenture
        ? `\n\nThe visitor is currently inspecting: ${focusedVenture.name} (${focusedVenture.url}). Prioritize helpful context about ${focusedVenture.name} if relevant.`
        : ''
    }`;

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();
    res.write(': connected\n\n');

    let clientClosed = false;
    const clientAbortController = new AbortController();
    res.on('close', () => {
      if (!res.writableEnded) {
        clientClosed = true;
        clientAbortController.abort();
      }
    });

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
          timeout: 22000,
        },
      });

      const contents = validMessages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content.trim().slice(0, 2000) }],
      }));

      const candidateAttempts: Array<{ model: string; thinkingLevel: ThinkingLevel }> = [
        { model: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.MINIMAL },
        { model: 'gemini-4-hydrogen', thinkingLevel: ThinkingLevel.LOW },
      ];

      let emittedAny = false;
      let lastErr: unknown = null;
      const keepaliveTimer = setInterval(() => {
        if (!clientClosed && !res.writableEnded) {
          res.write(': keepalive\n\n');
        }
      }, 3500);

      try {
        for (const candidate of candidateAttempts) {
          if (clientClosed) break;
          const attemptSignal = AbortSignal.any([
            clientAbortController.signal,
            AbortSignal.timeout(18000),
          ]);

          try {
            const stream = await ai.models.generateContentStream({
              model: candidate.model,
              contents,
              config: {
                systemInstruction,
                tools: [{ functionDeclarations: STUDIO_TOOLS }],
                thinkingConfig: { thinkingLevel: candidate.thinkingLevel },
                abortSignal: attemptSignal,
              },
            });

            let turn1TextEmitted = false;
            const collectedCalls: Array<{
              id?: string;
              name: string;
              args?: Record<string, unknown>;
            }> = [];
            const turn1ModelParts: Array<Record<string, unknown>> = [];

            for await (const chunk of stream) {
              if (clientClosed) break;

              const rawParts = chunk.candidates?.[0]?.content?.parts;
              if (Array.isArray(rawParts)) {
                for (const p of rawParts) {
                  turn1ModelParts.push(p as Record<string, unknown>);
                }
              }

              if (Array.isArray(chunk.functionCalls)) {
                for (const fc of chunk.functionCalls) {
                  if (fc?.name) {
                    collectedCalls.push({
                      id: fc.id,
                      name: fc.name,
                      args: (fc.args as Record<string, unknown> | undefined) ?? {},
                    });
                  }
                }
              }

              const delta = chunk.text;
              if (delta) {
                emittedAny = true;
                turn1TextEmitted = true;
                res.write(`data: ${JSON.stringify({ delta })}\n\n`);
              }
            }

            if (!clientClosed && collectedCalls.length > 0) {
              const toolActions: AssistantToolAction[] = [];
              const functionResponseParts: Array<Record<string, unknown>> = [];

              for (const fc of collectedCalls) {
                const action = executeStudioTool(fc.name, fc.args ?? {});
                if (action) {
                  toolActions.push(action);
                }
                functionResponseParts.push({
                  functionResponse: {
                    ...(fc.id ? { id: fc.id } : {}),
                    name: fc.name,
                    response: { ok: Boolean(action), result: action ?? { note: 'No match' } },
                  },
                });
              }

              if (toolActions.length > 0) {
                emittedAny = true;
                res.write(`data: ${JSON.stringify({ toolActions })}\n\n`);
              }

              if (!turn1TextEmitted && !clientClosed) {
                const filteredModelParts = turn1ModelParts.filter(
                  (p) => Boolean((p as { functionCall?: unknown }).functionCall)
                );
                const safeModelParts =
                  filteredModelParts.length > 0
                    ? filteredModelParts
                    : collectedCalls.map((fc) => ({
                        functionCall: {
                          ...(fc.id ? { id: fc.id } : {}),
                          name: fc.name,
                          args: fc.args ?? {},
                        },
                      }));

                let followUpTextEmitted = false;
                try {
                  const followUpSignal = AbortSignal.any([
                    clientAbortController.signal,
                    AbortSignal.timeout(12000),
                  ]);

                  const followUpStream = await ai.models.generateContentStream({
                    model: candidate.model,
                    contents: [
                      ...contents,
                      { role: 'model', parts: safeModelParts },
                      { role: 'user', parts: functionResponseParts },
                    ],
                    config: {
                      systemInstruction,
                      tools: [{ functionDeclarations: STUDIO_TOOLS }],
                      toolConfig: {
                        functionCallingConfig: {
                          mode: FunctionCallingConfigMode.NONE,
                        },
                      },
                      thinkingConfig: { thinkingLevel: candidate.thinkingLevel },
                      abortSignal: followUpSignal,
                    },
                  });

                  for await (const followChunk of followUpStream) {
                    if (clientClosed) break;
                    const followDelta = followChunk.text;
                    if (followDelta) {
                      emittedAny = true;
                      followUpTextEmitted = true;
                      res.write(`data: ${JSON.stringify({ delta: followDelta })}\n\n`);
                    }
                  }
                } catch (followErr) {
                  console.error(
                    `Studio chat Turn 2 (${candidate.model}) fallback:`,
                    followErr instanceof Error ? followErr.message : String(followErr)
                  );
                }

                if (!followUpTextEmitted && !clientClosed && toolActions.length > 0) {
                  const firstAction = toolActions[0];
                  const fallbackSummary =
                    firstAction.type === 'scope_recommendation'
                      ? `Recommended track: **${firstAction.recommendation.trackTitle}** (${firstAction.recommendation.estimatedWeeks}). You can apply this scope straight into the Hire Brief form below or email ${FOUNDER_PROFILE.email}.`
                      : firstAction.type === 'venture_spotlight'
                        ? firstAction.comparisonSummary
                        : firstAction.type === 'hire_brief_draft'
                          ? firstAction.summaryNote
                          : `Featured brand film: **${firstAction.video.title}** (${firstAction.video.displayDuration}).`;
                  res.write(`data: ${JSON.stringify({ delta: fallbackSummary })}\n\n`);
                }
              }
            }

            if (emittedAny) {
              break;
            }
          } catch (attemptErr) {
            lastErr = attemptErr;
            const errText = attemptErr instanceof Error ? attemptErr.message : String(attemptErr);
            console.error(`Studio chat attempt (${candidate.model}) error:`, errText);
            const isAuthError = /PERMISSION_DENIED|API_KEY_INVALID|403/i.test(errText);
            if (isAuthError || emittedAny || clientClosed) {
              throw attemptErr;
            }
          }
        }
      } finally {
        clearInterval(keepaliveTimer);
      }

      if (clientClosed) {
        res.end();
        return;
      }

      if (!emittedAny) {
        if (lastErr) {
          throw lastErr;
        }
        res.write(
          `data: ${JSON.stringify({ error: 'No response was returned from the assistant. Please try again.' })}\n\n`
        );
      } else {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      }
      res.end();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Studio chat error:', message);
      if (clientClosed) {
        res.end();
        return;
      }
      const isAuth = /PERMISSION_DENIED|API_KEY_INVALID|403/i.test(message);
      const isQuota = /RESOURCE_EXHAUSTED|429/i.test(message);
      const friendlyError = isAuth
        ? 'Gemini API key is invalid or unauthorized. Please verify GEMINI_API_KEY in Settings > Secrets.'
        : isQuota
          ? 'Studio assistant rate limit reached briefly. Please wait a moment or email hindarapro@gmail.com.'
          : `Studio assistant encountered an upstream error (${message.slice(0, 120)}). Please try again or email hindarapro@gmail.com.`;
      res.write(`data: ${JSON.stringify({ error: friendlyError })}\n\n`);
      res.end();
    }
  });

  app.post('/api/chat/tts', async (req, res) => {
    const body = req.body as { text?: string };
    const spokenText =
      typeof body?.text === 'string' ? sanitizeSpeechText(body.text, 650) : '';

    if (spokenText.length < 2) {
      res.status(400).json({ ok: false, error: 'Please provide text for voice synthesis.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(503).json({
        ok: false,
        error: 'Voice playback requires GEMINI_API_KEY in Settings > Secrets.',
      });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
          timeout: 18000,
        },
      });

      const ttsResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [{ text: spokenText }],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Charon' },
            },
          },
          abortSignal: AbortSignal.timeout(15000),
        },
      });

      const audioPart = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      const audioBase64 = audioPart?.data;
      if (!audioBase64) {
        res.status(502).json({
          ok: false,
          error: 'Voice audio was not returned for this reply. Please try again.',
        });
        return;
      }

      res.json({
        ok: true,
        audioBase64,
        mimeType: audioPart.mimeType || 'audio/wav',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Studio TTS error:', message);
      const isQuota = /RESOURCE_EXHAUSTED|429/i.test(message);
      res.status(isQuota ? 429 : 500).json({
        ok: false,
        error: isQuota
          ? 'Voice synthesis rate limit reached briefly. Please try again shortly.'
          : 'Unable to synthesize voice audio right now.',
      });
    }
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hindara Labs server running at http://localhost:${PORT}`);
  });
}

createServer();
