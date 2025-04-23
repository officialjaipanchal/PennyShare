class FinancialPipeline {
    constructor(prompter, openai) {
      this.prompter = prompter;
      this.model = openai;
    }
  
    async analyze(query, context) {
      const prompt = this.prompter.render({ ...context, query });
      const response = await this.model.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful financial assistant." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      });
  
      return response.choices[0]?.message?.content.trim();
    }
  }
  
  module.exports = FinancialPipeline;
  