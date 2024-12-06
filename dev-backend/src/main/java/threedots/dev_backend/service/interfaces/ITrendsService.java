package threedots.dev_backend.service.interfaces;

import threedots.dev_backend.constants.Categories;
import threedots.dev_backend.dto.TrendData;

import java.util.List;

public interface ITrendsService {
    List<TrendData> getDailyTrends(Categories category);
}
