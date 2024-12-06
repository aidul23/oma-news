package threedots.dev_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import threedots.dev_backend.constants.Categories;
import threedots.dev_backend.dto.TrendData;
import threedots.dev_backend.model.ArticleEntity;
import threedots.dev_backend.repository.ArticleRepository;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import threedots.dev_backend.service.interfaces.ITrendsService;

@Service
public class TrendsService implements ITrendsService {
    private final ArticleRepository articleRepository;

    @Autowired
    public TrendsService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<TrendData> getDailyTrends(Categories category) {

        List<ArticleEntity> articles;
        if (category == null) {
            articles = articleRepository.findAll();
        }
        else {
            articles = articleRepository.findByCategory(category);
        }

        return getDailyTrends(articles);
    }

    private List<TrendData> getDailyTrends(List<ArticleEntity> articles) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        Map<String, Map<String, Long>> dailyTrends = articles.stream()
                .collect(Collectors.groupingBy(
                        article -> article.getPublishedAt().format(formatter),
                        Collectors.groupingBy(
                                ArticleEntity::getSentiment,
                                Collectors.counting()
                        )
                ));

        return dailyTrends.entrySet().stream()
                .map(entry -> new TrendData(
                        entry.getKey(),
                        entry.getValue().getOrDefault("positive", 0L).intValue(),
                        entry.getValue().getOrDefault("negative", 0L).intValue(),
                        entry.getValue().getOrDefault("neutral", 0L).intValue()
                ))
                .sorted(Comparator.comparing(TrendData::getDate).reversed())
                .collect(Collectors.toList());
    }
}
