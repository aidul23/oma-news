package threedots.dev_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import threedots.dev_backend.constants.Categories;
import threedots.dev_backend.dto.TrendData;
import threedots.dev_backend.service.interfaces.ITrendsService;

import java.util.List;

@RestController
@RequestMapping("/api/trends")
public class TrendsController {

    private final ITrendsService trendsService;

    @Autowired
    public TrendsController(ITrendsService trendsService) {
        this.trendsService = trendsService;
    }

    @GetMapping("category/{category}")
    public ResponseEntity<List<TrendData>> getDailyTrends(@PathVariable("category") String categoryName){
        Categories category;
        try {
            category = Categories.valueOf(categoryName.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }

        List<TrendData> trends = trendsService.getDailyTrends(category);
        return ResponseEntity.ok(trends);
    }

    @GetMapping("general")
    public ResponseEntity<List<TrendData>> getDailyTrends(){
        List<TrendData> trends = trendsService.getDailyTrends((Categories) null);
        return ResponseEntity.ok(trends);
    }
}
