package threedots.dev_backend.service;

import com.mongodb.DuplicateKeyException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import threedots.dev_backend.dto.Article;
import threedots.dev_backend.dto.SentimentAnalysisResult;
import threedots.dev_backend.dto.TopHeadlinesRequest;
import threedots.dev_backend.model.ArticleEntity;
import threedots.dev_backend.repository.ArticleRepository;
import threedots.dev_backend.service.interfaces.INewsApiClient;
import threedots.dev_backend.service.interfaces.INewsStorageService;
import threedots.dev_backend.service.interfaces.ISentimentAnalysisClient;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class NewsStorageService implements INewsStorageService {

    private final INewsApiClient newsApiClient;
    private final ISentimentAnalysisClient sentimentAnalysisClient;
    private final ArticleRepository articleRepository;

    @Autowired
    public NewsStorageService(NewsApiClient newsApiClient, SentimentAnalysisClient sentimentAnalysisClient, ArticleRepository articleRepository) {
        this.newsApiClient = newsApiClient;
        this.sentimentAnalysisClient = sentimentAnalysisClient;
        this.articleRepository = articleRepository;
    }

    public void fetchProcessAndStoreNews(TopHeadlinesRequest request) {
        List<String> existingUrls = articleRepository.findAllUrls().stream()
                .map(entry -> entry.replaceAll("^.*\"urlKey\":\\s*\"(.*?)\".*$", "$1"))  // Regex to extract the URL
                .toList();
        Set<String> existingUrlSet = new HashSet<>(existingUrls);

        List<Article> articles = newsApiClient.getTopHeadlines(request).getArticles();
        articles.forEach(article -> {
            try {
                if (existingUrlSet.contains(article.getUrl())) {
                    return;
                }
                String content = article.getDescription() != null
                        ? article.getTitle() + " " + article.getDescription()
                        : article.getTitle();

                SentimentAnalysisResult sentimentResult = sentimentAnalysisClient.analyzeSentiment(content);

                ArticleEntity dbArticle = new ArticleEntity();
                dbArticle.setSource(article.getSource());
                dbArticle.setAuthor(article.getAuthor());
                dbArticle.setTitle(article.getTitle());
                dbArticle.setDescription(article.getDescription());
                dbArticle.setUrlKey(article.getUrl());
                dbArticle.setUrl(article.getUrl());
                dbArticle.setUrlToImage(article.getUrlToImage());
                dbArticle.setPublishedAt(article.getPublishedAt());
                dbArticle.setSentiment(sentimentResult.getType());
                dbArticle.setFetchedAt(LocalDateTime.now());

                dbArticle.setCategory(request.getCategory());

                articleRepository.save(dbArticle);
            } catch (DuplicateKeyException ex) {
                System.out.println("Duplicate article found, skipping: " + article.getUrl());
            } catch (Exception e) {
                if (e.getCause() instanceof DuplicateKeyException) {
                    System.out.println("Duplicate article found, skipping: " + article.getUrl());
                } else {
                    System.out.println("General error: " + e.getMessage());
                }
            }}
        );
    }
}
