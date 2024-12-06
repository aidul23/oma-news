package threedots.dev_backend.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import threedots.dev_backend.exceptions.CustomExceptions;
import threedots.dev_backend.model.User;
import threedots.dev_backend.repository.UserRepository;
import threedots.dev_backend.service.interfaces.IArticlesReadService;

import static threedots.dev_backend.service.AuthenticationUtils.getLoggedInUsername;

@Service
public class ArticleReadService implements IArticlesReadService {

    private final UserRepository userRepository;

    @Autowired
    public ArticleReadService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void updateArticleReadCountForUser(String articleSentiment) {
        String loggedInUsername = getLoggedInUsername();
        if (loggedInUsername == null) {
            throw new CustomExceptions.UserNotLoggedInException("User is not logged in");
        }

        User user = userRepository.findByUsername(loggedInUsername)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found: " + loggedInUsername));

        switch (articleSentiment.toLowerCase()) {
            case "positive":
                user.setPositiveArticlesRead(user.getPositiveArticlesRead() + 1);
                break;
            case "negative":
                user.setNegativeArticlesRead(user.getNegativeArticlesRead() + 1);
                break;
            case "neutral":
                user.setNeutralArticlesRead(user.getNeutralArticlesRead() + 1);
                break;
            default:
                throw new CustomExceptions.InvalidSentimentException("Unknown sentiment: " + articleSentiment);
        }

        userRepository.save(user);
    }
}

