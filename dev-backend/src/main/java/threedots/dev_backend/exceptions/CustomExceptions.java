package threedots.dev_backend.exceptions;

public class CustomExceptions {

    public static class UserNotLoggedInException extends RuntimeException {
        public UserNotLoggedInException(String message) {
            super(message);
        }
    }

    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) {
            super(message);
        }
    }

    public static class InvalidSentimentException extends IllegalArgumentException {
        public InvalidSentimentException(String message) {
            super(message);
        }
    }
}

