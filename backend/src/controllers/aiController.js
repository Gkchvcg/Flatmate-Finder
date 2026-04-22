import { HfInference } from '@huggingface/inference';
import User from '../models/User.js';
import Property from '../models/Property.js';

// Initialize HuggingFace client (will use process.env.HF_TOKEN automatically if set, or we pass it)
const hf = new HfInference(process.env.HF_TOKEN);
const MODEL = 'meta-llama/Llama-3.3-70B-Instruct'; // State-of-the-art logic and creativity

// @desc Generate a compelling property description
// @route POST /api/ai/property-description
export const generatePropertyDescription = async (req, res, next) => {
  try {
    const { title, city, type, amenities, rent } = req.body;

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({ message: 'HF_TOKEN is missing in the backend environment variables.' });
    }

    const prompt = `Act as an expert real estate copywriter. Write a compelling, warm, and professional property description for a listing with these details:
Title: ${title || 'N/A'}
City: ${city || 'N/A'}
Type: ${type || 'N/A'}
Rent: ${rent || 'N/A'}
Amenities: ${amenities || 'N/A'}

Keep it under 150 words and do not include placeholders. End with a welcoming call to action.`;

    const response = await hf.chatCompletion({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300
    });

    let text = response.choices[0]?.message?.content || "";
    res.json({ description: text.trim() });
  } catch (error) {
    console.error("AI Error:", error);
    next(new Error('Failed to generate description. ' + (error.message || '')));
  }
};

// @desc Generate icebreaker questions for a chat
// @route GET /api/ai/icebreakers/:pairId
export const getChatIcebreakers = async (req, res, next) => {
  try {
    const { user1Id, user2Id } = req.query;

    if (!user1Id || !user2Id) {
      return res.status(400).json({ message: 'Missing user IDs for icebreakers' });
    }

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({ message: 'HF_TOKEN is missing.' });
    }

    const user1 = await User.findById(user1Id).select('name interests hobbies occupation');
    const user2 = await User.findById(user2Id).select('name interests hobbies occupation');

    if (!user1 || !user2) {
      return res.status(404).json({ message: 'Users not found' });
    }

    const prompt = `Act as a friendly mediator for two potential flatmates. 
User 1 (${user1.name}): Interests=${user1.interests?.join(',')}, Hobbies=${user1.hobbies?.join(',')}, Occupation=${user1.occupation}
User 2 (${user2.name}): Interests=${user2.interests?.join(',')}, Hobbies=${user2.hobbies?.join(',')}, Occupation=${user2.occupation}

Generate exactly 3 fun, short, easy-going icebreaker questions they can use to start a conversation. Base it on their shared or differing interests/hobbies/occupations. 
Rules:
1. Output ONLY the 3 questions.
2. Separate them with a | character. 
3. No numbering, no introduction text.
Example: Question 1? | Question 2? | Question 3?`;

    const response = await hf.chatCompletion({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200
    });

    let text = response.choices[0]?.message?.content || "";
    // Clean up typical model chatter if any exists
    text = text.replace(/Here are.*:/i, '').trim();
    
    // Fallback if not separated fully
    let icebreakers = text.split('|').map(s => s.trim()).filter(Boolean);
    if (icebreakers.length < 2) {
        // Fallback split string by newlines if the model ignored the | instruction
        icebreakers = text.split('\n').map(s => s.replace(/^\d+\.\s*/, '').replace(/^- \s*/, '').trim()).filter(Boolean).slice(0, 3);
    }
    
    if(icebreakers.length === 0) {
        icebreakers = ["What's your favorite thing to do on weekends?", "Do you cook often?", "Are you more of a night owl or early bird?"];
    }

    res.json({ icebreakers });
  } catch (error) {
    next(new Error('Failed to generate icebreakers. ' + (error.message || '')));
  }
};

export const getCompatibilityScore = async (req, res, next) => {
  try {
    const { user1Id, user2Id } = req.query;

    if (!user1Id || !user2Id) {
      return res.status(400).json({ message: 'Missing user IDs' });
    }

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({ message: 'HF_TOKEN is missing.' });
    }

    const user1 = await User.findById(user1Id);
    const user2 = await User.findById(user2Id);

    if (!user1 || !user2) return res.status(404).json({ message: 'Users not found' });

    const prompt = `Analyze the compatibility of these two potential flatmates.
User 1: Gender=${user1.gender}, Sleep=${user1.sleepSchedule}, Cleanliness=${user1.cleanlinessLevel}, Smoking=${user1.smokingHabit}, Drinking=${user1.drinkingHabit}, Occupation=${user1.occupation}, Hobbies=${user1.hobbies?.join(',')}
User 2: Gender=${user2.gender}, Sleep=${user2.sleepSchedule}, Cleanliness=${user2.cleanlinessLevel}, Smoking=${user2.smokingHabit}, Drinking=${user2.drinkingHabit}, Occupation=${user2.occupation}, Hobbies=${user2.hobbies?.join(',')}

Return a JSON object with this exact schema:
{"score": 85, "reason": "Short explanation here..."}

CRITICAL: Output ONLY the raw JSON object. Do not wrap in markdown. No conversational text.`;

    const response = await hf.chatCompletion({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150
    });

    let text = response.choices[0]?.message?.content || "";
    
    try {
        // Extract JSON using regex in case the model wraps it in markdown ```json ... ```
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const json = JSON.parse(jsonMatch[0]);
            res.json(json);
        } else {
            throw new Error('No JSON found');
        }
    } catch(e) {
        console.error("Failed to parse JSON from AI: ", text);
        res.status(500).json({ score: 70, reason: "Error parsing AI response, but you seem okay!" });
    }
  } catch (error) {
    next(new Error('Failed to compute compatibility. ' + (error.message || '')));
  }
};

// @desc Generate a creative user bio
// @route POST /api/ai/user-bio
export const generateUserBio = async (req, res, next) => {
  try {
    const { interests, hobbies, occupation, name } = req.body;

    if (!process.env.HF_TOKEN) return res.status(500).json({ message: 'HF_TOKEN is missing.' });

    const prompt = `Create a short, engaging, and personality-filled bio (under 60 words) for a flatmate finder profile.
Name: ${name || 'A user'}
Occupation: ${occupation || 'N/A'}
Interests: ${Array.isArray(interests) ? interests.join(', ') : 'N/A'}
Hobbies: ${Array.isArray(hobbies) ? hobbies.join(', ') : 'N/A'}

The bio should sound human, friendly, and give a sense of what it's like to live with them. 
Output ONLY the bio text.`;

    const response = await hf.chatCompletion({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150
    });

    res.json({ bio: response.choices[0]?.message?.content?.trim() });
  } catch (error) {
    next(new Error('Failed to generate bio. ' + (error.message || '')));
  }
};

// @desc Suggest improvements for a property listing
// @route POST /api/ai/listing-review
export const suggestListingImprovements = async (req, res, next) => {
  try {
    const { title, description, amenities } = req.body;

    const prompt = `Critique this flatmate listing and provide 3 specific, actionable suggestions to make it more attractive to potential flatmates.
Title: ${title}
Description: ${description}
Amenities: ${amenities}

Return exactly 3 bullet points. Be honest but helpful.
Output ONLY the bullet points.`;

    const response = await hf.chatCompletion({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200
    });

    res.json({ suggestions: response.choices[0]?.message?.content?.trim() });
  } catch (error) {
    next(new Error('Failed to review listing. ' + (error.message || '')));
  }
};

export default { generatePropertyDescription, getChatIcebreakers, getCompatibilityScore, generateUserBio, suggestListingImprovements };
