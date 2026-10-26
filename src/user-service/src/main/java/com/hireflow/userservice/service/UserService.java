package com.hireflow.userservice.service;

import com.hireflow.userservice.dto.AuthResponse;
import com.hireflow.userservice.entity.User;
import com.hireflow.userservice.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private final UserRepository userRepository;
    // In-memory token store: token -> userId
    private final Map<String, String> tokenStore = new ConcurrentHashMap<>();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id));
    }

    public User createUser(User user) {
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(hashPassword(user.getPassword()));
        }
        return userRepository.save(user);
    }

    public User updateUser(String id, User user) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id));
        
        existing.setFullName(user.getFullName());
        existing.setEmail(user.getEmail());
        existing.setRole(user.getRole());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existing.setPassword(hashPassword(user.getPassword()));
        }
        return userRepository.save(existing);
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public AuthResponse authenticate(String email, String password) {
        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }

        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        String storedPass = user.getPassword();
        boolean valid = false;

        if (storedPass == null || storedPass.isEmpty()) {
            // Default demo passwords for pre-existing records without password field
            valid = "admin123".equals(password)
                    || "recruiter123".equals(password)
                    || "candidate123".equals(password)
                    || "password123".equals(password);
            if (valid) {
                // Migrate user to stored hashed password
                user.setPassword(hashPassword(password));
                userRepository.save(user);
            }
        } else {
            String hashedInput = hashPassword(password);
            valid = storedPass.equals(password) || storedPass.equals(hashedInput);
        }

        if (!valid) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String token = "hf_token_" + UUID.randomUUID().toString().replace("-", "");
        tokenStore.put(token, user.getId());

        return new AuthResponse(token, user, "Login successful");
    }

    public AuthResponse register(User newUser) {
        if (newUser.getEmail() == null || newUser.getEmail().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (newUser.getPassword() == null || newUser.getPassword().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        String normalizedEmail = newUser.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered: " + normalizedEmail);
        }

        newUser.setEmail(normalizedEmail);
        newUser.setPassword(hashPassword(newUser.getPassword()));
        if (newUser.getRole() == null || newUser.getRole().trim().isEmpty()) {
            newUser.setRole("CANDIDATE");
        }

        User saved = userRepository.save(newUser);
        String token = "hf_token_" + UUID.randomUUID().toString().replace("-", "");
        tokenStore.put(token, saved.getId());

        return new AuthResponse(token, saved, "Account created successfully");
    }

    public User getMe(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing authorization token");
        }

        String userId = tokenStore.get(token);
        if (userId == null) {
            // If token has encoded userId suffix (e.g. hf_token_..._userId)
            if (token.contains("_usr_")) {
                String potentialId = token.substring(token.indexOf("_usr_") + 1);
                return userRepository.findById(potentialId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token session"));
            }
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session expired or invalid token");
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private String hashPassword(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedhash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            return raw;
        }
    }
}
