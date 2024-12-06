package threedots.dev_backend.service.interfaces;

import threedots.dev_backend.dto.ArticlesResult;
import threedots.dev_backend.dto.EverythingRequest;
import threedots.dev_backend.dto.TopHeadlinesRequest;

import java.util.concurrent.CompletableFuture;

public interface INewsApiClient {
    ArticlesResult getTopHeadlines(TopHeadlinesRequest request);
    CompletableFuture<ArticlesResult> getTopHeadlinesAsync(TopHeadlinesRequest request);
    ArticlesResult getEverything(EverythingRequest request);
    CompletableFuture<ArticlesResult> getEverythingAsync(EverythingRequest request);
}
