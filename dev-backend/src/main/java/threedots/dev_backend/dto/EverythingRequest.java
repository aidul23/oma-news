package threedots.dev_backend.dto;

import lombok.Data;
import threedots.dev_backend.constants.Languages;
import threedots.dev_backend.constants.SortBys;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class EverythingRequest {

    /**
     * The keyword or phrase to search for. Boolean operators are supported.
     */
    private String q;

    /**
     * If you want to restrict the search to specific sources, add their Ids here.
     */
    private List<String> sources = new ArrayList<>();

    /**
     * If you want to restrict the search to specific web domains, add these here.
     */
    private List<String> domains = new ArrayList<>();

    /**
     * The earliest date to retrieve articles from.
     */
    private LocalDateTime from;

    /**
     * The latest date to retrieve articles from.
     */
    private LocalDateTime to;

    /**
     * The language to restrict articles to.
     */
    private Languages language;

    /**
     * How should the results be sorted? Relevancy, PublishedAt, Publisher.
     */
    private SortBys sortBy;

    /**
     * Page through the results by increasing this.
     */
    private int page = 1;

    /**
     * Set the max number of results to retrieve per request. The max is 100.
     */
    private int pageSize = 20;
}

