package threedots.dev_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import threedots.dev_backend.constants.*;
import threedots.dev_backend.dto.*;
import threedots.dev_backend.dto.Error;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import threedots.dev_backend.service.interfaces.INewsApiClient;

@Service
public class NewsApiClient implements INewsApiClient {

    private static final String BASE_URL = "https://newsapi.org/v2/";

    private final RestTemplate restTemplate;
    private final String apiKey;

    @Autowired
    public NewsApiClient(@Value("${newsapi.apikey}") String apiKey, RestTemplate restTemplate) {
        this.apiKey = apiKey;
        this.restTemplate = restTemplate;
    }

    public ArticlesResult getTopHeadlines(TopHeadlinesRequest request) {
        return getTopHeadlinesAsync(request).join();
    }

    public CompletableFuture<ArticlesResult> getTopHeadlinesAsync(TopHeadlinesRequest request) {
        String querystring = buildTopHeadlinesQuery(request);
        return makeRequest("top-headlines", querystring);
    }

    public ArticlesResult getEverything(EverythingRequest request) {
        return getEverythingAsync(request).join();
    }

    public CompletableFuture<ArticlesResult> getEverythingAsync(EverythingRequest request) {
        String querystring = buildEverythingQuery(request);
        return makeRequest("everything", querystring);
    }

    private String buildTopHeadlinesQuery(TopHeadlinesRequest request) {
        List<String> queryParams = new ArrayList<>();

        if (request.getQ() != null && !request.getQ().isEmpty()) {
            queryParams.add("q=" + request.getQ());
        }

        if (!request.getSources().isEmpty()) {
            queryParams.add("sources=" + String.join(",", request.getSources()));
        }

        if (request.getCategory() != null) {
            queryParams.add("category=" + request.getCategory().name().toLowerCase());
        }

        if (request.getLanguage() != null) {
            queryParams.add("language=" + request.getLanguage().name().toLowerCase());
        }

        if (request.getCountry() != null) {
            queryParams.add("country=" + request.getCountry().name().toLowerCase());
        }

        queryParams.add("page=" + request.getPage());
        queryParams.add("pageSize=" + request.getPageSize());

        return String.join("&", queryParams);
    }

    private String buildEverythingQuery(EverythingRequest request) {
        List<String> queryParams = new ArrayList<>();

        if (request.getQ() != null && !request.getQ().isEmpty()) {
            queryParams.add("q=" + request.getQ());
        }

        if (!request.getSources().isEmpty()) {
            queryParams.add("sources=" + String.join(",", request.getSources()));
        }

        if (!request.getDomains().isEmpty()) {
            queryParams.add("domains=" + String.join(",", request.getDomains()));
        }

        if (request.getFrom() != null) {
            queryParams.add("from=" + request.getFrom().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        if (request.getTo() != null) {
            queryParams.add("to=" + request.getTo().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        if (request.getLanguage() != null) {
            queryParams.add("language=" + request.getLanguage().name().toLowerCase());
        }

        if (request.getSortBy() != null) {
            queryParams.add("sortBy=" + request.getSortBy().name().toLowerCase());
        }

        queryParams.add("page=" + request.getPage());
        queryParams.add("pageSize=" + request.getPageSize());

        return String.join("&", queryParams);
    }

    private CompletableFuture<ArticlesResult> makeRequest(String endpoint, String querystring) {
        return CompletableFuture.supplyAsync(() -> {
            String url = BASE_URL + endpoint + "?" + querystring + "&apiKey=" + apiKey;
            ResponseEntity<NewsApiResponse> response = restTemplate.getForEntity(url, NewsApiResponse.class);

            ArticlesResult articlesResult = new ArticlesResult();
            NewsApiResponse NewsApiResponse = response.getBody();
            if (NewsApiResponse != null && NewsApiResponse.getStatus() == Statuses.OK) {
                articlesResult.setStatus(NewsApiResponse.getStatus());
                articlesResult.setTotalResults(NewsApiResponse.getTotalResults());
                articlesResult.setArticles(NewsApiResponse.getArticles());
            } else {
                articlesResult.setStatus(Statuses.ERROR);
                articlesResult.setError(new Error(ErrorCodes.UNKNOWN_ERROR, "Unknown error occurred"));
            }

            return articlesResult;
        });
    }
}

