package threedots.dev_backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import threedots.dev_backend.constants.Categories;
import threedots.dev_backend.dto.Article;

import java.time.LocalDateTime;

@Setter
@Getter
@Document(collection = "articles")  // MongoDB collection name
public class ArticleEntity extends Article {

    @Id
    private String id;

    @Field("urlKey")
    @Indexed(unique = true)
    private String urlKey;

    private String sentiment;
    private LocalDateTime fetchedAt;

    private Categories category;
}
