package threedots.dev_backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import threedots.dev_backend.exceptions.CustomExceptions;
import threedots.dev_backend.service.interfaces.IArticlesReadService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ArticleReadControllerTest {

    @Mock
    private IArticlesReadService articleReadService;

    @InjectMocks
    private ArticleReadController articleReadController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testTrackArticleReadSuccess() throws Exception {
        String sentiment = "positive";
        doNothing().when(articleReadService).updateArticleReadCountForUser(sentiment);

        ResponseEntity<String> response = articleReadController.trackArticleRead(sentiment);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Article read count updated successfully.", response.getBody());
        verify(articleReadService).updateArticleReadCountForUser(sentiment);
    }

    @Test
    void testTrackArticleReadUnauthorized() throws Exception {
        String sentiment = "positive";
        doThrow(new CustomExceptions.UserNotLoggedInException("User not logged in"))
                .when(articleReadService).updateArticleReadCountForUser(sentiment);

        ResponseEntity<String> response = articleReadController.trackArticleRead(sentiment);

        assertEquals(401, response.getStatusCode().value());
        assertEquals("User not logged in", response.getBody());
        verify(articleReadService).updateArticleReadCountForUser(sentiment);
    }

    @Test
    void testTrackArticleReadUserNotFound() throws Exception {
        String sentiment = "positive";
        doThrow(new CustomExceptions.UserNotFoundException("User not found"))
                .when(articleReadService).updateArticleReadCountForUser(sentiment);

        ResponseEntity<String> response = articleReadController.trackArticleRead(sentiment);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("User not found", response.getBody());
        verify(articleReadService).updateArticleReadCountForUser(sentiment);
    }

    @Test
    void testTrackArticleReadInvalidSentiment() throws Exception {
        String sentiment = "invalid";
        doThrow(new CustomExceptions.InvalidSentimentException("Invalid sentiment"))
                .when(articleReadService).updateArticleReadCountForUser(sentiment);

        ResponseEntity<String> response = articleReadController.trackArticleRead(sentiment);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Invalid sentiment", response.getBody());
        verify(articleReadService).updateArticleReadCountForUser(sentiment);
    }

    @Test
    void testTrackArticleReadGenericError() throws Exception {
        String sentiment = "positive";
        doThrow(new RuntimeException("Unexpected error"))
                .when(articleReadService).updateArticleReadCountForUser(sentiment);

        ResponseEntity<String> response = articleReadController.trackArticleRead(sentiment);

        assertEquals(500, response.getStatusCode().value());
        assertEquals("An error occurred while updating the article read count.", response.getBody());
        verify(articleReadService).updateArticleReadCountForUser(sentiment);
    }
}
