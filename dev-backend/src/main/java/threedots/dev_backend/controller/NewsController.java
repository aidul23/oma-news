package threedots.dev_backend.controller;

import threedots.dev_backend.constants.Categories;
import threedots.dev_backend.constants.Countries;
import threedots.dev_backend.constants.Languages;
import threedots.dev_backend.constants.SortBys;
import threedots.dev_backend.dto.ArticlesResult;
import threedots.dev_backend.dto.TopHeadlinesRequest;
import threedots.dev_backend.dto.EverythingRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import threedots.dev_backend.service.interfaces.INewsApiClient;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/news")
public class NewsController {

    private final INewsApiClient newsApiClient;

    @Autowired
    public NewsController(INewsApiClient newsApiClient) {
        this.newsApiClient = newsApiClient;
    }

    /**
     * Fetch top headlines using the NewsApiClient service.
     * Example usage: GET /news/top-headlines?q=bitcoin&category=business
     */
    @GetMapping("/top-headlines")
    public ArticlesResult getTopHeadlines(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String sources,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String country,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize
    ) {
        TopHeadlinesRequest request = new TopHeadlinesRequest();
        request.setQ(q);
        request.setSources(sources != null ? List.of(sources.split(",")) : List.of());
        request.setCategory(category != null ? Categories.valueOf(category.toUpperCase()) : null);
        request.setLanguage(language != null ? Languages.valueOf(language.toUpperCase()) : null);
        request.setCountry(country != null ? Countries.valueOf(country.toUpperCase()) : null);
        request.setPage(page);
        request.setPageSize(pageSize);
        return newsApiClient.getTopHeadlines(request);
    }

    /**
     * Fetch everything using the NewsApiClient service.
     * Example usage: GET /news/everything?q=bitcoin&language=en
     */
    @GetMapping("/everything")
    public ArticlesResult getEverything(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String sources,
            @RequestParam(required = false) String domains,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) String language,
            @RequestParam(defaultValue = "relevancy") String sortBy,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize
    ) {
        EverythingRequest request = new EverythingRequest();
        request.setQ(q);
        request.setSources(sources != null ? List.of(sources.split(",")) : List.of());
        request.setDomains(domains != null ? List.of(domains.split(",")) : List.of());
        request.setFrom(from != null ? LocalDateTime.parse(from) : null);
        request.setTo(to != null ? LocalDateTime.parse(to) : null);
        request.setLanguage(language != null ? Languages.valueOf(language.toUpperCase()) : null);
        request.setSortBy(SortBys.valueOf(sortBy.toUpperCase()));
        request.setPage(page);
        request.setPageSize(pageSize);
        return newsApiClient.getEverything(request);
    }
}

