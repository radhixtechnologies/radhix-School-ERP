class UserSession {
  final String token;
  final String userId;
  final String username;
  final String email;
  final String phone;
  final String role; // "INSTITUTE_ADMIN", "PARENT", "STUDENT", "TEACHER", "SUPER_ADMIN"
  final String instituteId;
  final String instituteName;
  final String instituteCode;
  final String instituteType; // "SCHOOL" or "COLLEGE"
  final Map<String, dynamic>? studentProfile;
  final Map<String, dynamic>? staffProfile;

  UserSession({
    required this.token,
    required this.userId,
    required this.username,
    this.email = '',
    this.phone = '',
    required this.role,
    required this.instituteId,
    required this.instituteName,
    required this.instituteCode,
    required this.instituteType,
    this.studentProfile,
    this.staffProfile,
  });

  bool get isSchool => instituteType.toUpperCase() == "SCHOOL";
  bool get isCollege => instituteType.toUpperCase() == "COLLEGE";

  bool get isSchoolAdmin => (role == "INSTITUTE_ADMIN" || role == "ADMIN") && isSchool;
  bool get isCollegeAdmin => (role == "INSTITUTE_ADMIN" || role == "ADMIN") && isCollege;
  bool get isParent => role == "PARENT";
  bool get isStudent => role == "STUDENT";
  bool get isTeacher => role == "TEACHER" || role == "PROFESSOR";

  String get displayName {
    if (isParent) {
      final parentName = studentProfile?['parent_name'];
      if (parentName != null && parentName.toString().isNotEmpty) {
        return parentName.toString();
      }
      return 'Parent / ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂµÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢';
    }
    if (isSchoolAdmin) {
      if (staffProfile != null) {
        return '${staffProfile!['first_name'] ?? ''} ${staffProfile!['last_name'] ?? ''}'.trim();
      }
      return 'Dr. Sunita Rao (Principal)';
    }
    if (isCollegeAdmin) {
      if (staffProfile != null) {
        return '${staffProfile!['first_name'] ?? ''} ${staffProfile!['last_name'] ?? ''}'.trim();
      }
      return 'Dr. Arvind Saxena (Director)';
    }
    if (studentProfile != null) {
      return '${studentProfile!['first_name'] ?? ''} ${studentProfile!['last_name'] ?? ''}'.trim();
    }
    return username;
  }

  factory UserSession.fromJson(Map<String, dynamic> json) {
    final user = json['user'] ?? {};
    final inst = json['institute'] ?? {};
    return UserSession(
      token: json['token'] ?? '',
      userId: user['id'] ?? '',
      username: user['username'] ?? '',
      email: user['email'] ?? '',
      phone: user['phone'] ?? '',
      role: user['role'] ?? 'STUDENT',
      instituteId: inst['id'] ?? '',
      instituteName: inst['name'] ?? '',
      instituteCode: inst['code'] ?? '',
      instituteType: inst['type'] ?? 'SCHOOL',
      studentProfile: json['studentProfile'],
      staffProfile: json['staffProfile'],
    );
  }
}
