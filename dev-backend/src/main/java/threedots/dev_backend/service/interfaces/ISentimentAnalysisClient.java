package threedots.dev_backend.service.interfaces;

import threedots.dev_backend.dto.SentimentAnalysisResult;

public interface ISentimentAnalysisClient {
    SentimentAnalysisResult analyzeSentiment(String text);
}
