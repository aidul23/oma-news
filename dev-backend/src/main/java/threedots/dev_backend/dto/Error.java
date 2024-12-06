package threedots.dev_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import threedots.dev_backend.constants.ErrorCodes;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Error {
    private ErrorCodes code;
    private String message;
}
