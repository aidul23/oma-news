package threedots.dev_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import threedots.dev_backend.constants.Categories;
import threedots.dev_backend.model.ArticleEntity;

import java.util.List;

public interface ArticleRepository extends MongoRepository<ArticleEntity, String> {
    @Query(value = "{}", fields = "{urlKey: 1, _id: 0}")
    List<String> findAllUrls();
    List<ArticleEntity> findByCategory(Categories category);

}
