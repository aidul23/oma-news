package threedots.dev_backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import threedots.dev_backend.constants.Categories;
import threedots.dev_backend.dto.TrendData;
import threedots.dev_backend.service.interfaces.ITrendsService;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class TrendsControllerTest {

    @Mock
    private ITrendsService trendsService;

    @InjectMocks
    private TrendsController trendsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetDailyTrendsByCategory_Success() {
        Categories category = Categories.BUSINESS;
        List<TrendData> mockTrends = Arrays.asList(
                new TrendData("2024-11-30", 100, 50, 25),
                new TrendData("2024-11-29", 200, 75, 50)
        );

        when(trendsService.getDailyTrends(category)).thenReturn(mockTrends);

        ResponseEntity<List<TrendData>> response = trendsController.getDailyTrends("business");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockTrends, response.getBody());
        verify(trendsService).getDailyTrends(category);
    }

    @Test
    void testGetDailyTrendsByCategory_InvalidCategory() {
        ResponseEntity<List<TrendData>> response = trendsController.getDailyTrends("invalidCategory");

        assertEquals(400, response.getStatusCodeValue());
        assertEquals(null, response.getBody());
        verifyNoInteractions(trendsService);
    }

    @Test
    void testGetDailyTrendsGeneral_Success() {
        List<TrendData> mockTrends = Arrays.asList(
                new TrendData("2024-11-30", 100, 50, 25),
                new TrendData("2024-11-29", 200, 75, 50)
        );

        when(trendsService.getDailyTrends(null)).thenReturn(mockTrends);

        ResponseEntity<List<TrendData>> response = trendsController.getDailyTrends();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockTrends, response.getBody());
        verify(trendsService).getDailyTrends(null);
    }

    @Test
    void testGetDailyTrendsGeneral_NoTrends() {
        when(trendsService.getDailyTrends(null)).thenReturn(Collections.emptyList());

        ResponseEntity<List<TrendData>> response = trendsController.getDailyTrends();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(Collections.emptyList(), response.getBody());
        verify(trendsService).getDailyTrends(null);
    }
}
