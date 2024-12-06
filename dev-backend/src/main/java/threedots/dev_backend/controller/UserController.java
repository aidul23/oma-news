package threedots.dev_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import threedots.dev_backend.dto.UserLoginDto;
import threedots.dev_backend.dto.UserRegistrationDto;
import threedots.dev_backend.service.interfaces.IUserService;
import threedots.dev_backend.security.JwtTokenUtil;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final IUserService userService;
    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    public UserController(IUserService userService, JwtTokenUtil jwtTokenUtil) {

        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    //Registration
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRegistrationDto userRegistrationDto) {
        try{
            userService.registerUser(
                    userRegistrationDto.getUsername(),
                    userRegistrationDto.getEmail(),
                    userRegistrationDto.getPassword(),
                    userRegistrationDto.getConfirmPassword()
            );
            return ResponseEntity.ok("User registered successfully");

        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }


    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserLoginDto userLoginDto) {
        boolean success = userService.loginUser(userLoginDto.getUsername(), userLoginDto.getPassword());
        if (success) {
            String token = jwtTokenUtil.generateToken(userLoginDto.getUsername());
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body("Login successful");
        }
        return ResponseEntity.badRequest().body("Invalid username or password");
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Integer>> getUserReadStatistics() {
        Map<String, Integer> statistics = userService.getUserReadStatistics();
        return ResponseEntity.ok(statistics);
    }


}
