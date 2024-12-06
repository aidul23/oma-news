package threedots.dev_backend.constants;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

@JsonSerialize(using = ToStringSerializer.class)
public enum Categories {
    BUSINESS("Business"),
    ENTERTAINMENT("Entertainment"),
    HEALTH("Health"),
    SCIENCE("Science"),
    SPORTS("Sports"),
    TECHNOLOGY("Technology");

    private final String value;

    Categories(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static Categories fromValue(String value) {
        for (Categories category : Categories.values()) {
            if (category.value.equalsIgnoreCase(value)) {
                return category;
            }
        }
        throw new IllegalArgumentException("Unknown category: " + value);
    }
}

