package threedots.dev_backend.dto;

import lombok.Data;
import threedots.dev_backend.constants.Statuses;

import java.util.List;

@Data
public class ArticlesResult {
    private Statuses status;
    private Error error;
    private int totalResults;
    private List<Article> articles;
}
