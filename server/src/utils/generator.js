export async function generateAnswer(question, context) {
  try {
    // First, try to create a simple context-based answer
    const contextBasedAnswer = createContextBasedAnswer(question, context);

    // Try Hugging Face API as enhancement
    try {
      const prompt = `You are DermX-AI, a dermatology assistant. Answer the question based ONLY on the provided context. If the context does not contain relevant information, say so.

Context: ${context}

Question: ${question}

Answer:`;

      const data = {
        model: "Qwen/Qwen3-4B-Thinking-2507", // smaller stable HF model
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_new_tokens: 250,
      };
      const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("HF raw response:", JSON.stringify(result, null, 2));
        
        if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
          const fullResponse = result.choices[0].message.content.trim();
          
          // Parse thinking process and answer
          const parsed = parseThinkingResponse(fullResponse);
          return JSON.stringify(parsed); // Return structured response
        }
      }
    } catch (apiError) {
      console.log("HF API not available, using context-based answer");
    }

    // Return context-based answer as fallback
    return contextBasedAnswer;
  } catch (err) {
    console.error("Error generating answer:", err.message);

    // Final fallback
    return createSimpleFallback(question, context);
  }
}

function createContextBasedAnswer(question, context) {
  // Simple keyword-based answer generation
  const questionLower = question.toLowerCase();
  const contextLower = context.toLowerCase();

  // Extract key sentences that might be relevant
  const sentences = context.split(/[.!?]+/).filter((s) => s.trim().length > 20);
  const relevantSentences = [];

  // Look for sentences containing question keywords
  const questionWords = questionLower
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 3 &&
        ![
          "what",
          "how",
          "when",
          "where",
          "why",
          "which",
          "give",
          "tell",
          "show",
        ].includes(word)
    );

  sentences.forEach((sentence) => {
    const sentenceLower = sentence.toLowerCase();
    const matchCount = questionWords.filter((word) =>
      sentenceLower.includes(word)
    ).length;
    if (matchCount > 0) {
      relevantSentences.push({
        sentence: sentence.trim(),
        matches: matchCount,
      });
    }
  });

  // Sort by relevance and take top sentences
  relevantSentences.sort((a, b) => b.matches - a.matches);
  const topSentences = relevantSentences
    .slice(0, 3)
    .map((item) => item.sentence);

  if (topSentences.length > 0) {
    let answer = "Based on your uploaded documents:\n\n";
    topSentences.forEach((sentence, index) => {
      answer += `${index + 1}. ${sentence}.\n`;
    });
    return JSON.stringify({
      thinking: null,
      answer: answer,
      hasThinking: false
    });
  }

  // If no specific matches, provide a general summary
  const firstFewSentences = sentences.slice(0, 2).join(". ");
  return JSON.stringify({
    thinking: null,
    answer: `Based on your uploaded documents, here's what I found relevant to your question:\n\n${firstFewSentences}.`,
    hasThinking: false
  });
}

function createSimpleFallback(question, context) {
  return JSON.stringify({
    thinking: null,
    answer: `I found relevant information in your documents related to "${question}". Here's a summary of the key points from the context:\n\n${context.substring(0, 300)}...\n\nFor more detailed information, please refer to the specific sections of your uploaded documents.`,
    hasThinking: false
  });
}

function parseThinkingResponse(response) {
  console.log("Original response length:", response.length);
  console.log("Original response preview:", response.substring(0, 200) + "...");
  
  // First, try to find the end of the think tag and extract everything after it
  const thinkEndMatch = response.match(/<\/think>\s*([\s\S]*)/i);
  
  if (thinkEndMatch && thinkEndMatch[1]) {
    const afterThinkTag = thinkEndMatch[1].trim();
    console.log("Found content after </think> tag:", afterThinkTag.substring(0, 200) + "...");
    
    return {
      thinking: null,
      answer: afterThinkTag || "I've analyzed the context but couldn't generate a clear answer.",
      hasThinking: false
    };
  }
  
  // If no think tags found, try aggressive cleaning
  let cleanResponse = response;
  
  // Remove everything from <think> to </think> (greedy match for the entire block)
  cleanResponse = cleanResponse.replace(/<think>[\s\S]*<\/think>/gi, '');
  
  // Additional cleaning patterns
  cleanResponse = cleanResponse
    .replace(/\<think\>[\s\S]*\<\/think\>/gi, '') // Escaped brackets
    .replace(/&lt;think&gt;[\s\S]*&lt;\/think&gt;/gi, '') // HTML encoded
    .replace(/^.*<think>.*$/gim, '') // Remove any line containing <think>
    .replace(/^.*<\/think>.*$/gim, '') // Remove any line containing </think>
    .replace(/^\s*$/gm, '') // Remove empty lines
    .trim();
  
  // If still contains thinking-like content, try to find the actual answer
  const lines = cleanResponse.split('\n').filter(line => line.trim().length > 0);
  
  // Look for lines that seem like actual answers (not thinking)
  let answerLines = [];
  let foundAnswer = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim().toLowerCase();
    
    // Skip obvious thinking lines
    if (trimmedLine.includes('let me analyze') || 
        trimmedLine.includes('i need to') ||
        trimmedLine.includes('step by step') ||
        trimmedLine.includes('looking at') ||
        trimmedLine.startsWith('i ') ||
        trimmedLine.includes('think') ||
        trimmedLine.length < 10) {
      continue;
    }
    
    // Look for answer-like content
    if (trimmedLine.includes('based on') && trimmedLine.includes('document') ||
        trimmedLine.includes('the report') ||
        trimmedLine.includes('the context') ||
        trimmedLine.includes('medical') ||
        trimmedLine.length > 50) {
      foundAnswer = true;
      answerLines.push(line);
    } else if (foundAnswer) {
      answerLines.push(line);
    }
  }
  
  const finalAnswer = answerLines.length > 0 ? answerLines.join('\n').trim() : cleanResponse;
  
  console.log("Final cleaned response:", finalAnswer.substring(0, 200) + "...");
  
  return {
    thinking: null,
    answer: finalAnswer || "I've analyzed the context but couldn't generate a clear answer.",
    hasThinking: false
  };
}
