package threedots.dev_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import threedots.dev_backend.constants.Categories;
import threedots.dev_backend.model.ArticleEntity;
import threedots.dev_backend.repository.ArticleRepository;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleRepository articleRepository;

    @Autowired
    public ArticleController(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @GetMapping("/articles-with-sentiment")
    public List<ArticleEntity> getArticlesWithSentiment() {
        return articleRepository.findAll((Sort.by(Sort.Direction.DESC, "publishedAt")));
    }

    // Endpoint: /api/articles/category/{category}
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ArticleEntity>> getArticlesByCategory(@PathVariable("category") String categoryName) {
        Categories category;
        try {
            category = Categories.valueOf(categoryName.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }

        // Fetch articles by category and sorted by publishedAt
        List<ArticleEntity> articles = articleRepository.findByCategory(category);
        return ResponseEntity.ok(articles);
    }
}
