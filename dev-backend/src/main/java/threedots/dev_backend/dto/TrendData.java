package threedots.dev_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TrendData {
    private String date;
    private int positive;
    private int negative;
    private int neutral;
}
