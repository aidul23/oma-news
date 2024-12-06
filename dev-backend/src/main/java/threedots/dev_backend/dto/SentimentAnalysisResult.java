package threedots.dev_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class SentimentAnalysisResult {
    private String author;
    private String email;
    private List<Keyword> keywords;
    private int ratio;
    private String result_code;
    private String result_msg;
    private double score;
    private String type;
    private String version;

    @Data
    public static class Keyword {
        private double score;
        private String word;
    }
}
