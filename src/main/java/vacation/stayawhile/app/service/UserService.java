package vacation.stayawhile.app.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import vacation.stayawhile.app.model.User;
import vacation.stayawhile.app.model.UserRole;
import vacation.stayawhile.app.model.UserStatus;
import vacation.stayawhile.app.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private MailSenderService mailSenderService;
	
	private final List<String> activeCodes = new CopyOnWriteArrayList<>();

	public User createUser(User user) {
		// Generate userId if not provided
		if (user.getUserId() == null || user.getUserId().isEmpty()) {
			user.setUserId("user_" + UUID.randomUUID().toString().substring(0, 8));
		}

		// Check if username already exists
		if (userRepository.existsByUsername(user.getUsername())) {
			throw new RuntimeException("Username already exists: " + user.getUsername());
		}

		// Check if email already exists
		if (userRepository.existsByEmail(user.getEmail())) {
			throw new RuntimeException("Email already exists: " + user.getEmail());
		}

		// Check if userId already exists
		if (userRepository.existsByUserId(user.getUserId())) {
			throw new RuntimeException("UserId already exists: " + user.getUserId());
		}

		user.setCreatedAt(LocalDateTime.now());
		user.setUpdatedAt(LocalDateTime.now());

		User savedUser = userRepository.save(user);
		System.out.println("Created user with ID: " + savedUser.getId());
		System.out.println("UserId: " + savedUser.getUserId());
		System.out.println("Username: " + savedUser.getUsername());
		System.out.println("Total users: " + userRepository.count());

		return savedUser;
	}

	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	public Optional<User> getUserById(Long id) {
		return userRepository.findById(id);
	}

	public Optional<User> getUserByUserId(String userId) {
		return userRepository.findByUserId(userId);
	}

	public Optional<User> getUserByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	public Optional<User> getUserByEmail(String email) {
		Optional<User> user = userRepository.findByEmail(email);
		if (!user.isEmpty()) {
			String code = generateCode();
			String subject = "Your secure code is " +code+ " - never share this" ;
			String content = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>Stay Awhile Villas</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><style>@media only screen and (max-width:600px){.wrapper{width:100%!important}.padding{padding:15px!important}.header-text{font-size:16px!important}.code{font-size:18px!important}}</style></head><body style=\"margin:0;padding:0;background-color:#eeeeee;font-family:Arial,sans-serif;\"><table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" bgcolor=\"#eeeeee\"><tr><td align=\"center\"><table role=\"presentation\" width=\"600\" class=\"wrapper\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" bgcolor=\"#ffffff\" style=\"border-radius:4px;overflow:hidden;max-width:600px;width:100%;\"><tr><td bgcolor=\"#b89535\" style=\"color:#ffffff;text-align:center;padding:20px 0px;font-size:18px;font-weight:400;letter-spacing:1px;\" class=\"header-text\">STAY AWHILE VILLAS <img src=\"https://i.ibb.co/39jCsW5Y/vip.png\" alt=\"\" width=\"20\"></td></tr><tr><td style=\"padding:30px;color:#333333;font-size:14px;line-height:1.6;\" class=\"padding\"><p>Hi,</p><p>For your security, never share this code with anyone. Our support team will never ask for this.</p><p>Your secure code is <strong class=\"code\" style=\"font-size:16px;\">" + code + "</strong>.</p><p>If you didn’t request this, you can ignore this email.</p></td></tr><tr><td style=\"border-top:1px solid #dddddd;padding:20px 30px;font-size:12px;color:#555555;line-height:1.5;\" class=\"padding\">This email and its links may contain your personal information; please only forward to people you trust. You are receiving this transactional email based on a recent booking, interaction with us, membership or account update on Stay Awhile.<div style=\"margin-top:10px;font-size:12px;color:#333333;\">9437 Santa Monica Blvd suite 204, Beverly Hills, CA, USA</div></td></tr></table></td></tr></table></body></html>";
			mailSenderService.sendEmail(email, subject, content);
		}
		return user;
	}
	
	

	public User updateUser(Long id, User userDetails) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + id));

		// Update fields
		user.setUsername(userDetails.getUsername());
		user.setEmail(userDetails.getEmail());
		user.setFirstName(userDetails.getFirstName());
		user.setLastName(userDetails.getLastName());
		user.setBio(userDetails.getBio());
		user.setDateOfBirth(userDetails.getDateOfBirth());
		user.setGender(userDetails.getGender());
		user.setContactInfo(userDetails.getContactInfo());
		user.setAccessibilityNeeds(userDetails.getAccessibilityNeeds());
		user.setPaymentCard(userDetails.getPaymentCard());
		user.setRole(userDetails.getRole());
		user.setStatus(userDetails.getStatus());
		user.setUpdatedAt(LocalDateTime.now());

		// Update password only if provided
		if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
			user.setPassword(userDetails.getPassword());
		}

		return userRepository.save(user);
	}

	public void deleteUser(Long id) {
		if (!userRepository.existsById(id)) {
			throw new RuntimeException("User not found with id: " + id);
		}
		userRepository.deleteById(id);
		System.out.println("Deleted user with ID: " + id);
	}

	public List<User> getUsersByRole(UserRole role) {
		return userRepository.findByRole(role);
	}

	public List<User> getUsersByStatus(UserStatus status) {
		return userRepository.findByStatus(status);
	}

	public List<User> getUsersByRoleAndStatus(UserRole role, UserStatus status) {
		return userRepository.findByRoleAndStatus(role, status);
	}
	
	public boolean verifyUserCode(String code) {
	    if (isCodeValid(code)) {
	        // Remove code after successful verification
	        activeCodes.remove(code);
	        return true;
	    }
	    return false;
	}
	
	public String generateCode() {
	    Random random = new Random();
	    int number = random.nextInt(1_000_000);
	    String sixDigit = String.format("%06d", number);

	    // Add the code to activeCodes
	    activeCodes.add(sixDigit);

	    // Optional: limit the list size (e.g., keep last 1000 codes)
	    if (activeCodes.size() > 1000) {
	        activeCodes.remove(0);
	    }

	    return sixDigit;
	}
	
	public boolean isCodeValid(String code) {
	    return activeCodes.contains(code);
	}
}
