
import { GoogleGenAI, Type } from "@google/genai";
import { Profile, CareerPlan, SkillGap, RoadmapTask, MultiSourceData, QuizQuestion, Under18Result } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Agent: Quiz Generator
 * Generates 10 personality and interest questions for students under 18.
 */
export const generateCareerQuiz = async (age: number): Promise<QuizQuestion[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a 10-question career interest quiz for a ${age}-year-old student. 
    The questions should be engaging and diverse, covering interests in:
    1. Problem solving & Logic
    2. Creativity & Design
    3. Helping others & Social Impact
    4. Building & Engineering
    5. Leadership & Strategy
    6. Nature & Environment
    7. Writing & Communication
    8. Science & Discovery
    
    Each question should have 4 distinct options that map to different traits.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["question", "options"]
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
};

/**
 * Agent: Junior Career Predictor
 * Evaluates quiz answers and suggests future paths.
 */
export const evaluateQuizResults = async (age: number, quizData: { question: string, answer: string }[]): Promise<Under18Result> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze these quiz results for a ${age}-year-old. 
    Suggest 3 exciting career paths they could pursue when they grow up. 
    Explain why each fits them and what they can do NOW to prepare.
    
    QUIZ DATA: ${JSON.stringify(quizData)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedPaths: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                why: { type: Type.STRING },
                skillsToStartNow: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "description", "why", "skillsToStartNow"]
            }
          },
          generalAdvice: { type: Type.STRING }
        },
        required: ["recommendedPaths", "generalAdvice"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

/**
 * Agent 1: The Profile Analyzer
 */
export const analyzeProfile = async (sources: MultiSourceData): Promise<Profile> => {
  const compositeText = `
    SOURCE: LINKEDIN
    ${sources.linkedinText || "N/A"}
    
    SOURCE: GITHUB
    ${sources.githubInfo || "N/A"}
    
    SOURCE: RESUME
    ${sources.resumeText || "N/A"}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following composite professional data. Deduplicate and consolidate into a unified profile.
    
    DATA:
    ${compositeText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          currentTitle: { type: Type.STRING },
          experience: { type: Type.ARRAY, items: { type: Type.STRING } },
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                level: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Expert"] },
                category: { type: Type.STRING, enum: ["Technical", "Soft", "Domain"] }
              },
              required: ["name", "level", "category"]
            }
          },
          education: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["name", "currentTitle", "experience", "skills", "education"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

/**
 * Agent 2: The Career Architect
 */
export const architectCareerPlan = async (profile: Profile, dreamRole: string): Promise<CareerPlan> => {
  const marketSearch = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Identify 2025 requirements for '${dreamRole}', predict its 10-year evolution, and find high-quality learning resources (YouTube, Coursera, Udemy), specialized mock test platforms (LeetCode, TestGorilla, certifications), and mock interview services (Pramp, Interviewing.io).`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  const marketText = marketSearch.text || "";

  const finalPlan = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `USER PROFILE: ${JSON.stringify(profile)}
    DREAM ROLE: ${dreamRole}
    MARKET RESEARCH: ${marketText}
    
    Generate current gaps, a 30-day modular roadmap, and a 10-year future outlook.
    
    IMPORTANT: While the roadmap should be structured for a 30-day sprint by default, ensure each task is a self-contained module so the user can learn at their own pace if they prefer a non-linear or extended approach. 
    Each roadmap task MUST include specific, working links for learning, mock tests, and mock interviews if applicable.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dreamRole: { type: Type.STRING },
          marketAnalysis: { type: Type.STRING },
          gaps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                importance: { type: Type.NUMBER },
                gapDescription: { type: Type.STRING },
                marketDemand: { type: Type.STRING }
              },
              required: ["skill", "importance", "gapDescription", "marketDemand"]
            }
          },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                learningSources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      url: { type: Type.STRING },
                      description: { type: Type.STRING }
                    }
                  }
                },
                mockTests: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      url: { type: Type.STRING }
                    }
                  }
                },
                mockInterviews: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      url: { type: Type.STRING }
                    }
                  }
                },
                checkpoint: { type: Type.STRING }
              },
              required: ["day", "title", "description", "checkpoint"]
            }
          },
          futureOutlook: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              technologicalShifts: { type: Type.ARRAY, items: { type: Type.STRING } },
              emergingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              riskFactor: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              longevityScore: { type: Type.NUMBER }
            },
            required: ["summary", "technologicalShifts", "emergingSkills", "riskFactor", "longevityScore"]
          }
        },
        required: ["dreamRole", "marketAnalysis", "gaps", "roadmap", "futureOutlook"]
      }
    }
  });

  return JSON.parse(finalPlan.text || "{}");
};
