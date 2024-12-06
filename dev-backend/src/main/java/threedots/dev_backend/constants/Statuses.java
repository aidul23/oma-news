package threedots.dev_backend.constants;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Statuses {
    /**
     * Request was successful
     */
    OK,

    /**
     * Request failed
     */
    ERROR;

    @JsonCreator
    public static Statuses fromValue(String value) {
        // Convert the incoming value to uppercase before matching
        return Statuses.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
