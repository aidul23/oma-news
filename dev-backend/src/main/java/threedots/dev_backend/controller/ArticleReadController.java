package threedots.dev_backend.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import threedots.dev_backend.exceptions.CustomExceptions;
import threedots.dev_backend.service.interfaces.IArticlesReadService;

@RestController
@RequestMapping("/api/articles")
public class ArticleReadController {

    private final IArticlesReadService articleReadService;

    public ArticleReadController(IArticlesReadService articleReadService) {
        this.articleReadService = articleReadService;
    }

    @PostMapping("/read")
    public ResponseEntity<String> trackArticleRead(
            @RequestParam String sentiment) {

        try {
            articleReadService.updateArticleReadCountForUser(sentiment);
            return ResponseEntity.ok("Article read count updated successfully.");
        } catch (CustomExceptions.UserNotLoggedInException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (CustomExceptions.UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (CustomExceptions.InvalidSentimentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating the article read count.");
        }
    }
}
