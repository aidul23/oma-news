package threedots.dev_backend.service.interfaces;

import threedots.dev_backend.model.User;

import java.util.Map;

public interface IUserService {
    User registerUser(String username, String email, String password, String confirmPassword) throws Exception;
    boolean loginUser(String username, String password);
    Map<String, Integer> getUserReadStatistics();
}
