package threedots.dev_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import threedots.dev_backend.dto.SentimentAnalysisResult;
import threedots.dev_backend.service.interfaces.ISentimentAnalysisClient;

@Service
public class SentimentAnalysisClient implements ISentimentAnalysisClient {

    private final RestTemplate restTemplate;
    private final String rapidApiKey;
    private final String rapidApiHost;

    @Autowired
    public SentimentAnalysisClient(@Value("${rapidapi.key}") String rapidApiKey,
                                   @Value("${rapidapi.host}") String rapidApiHost,
                                   RestTemplate restTemplate) {
        this.rapidApiKey = rapidApiKey;
        this.rapidApiHost = rapidApiHost;
        this.restTemplate = restTemplate;
    }

    public SentimentAnalysisResult analyzeSentiment(String text) {
        String url = "https://twinword-twinword-bundle-v1.p.rapidapi.com/sentiment_analyze/?text=" + text;

        HttpHeaders headers = new HttpHeaders();
        headers.add("x-rapidapi-key", rapidApiKey);
        headers.add("x-rapidapi-host", rapidApiHost);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // Send GET request to the API
            ResponseEntity<SentimentAnalysisResult> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    SentimentAnalysisResult.class
            );

            // Check for a successful response and ensure that the body is not null
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                SentimentAnalysisResult errorResult = new SentimentAnalysisResult();
                errorResult.setResult_code("ERROR");
                errorResult.setResult_msg("Unknown error occurred");
                return errorResult;
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Return an error object with details
            SentimentAnalysisResult errorResult = new SentimentAnalysisResult();
            errorResult.setResult_code("ERROR");
            errorResult.setResult_msg("An error occurred: " + e.getMessage());
            return errorResult;
        }
    }
}
