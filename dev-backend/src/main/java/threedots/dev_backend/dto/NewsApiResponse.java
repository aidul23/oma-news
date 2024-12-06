package threedots.dev_backend.dto;

import lombok.Data;
import threedots.dev_backend.constants.ErrorCodes;
import threedots.dev_backend.constants.Statuses;

import java.util.List;

@Data
public class NewsApiResponse {
    private Statuses status;
    private ErrorCodes code;
    private String message;
    private List<Article> articles;
    private int totalResults;
}
