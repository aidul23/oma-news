package threedots.dev_backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import threedots.dev_backend.constants.Categories;
import threedots.dev_backend.model.ArticleEntity;
import threedots.dev_backend.repository.ArticleRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ArticleControllerTest {

    @Mock
    private ArticleRepository articleRepository;

    @InjectMocks
    private ArticleController articleController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetArticlesWithSentiment() {
        // Mock data
        List<ArticleEntity> mockArticles = new ArrayList<>();
        ArticleEntity article1 = new ArticleEntity();
        article1.setId("1");
        article1.setUrlKey("key1");
        article1.setSentiment("positive");
        article1.setCategory(Categories.TECHNOLOGY);
        article1.setFetchedAt(LocalDateTime.now());
        mockArticles.add(article1);

        when(articleRepository.findAll(Sort.by(Sort.Direction.DESC, "publishedAt"))).thenReturn(mockArticles);


        List<ArticleEntity> result = articleController.getArticlesWithSentiment();


        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("positive", result.get(0).getSentiment());
        verify(articleRepository).findAll(Sort.by(Sort.Direction.DESC, "publishedAt"));
    }

    @Test
    void testGetArticlesByCategorySuccess() {
        // Mock data
        List<ArticleEntity> mockArticles = new ArrayList<>();
        ArticleEntity article1 = new ArticleEntity();
        article1.setId("1");
        article1.setUrlKey("key1");
        article1.setSentiment("neutral");
        article1.setCategory(Categories.BUSINESS);
        article1.setFetchedAt(LocalDateTime.now());
        mockArticles.add(article1);

        when(articleRepository.findByCategory(Categories.BUSINESS)).thenReturn(mockArticles);


        ResponseEntity<List<ArticleEntity>> response = articleController.getArticlesByCategory("business");


        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("neutral", response.getBody().get(0).getSentiment());
        assertEquals(200, response.getStatusCode().value());
        verify(articleRepository).findByCategory(Categories.BUSINESS);
    }

    @Test
    void testGetArticlesByCategoryInvalidCategory() {

        ResponseEntity<List<ArticleEntity>> response = articleController.getArticlesByCategory("invalidCategory");


        assertNull(response.getBody());
        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    void testGetArticlesByCategoryNoArticles() {

        when(articleRepository.findByCategory(Categories.HEALTH)).thenReturn(new ArrayList<>());


        ResponseEntity<List<ArticleEntity>> response = articleController.getArticlesByCategory("health");


        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
        assertEquals(200, response.getStatusCode().value());
        verify(articleRepository).findByCategory(Categories.HEALTH);
    }
}
