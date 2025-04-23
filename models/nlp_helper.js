const nlp = require("compromise");

const analyzeQuery = (query) => {
  const doc = nlp(query.toLowerCase());

  return {
    keywords: doc.nouns().out("array"), // Extracts important words
    numbers: doc.numbers().out("array"), // Extracts numerical values
    dateTerms: doc.dates().out("array"), // Extracts time-related phrases
    verbs: doc.verbs().out("array"), // Extracts action words
  };
};

module.exports = { analyzeQuery };
