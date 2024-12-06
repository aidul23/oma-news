package threedots.dev_backend.service.interfaces;

import threedots.dev_backend.dto.TopHeadlinesRequest;

public interface INewsStorageService {
    void fetchProcessAndStoreNews(TopHeadlinesRequest request);
}
