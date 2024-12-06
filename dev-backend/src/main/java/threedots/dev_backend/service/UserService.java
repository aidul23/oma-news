package threedots.dev_backend.service;


import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import threedots.dev_backend.exceptions.CustomExceptions;
import threedots.dev_backend.model.User;
import threedots.dev_backend.repository.UserRepository;
import threedots.dev_backend.service.interfaces.IUserService;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static threedots.dev_backend.service.AuthenticationUtils.getLoggedInUsername;

@Service
public class UserService implements IUserService, UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User loadUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Registration
    public User registerUser(String username, String email, String password, String confirmPassword ) throws Exception {
        if(!password.equals(confirmPassword)) {
            throw new Exception("Passwords do not match.");
        }
        Optional<User> existingUser = userRepository.findByUsername(username);
        if(existingUser.isPresent()) {
            throw new Exception("User already exists.");
        }

        String encodedPassword = passwordEncoder.encode(password);

        User newuser = new User(username, email, encodedPassword, Set.of("user"));
        return userRepository.save(newuser);
    }

    // login

    public boolean loginUser(String username, String password) {
        Optional<User> existingUser = userRepository.findByUsername(username);
        return existingUser.filter(user -> passwordEncoder.matches(password, user.getPassword())).isPresent();
    }

    public Map<String, Integer> getUserReadStatistics() {
        String loggedInUsername = getLoggedInUsername();
        System.out.println("logged in user: "+loggedInUsername);
        if (loggedInUsername == null) {
            throw new CustomExceptions.UserNotLoggedInException("User is not logged in");
        }

        User user = userRepository.findByUsername(loggedInUsername)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found: " + loggedInUsername));

        Map<String, Integer> statistics = new HashMap<>();
        statistics.put("positive", user.getPositiveArticlesRead());
        statistics.put("negative", user.getNegativeArticlesRead());
        statistics.put("neutral", user.getNeutralArticlesRead());

        return statistics;
    }

}
