package threedots.dev_backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import threedots.dev_backend.constants.Categories;
import threedots.dev_backend.constants.Countries;
import threedots.dev_backend.constants.Languages;
import threedots.dev_backend.constants.SortBys;
import threedots.dev_backend.dto.ArticlesResult;
import threedots.dev_backend.dto.EverythingRequest;
import threedots.dev_backend.dto.TopHeadlinesRequest;
import threedots.dev_backend.service.interfaces.INewsApiClient;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class NewsControllerTest {

    @Mock
    private INewsApiClient newsApiClient;

    @InjectMocks
    private NewsController newsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetTopHeadlines() {
        TopHeadlinesRequest request = new TopHeadlinesRequest();
        request.setQ("RealMadrid");
        request.setCategory(Categories.BUSINESS);
        request.setLanguage(Languages.EN);
        request.setCountry(Countries.US);
        request.setPage(1);
        request.setPageSize(20);

        ArticlesResult mockResult = new ArticlesResult();
        mockResult.setArticles(Collections.emptyList());
        when(newsApiClient.getTopHeadlines(any(TopHeadlinesRequest.class))).thenReturn(mockResult);

        ArticlesResult response = newsController.getTopHeadlines(
                "RealMadrid",
                null,
                "business",
                "en",
                "us",
                1,
                20
        );

        assertEquals(mockResult, response);
        verify(newsApiClient).getTopHeadlines(any(TopHeadlinesRequest.class));
    }

    @Test
    void testGetEverything() {
        EverythingRequest request = new EverythingRequest();
        request.setQ("RealMadrid");
        request.setFrom(LocalDateTime.parse("2023-11-01T00:00:00"));
        request.setTo(LocalDateTime.parse("2023-11-30T23:59:59"));
        request.setLanguage(Languages.EN);
        request.setSortBy(SortBys.RELEVANCY);
        request.setPage(1);
        request.setPageSize(20);

        ArticlesResult mockResult = new ArticlesResult();
        mockResult.setArticles(Collections.emptyList());
        when(newsApiClient.getEverything(any(EverythingRequest.class))).thenReturn(mockResult);

        ArticlesResult response = newsController.getEverything(
                "RealMadrid",
                null,
                null,
                "2023-11-01T00:00:00",
                "2023-11-30T23:59:59",
                "en",
                "relevancy",
                1,
                20
        );

        assertEquals(mockResult, response);
        verify(newsApiClient).getEverything(any(EverythingRequest.class));
    }

    @Test
    void testGetTopHeadlinesWithDefaultParams() {
        TopHeadlinesRequest request = new TopHeadlinesRequest();
        request.setPage(1);
        request.setPageSize(20);

        ArticlesResult mockResult = new ArticlesResult();
        mockResult.setArticles(Collections.emptyList());
        when(newsApiClient.getTopHeadlines(any(TopHeadlinesRequest.class))).thenReturn(mockResult);

        ArticlesResult response = newsController.getTopHeadlines(null, null, null, null, null, 1, 20);

        assertEquals(mockResult, response);
        verify(newsApiClient).getTopHeadlines(any(TopHeadlinesRequest.class));
    }

    @Test
    void testGetEverythingWithDefaultParams() {
        EverythingRequest request = new EverythingRequest();
        request.setSortBy(SortBys.RELEVANCY);
        request.setPage(1);
        request.setPageSize(20);

        ArticlesResult mockResult = new ArticlesResult();
        mockResult.setArticles(Collections.emptyList());
        when(newsApiClient.getEverything(any(EverythingRequest.class))).thenReturn(mockResult);

        ArticlesResult response = newsController.getEverything(null, null, null, null, null, null, "relevancy", 1, 20);

        assertEquals(mockResult, response);
        verify(newsApiClient).getEverything(any(EverythingRequest.class));
    }
}
