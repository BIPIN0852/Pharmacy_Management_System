const { GoogleGenerativeAI } = require("@google/generative-ai");
const Message = require("../models/Message");

// Helper function to safely load the API key
const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "CRITICAL: GEMINI_API_KEY is missing from your backend .env file!",
    );
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

// ---------------------------------------------------------
// 1. GENERATE SMART REPLIES
// ---------------------------------------------------------
const generateSmartReplies = async (req, res) => {
  try {
    const genAI = getGenAI();
    const { appointmentId } = req.params;

    const messages = await Message.find({ appointment: appointmentId })
      .sort({ createdAt: -1 })
      .limit(6);

    if (messages.length === 0) {
      return res.json({
        replies: [
          "Hello! How can I help?",
          "Please share your symptoms.",
          "I am reviewing your file.",
        ],
      });
    }

    const chatHistory = messages
      .reverse()
      .map((m) => {
        const role = m.senderModel === "Doctor" ? "Doctor" : "Patient";
        return `${role}: ${m.text}`;
      })
      .join("\n");

    // Upgraded to Google's active model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an AI assistant helping a Doctor reply to a patient. Read this recent chat:
      ${chatHistory}
      Based on the Patient's latest message, generate 3 short quick-reply options for the Doctor.
      Output ONLY a valid JSON array of strings. Do not add ANY other text, markdown, or explanation.
      Example exactly like this: ["Option 1", "Option 2", "Option 3"]
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    responseText = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      const replies = JSON.parse(responseText);
      res.json({ replies });
    } catch (parseError) {
      console.error("Parse Error:", responseText);
      res.json({
        replies: [
          "Please tell me more.",
          "I understand.",
          "Let's schedule a visit.",
        ],
      });
    }
  } catch (error) {
    console.error("❌ AI Smart Reply Error:", error.message);
    res
      .status(500)
      .json({ message: error.message || "Failed to generate AI replies" });
  }
};

// ---------------------------------------------------------
// 2. SUMMARIZE CHAT
// ---------------------------------------------------------
const summarizeChat = async (req, res) => {
  try {
    const genAI = getGenAI();
    const { appointmentId } = req.params;

    const messages = await Message.find({ appointment: appointmentId }).sort({
      createdAt: 1,
    });

    if (messages.length < 2) {
      return res.json({
        summary:
          "Not enough chat history to generate a clinical summary yet. Please exchange a few messages first.",
      });
    }

    const chatHistory = messages
      .map((m) => {
        const role = m.senderModel === "Doctor" ? "Doctor" : "Patient";
        return `${role}: ${m.text}`;
      })
      .join("\n");

    //  Upgraded to Google's active model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a clinical AI assistant. Summarize the following medical chat history between a Doctor and a Patient.
      Provide a highly concise, 2-sentence clinical summary of the patient's concerns and the doctor's advice.
      
      Chat History:
      ${chatHistory}
    `;

    const result = await model.generateContent(prompt);
    res.json({ summary: result.response.text().trim() });
  } catch (error) {
    console.error("❌ AI Summary Error:", error.message);
    res
      .status(500)
      .json({ message: error.message || "Failed to summarize chat" });
  }
};

// ---------------------------------------------------------
// 3. GENERATE MEDICINE INSIGHTS (PHARMACIST AI)
// ---------------------------------------------------------
const generateMedicineSummary = async (req, res) => {
  try {
    const { name, category, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Medicine name is required" });
    }

    const genAI = getGenAI();
    // Using the same fast and capable model for text generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a helpful, expert AI pharmacist. Provide a brief, easy-to-understand summary for a patient about the medicine "${name}". 
    Additional context: Category is ${category}, Manufacturer description is: ${description}.
    
    Please structure your response with these exact bold headings:
    **Common Uses:** (What is it typically used for?)
    **Standard Advice:** (General tips on how it is taken)
    **Potential Side Effects:** (Common side effects to watch out for)

    Keep the language highly accessible to a regular patient, reassuring, and concise. Do not prescribe medication, just provide educational information.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    res.json({ summary: text });
  } catch (error) {
    console.error("❌ AI Medicine Summary Error:", error.message);
    res
      .status(500)
      .json({ message: error.message || "Failed to generate AI summary." });
  }
};

module.exports = {
  generateSmartReplies,
  summarizeChat,
  generateMedicineSummary,
};
