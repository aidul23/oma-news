package threedots.dev_backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import threedots.dev_backend.dto.UserLoginDto;
import threedots.dev_backend.dto.UserRegistrationDto;
import threedots.dev_backend.service.interfaces.IUserService;
import threedots.dev_backend.security.JwtTokenUtil;
import threedots.dev_backend.model.User;
import java.util.HashMap;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;


class UserControllerTest {

    @Mock
    private IUserService userService;

    @Mock
    private JwtTokenUtil jwtTokenUtil;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSuccessfulRegistration() throws Exception {

        UserRegistrationDto registrationDto = new UserRegistrationDto();
        registrationDto.setUsername("testuser");
        registrationDto.setEmail("test@example.com");
        registrationDto.setPassword("password123");
        registrationDto.setConfirmPassword("password123");

        // a mock User
        User mockUser = new User();
        mockUser.setUsername("testuser");
        mockUser.setEmail("test@example.com");


        when(userService.registerUser(
                registrationDto.getUsername(),
                registrationDto.getEmail(),
                registrationDto.getPassword(),
                registrationDto.getConfirmPassword()
        )).thenReturn(mockUser);


        ResponseEntity<String> response = userController.register(registrationDto);

        // Assert
        assertEquals(200, response.getStatusCode().value());
        assertEquals("User registered successfully", response.getBody());
        verify(userService).registerUser(
                registrationDto.getUsername(),
                registrationDto.getEmail(),
                registrationDto.getPassword(),
                registrationDto.getConfirmPassword()
        );
    }

    @Test
    void testSuccessfulLogin() {

        UserLoginDto loginDto = new UserLoginDto();
        loginDto.setUsername("testuser");
        loginDto.setPassword("password123");

        when(userService.loginUser("testuser", "password123")).thenReturn(true);
        when(jwtTokenUtil.generateToken("testuser")).thenReturn("mockedToken");


        ResponseEntity<String> response = userController.login(loginDto);


        assertEquals(200, response.getStatusCode().value());
        assertEquals("Login successful", response.getBody());
        assertNotNull(response.getHeaders().get("Authorization"));
        verify(userService).loginUser("testuser", "password123");
        verify(jwtTokenUtil).generateToken("testuser");
    }

    @Test
    void testFailedLogin() {

        UserLoginDto loginDto = new UserLoginDto();
        loginDto.setUsername("testuser");
        loginDto.setPassword("wrongpassword");

        when(userService.loginUser("testuser", "wrongpassword")).thenReturn(false);


        ResponseEntity<String> response = userController.login(loginDto);


        assertEquals(400, response.getStatusCode().value());
        assertEquals("Invalid username or password", response.getBody());
        verify(userService).loginUser("testuser", "wrongpassword");
    }

    @Test
    void testGetUserReadStatistics() {

        Map<String, Integer> mockStatistics = new HashMap<>();
        mockStatistics.put("totalReads", 100);
        mockStatistics.put("uniqueUsers", 50);

        when(userService.getUserReadStatistics()).thenReturn(mockStatistics);


        ResponseEntity<Map<String, Integer>> response = userController.getUserReadStatistics();


        assertEquals(200, response.getStatusCode().value());
        assertEquals(mockStatistics, response.getBody());
        verify(userService).getUserReadStatistics();
    }
}