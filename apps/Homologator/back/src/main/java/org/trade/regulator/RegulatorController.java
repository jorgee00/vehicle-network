/*
SPDX-License-Identifier: Apache-2.0
*/
package org.trade.regulator;

import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import javax.annotation.PostConstruct;

import org.json.JSONArray;
import org.json.JSONObject;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
public class RegulatorController {

		@RequestMapping("/")
		public String index() {
				return "<h1>You have reached the OEM Manufacturer Organization Portal!</h1>";
		}

		@Autowired
		private AuthenticationManager authenticationManager;

		@Autowired
		private SecurityUtils securityUtils;

		@Autowired
		private InMemoryUserDetailsManager userDetailsService;

		@Value("${connectionProfilesBaseDir}")
		private String connectionProfilesBaseDir;

		@Value("${connectionProfileJson}")
		private String connectionProfileJson;

		@Value("${walletsBaseDir}")
		private String walletsBaseDir;

		@PostConstruct
		public void createDefaultAdminUser() {
			userDetailsService.createUser(User.withUsername("admin").password(new BCryptPasswordEncoder().encode("adminpw")).
											roles(SecurityUtils.registrarRole).build());

			// Also set Fabric properties
			FabricNetworkUtils.connectionProfilesBaseDir = connectionProfilesBaseDir;
			FabricNetworkUtils.connectionProfileJson = connectionProfileJson;
			FabricIdentityUtils.walletsBaseDir = walletsBaseDir;
		}

		@RequestMapping(value = "/register", method = RequestMethod.POST)
		public ResponseEntity<String> register(String registrarUser, String registrarPassword, String username, String password, String role) throws Exception {
			role = role.toUpperCase();
			try {
				Authentication authResult = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(registrarUser, registrarPassword));
				if (!SecurityUtils.isRegistrar(authResult)) {
						throw new BadCredentialsException(username + " is not a registrar");
				}
			} catch(AuthenticationException ae) {
				ae.printStackTrace();
				return new ResponseEntity<String>(ae.getMessage(), HttpStatus.FORBIDDEN);
			}
			if (!SecurityUtils.recognizedRole(role.toUpperCase())) {
				return new ResponseEntity<String>(role + " is not a recognized role", HttpStatus.BAD_REQUEST);
			}

			if (!FabricIdentityUtils.enrollRegistrar(FabricNetworkUtils.regulatorOrgMsp)) {
				return new ResponseEntity<String>("Unable to enroll registrar", HttpStatus.INTERNAL_SERVER_ERROR);
			}

			if (!userDetailsService.userExists(username)) {
				if (!FabricIdentityUtils.registerAndEnrollUser(FabricNetworkUtils.regulatorOrgMsp, username, role)) {
					return new ResponseEntity<String>("Unable to register user " + username, HttpStatus.INTERNAL_SERVER_ERROR);
				}
				userDetailsService.createUser(User.withUsername(username).password(new BCryptPasswordEncoder().encode(password)).
										roles(role.toUpperCase()).build());
			}

			JSONObject registrationObj = new JSONObject();
			registrationObj.put("username", username);
			JSONArray roles = new JSONArray();
			roles.put(role);
			registrationObj.put("roles", roles);
			return ResponseEntity.ok(registrationObj.toString());
		}

		@RequestMapping(value = "/login", method = RequestMethod.POST)
		public ResponseEntity<String> login(String username, String password, HttpServletResponse response) throws Exception {
			try {
				System.out.println(new UsernamePasswordAuthenticationToken(username, password));
				authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
			} catch(AuthenticationException ae) {
				ae.printStackTrace();
				return new ResponseEntity<String>(ae.getMessage(), HttpStatus.FORBIDDEN);
			}
			// Also check Fabric wallet for presence of user credentials
			if (FabricIdentityUtils.loadUserFromWallet(FabricNetworkUtils.regulatorOrgMsp, username) == null) {
				return new ResponseEntity<String>("Identity for " + username + " not found in wallet", HttpStatus.FORBIDDEN);
			}

			final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			final String token = securityUtils.generateToken(userDetails);
			JSONObject tokenObj = new JSONObject();
			response.addHeader("Set-Cookie", "bearer=" + token + "; SameSite=strict; Max-Age=604800;Secure");
			tokenObj.put("token", token);
			return ResponseEntity.ok(tokenObj.toString());
		}

		private String errorObj(String errorMessage) {
			JSONObject errObj = new JSONObject();
			errObj.put("result", false);
			errObj.put("error", errorMessage);
			return errObj.toString();
		}
		@RequestMapping(value = "/listSoftware", method = RequestMethod.GET)
		public String listSoftware(@RequestHeader Map<String, String> headers) {
			String username = securityUtils.getUserNameFromTokenHeaders(headers);
			if (username == null) {
					return errorObj("Unable to get username from headers");
			}
			return FabricNetworkUtils.invokeContract(username, FabricNetworkUtils.tradeChannel, FabricNetworkUtils.vehicleContractId,
												true, "listSw");
		}

		@RequestMapping(value = "/acceptSoftware", method = RequestMethod.POST)
		public String acceptSoftware(@RequestHeader Map<String, String> headers, String id, String justification) {
			String username = securityUtils.getUserNameFromTokenHeaders(headers);
			if (username == null) {
				return errorObj("Unable to get username from headers");
			}
			return FabricNetworkUtils.invokeContract(username, FabricNetworkUtils.tradeChannel, FabricNetworkUtils.vehicleContractId,
												true, "acceptSw", id, justification);
		}

		@RequestMapping(value = "/rejectSoftware", method = RequestMethod.POST)
		public String rejectSoftware(@RequestHeader Map<String, String> headers, String id, String justification) {
			String username = securityUtils.getUserNameFromTokenHeaders(headers);
			if (username == null) {
				return errorObj("Unable to get username from headers");
			}
			return FabricNetworkUtils.invokeContract(username, FabricNetworkUtils.tradeChannel, FabricNetworkUtils.vehicleContractId,
												true, "rejectSw", id, justification);
		}

		@RequestMapping(value = "/listSystem", method = RequestMethod.GET)
		public String listSystem(@RequestHeader Map<String, String> headers) {
			String username = securityUtils.getUserNameFromTokenHeaders(headers);
			if (username == null) {
				return errorObj("Unable to get username from headers");
			}
			return FabricNetworkUtils.invokeContract(username, FabricNetworkUtils.tradeChannel, FabricNetworkUtils.vehicleContractId,
												true, "listSys");
		}

		@RequestMapping(value = "/acceptSystem", method = RequestMethod.POST)
		public String acceptSystem(@RequestHeader Map<String, String> headers, String id, String justification) {
			String username = securityUtils.getUserNameFromTokenHeaders(headers);
			if (username == null) {
				return errorObj("Unable to get username from headers");
			}
			return FabricNetworkUtils.invokeContract(username, FabricNetworkUtils.tradeChannel, FabricNetworkUtils.vehicleContractId,
												true, "acceptSys", id, justification);
		}

		@RequestMapping(value = "/rejectSystem", method = RequestMethod.POST)
		public String rejectSystem(@RequestHeader Map<String, String> headers, String id, String justification) {
			String username = securityUtils.getUserNameFromTokenHeaders(headers);
			if (username == null) {
				return errorObj("Unable to get username from headers");
			}
			return FabricNetworkUtils.invokeContract(username, FabricNetworkUtils.tradeChannel, FabricNetworkUtils.vehicleContractId,
												true, "rejectSys", id, justification);
		}

}