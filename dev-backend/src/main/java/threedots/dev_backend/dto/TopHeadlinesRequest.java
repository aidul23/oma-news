package threedots.dev_backend.dto;

import lombok.Data;
import threedots.dev_backend.constants.Categories;
import threedots.dev_backend.constants.Countries;
import threedots.dev_backend.constants.Languages;

import java.util.ArrayList;
import java.util.List;

@Data
public class TopHeadlinesRequest {

    /**
     * The keyword or phrase to search for. Boolean operators are supported.
     */
    private String q;

    /**
     * If you want to restrict the results to specific sources, add their Ids here.
     */
    private List<String> sources = new ArrayList<>();

    /**
     * If you want to restrict the headlines to a specific news category.
     */
    private Categories category;

    /**
     * The language to restrict articles to.
     */
    private Languages language = Languages.EN;

    /**
     * The country of the source to restrict articles to.
     */
    private Countries country;

    /**
     * Each request returns a fixed amount of results. Page through them by increasing this.
     */
    private int page = 1;

    /**
     * Set the max number of results to retrieve per request. The max is 100.
     */
    private int pageSize = 20;
}

