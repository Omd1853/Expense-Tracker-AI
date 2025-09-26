import { GoogleGenerativeAI } from '@google/generative-ai';

interface RawInsight {
  type?: string;
  title?: string;
  message?: string;
  action?: string;
  confidence?: number;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ExpenseRecord {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  confidence: number;
}

// ✅ Use a Free Tier–supported model
const INSIGHT_MODEL = 'gemini-2.0-flash'; // or 'gemini-2.5-flash-lite'

export async function generateExpenseInsights(
  expenses: ExpenseRecord[]
): Promise<AIInsight[]> {
  try {
    const expensesSummary = expenses.map((e) => ({
      amount: e.amount,
      category: e.category,
      description: e.description,
      date: e.date,
    }));

    const prompt = `Analyze the following expense data and provide 3-4 actionable financial insights.
Return a JSON array of insights with this structure:
{
  "type": "warning|info|success|tip",
  "title": "Brief title",
  "message": "Detailed insight message with specific numbers when possible",
  "action": "Actionable suggestion",
  "confidence": 0.8
}

Expense Data:
${JSON.stringify(expensesSummary, null, 2)}

Focus on:
1. Spending patterns (day of week, categories)
2. Budget alerts (high spending areas)
3. Money-saving opportunities
4. Positive reinforcement for good habits

Return only valid JSON array, no additional text.`;

    // ✅ Changed model
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
const result = await model.generateContent(prompt);
const rawResponse = result.response.text().trim();

// Clean potential Markdown wrappers
const cleanedResponse = rawResponse
  .replace(/^```json\s*/i, '')
  .replace(/^```\s*/i, '')
  .replace(/\s*```$/, '');

const insights = JSON.parse(cleanedResponse);

    return insights.map((insight: RawInsight, i: number) => ({
      id: `ai-${Date.now()}-${i}`,
      type: insight.type || 'info',
      title: insight.title || 'AI Insight',
      message: insight.message || 'Analysis complete',
      action: insight.action,
      confidence: insight.confidence || 0.8,
    }));
  } catch (error) {
    console.error('❌ Error generating AI insights:', error);
    return [
      {
        id: 'fallback-1',
        type: 'info',
        title: 'AI Analysis Unavailable',
        message:
          'Unable to generate personalized insights at this time. Please try again later.',
        action: 'Refresh insights',
        confidence: 0.5,
      },
    ];
  }
}

export async function categorizeExpense(description: string): Promise<string> {
  try {
    // Already using a good model ✅
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const result = await model.generateContent(
      `Categorize this expense into one of these categories:
       Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Other.
       Respond with only the category name.
       Expense: "${description}"`
    );
    const category = result.response.text().trim();

    const validCategories = [
      'Food',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Bills',
      'Healthcare', 
      'Other',
    ];

    return validCategories.includes(category) ? category : 'Other';
  } catch (error) {
    console.error('❌ Error categorizing expense:', error);
    return 'Other';
  }
}

export async function generateAIAnswer(
  question: string,
  context: ExpenseRecord[]
): Promise<string> {
  try {
    const expensesSummary = context.map((e) => ({
      amount: e.amount,
      category: e.category,
      description: e.description,
      date: e.date,
    }));

    const prompt = `Based on the following expense data, provide a concise 2-3 sentence answer to this question: "${question}"
Expense Data:
${JSON.stringify(expensesSummary, null, 2)}

Answer directly, use numbers when possible, and give actionable advice.`;

    // ✅ Changed model
    const model = genAI.getGenerativeModel({ model: INSIGHT_MODEL });
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('❌ Error generating AI answer:', error);
    return "I'm unable to provide a detailed answer at the moment. Please try again.";
  }
}