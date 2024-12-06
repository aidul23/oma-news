package threedots.dev_backend.constants;

public enum ErrorCodes {
    API_KEY_EXHAUSTED,           // ApiKeyExhausted
    API_KEY_MISSING,             // ApiKeyMissing
    API_KEY_INVALID,             // ApiKeyInvalid
    API_KEY_DISABLED,            // ApiKeyDisabled
    PARAMETERS_MISSING,          // ParametersMissing
    PARAMETERS_INCOMPATIBLE,     // ParametersIncompatible
    PARAMETER_INVALID,           // ParameterInvalid
    RATE_LIMITED,                // RateLimited
    REQUEST_TIMEOUT,             // RequestTimeout
    SOURCES_TOO_MANY,            // SourcesTooMany
    SOURCE_DOES_NOT_EXIST,       // SourceDoesNotExist
    SOURCE_UNAVAILABLE_SORTED_BY,// SourceUnavailableSortedBy
    SOURCE_TEMPORARILY_UNAVAILABLE, // SourceTemporarilyUnavailable
    UNEXPECTED_ERROR,            // UnexpectedError
    UNKNOWN_ERROR                // UnknownError
}

