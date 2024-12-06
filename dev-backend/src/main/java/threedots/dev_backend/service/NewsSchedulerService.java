package threedots.dev_backend.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import threedots.dev_backend.constants.Categories;
import threedots.dev_backend.dto.TopHeadlinesRequest;
import threedots.dev_backend.service.interfaces.INewsStorageService;

@Service
public class NewsSchedulerService {

    private final INewsStorageService newsStorageService;

    @Autowired
    public NewsSchedulerService(INewsStorageService newsStorageService) {
        this.newsStorageService = newsStorageService;
    }

    // Schedule the task to run multiple times per day (e.g., every 6 hours)
    @Scheduled(fixedRate = 21600000)  // Every 6 hours
    public void scheduleNewsFetchAndProcessing() {
        for (Categories category : Categories.values()) {
            var request = new TopHeadlinesRequest();
            request.setCategory(category);  // Set the category for each iteration
            newsStorageService.fetchProcessAndStoreNews(request);
        }
    }

    // to fetch the news on startup
    @PostConstruct
    public void runOnStartup() {
        scheduleNewsFetchAndProcessing();
    }
}
