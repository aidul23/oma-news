package threedots.dev_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Article {
    private Source source;
    private String author;
    private String title;
    private String description;
    private String url;
    private String urlToImage;
    private LocalDateTime publishedAt;
}
