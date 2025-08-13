// ChatLogic.jsx
import axios from "axios";

// Replace with your Hugging Face API key
const HF_API_KEY = "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"; 

// Hugging Face model you want to use (SQuAD2 capable)
const MODEL_ID = "deepset/roberta-base-squad2";

/**
 * Sends a question + context to the Hugging Face model and returns the answer.
 * @param {string} question - The user's question.
 * @param {string} context - The knowledge base text (from AkshayData.txt).
 */
export async function getAnswer(question, context) {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${MODEL_ID}`,
      {
        inputs: {
          question,
          context,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.length > 0 && response.data[0].answer) {
      return response.data[0].answer.trim();
    }

    return "I couldn't find an answer in the provided knowledge base.";
  } catch (err) {
    console.error("Error fetching answer from Hugging Face:", err);
    return "There was an error getting the answer. Please try again later.";
  }
}
