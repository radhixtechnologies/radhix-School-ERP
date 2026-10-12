import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'school_main_navigation.dart';
import 'teacher_dashboard.dart';
import 'parent_dashboard.dart';

class LoginScreen extends StatefulWidget {
  final bool isHindi;
  final VoidCallback onToggleLanguage;

  const LoginScreen({
    super.key,
    required this.isHindi,
    required this.onToggleLanguage,
  });

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _idController = TextEditingController(text: 'teacher@school.com');
  final _passwordController = TextEditingController(text: 'Teacher@123');
  bool _isLoading = false;
  String? _errorMessage;

  // Selected role tab: 'TEACHER', 'PARENT', 'STUDENT'
  String _selectedRoleTab = 'TEACHER';

  void _onRoleTabChanged(String role) {
    setState(() {
      _selectedRoleTab = role;
      _errorMessage = null;
      if (role == 'TEACHER') {
        _idController.text = 'teacher@school.com';
        _passwordController.text = 'Teacher@123';
      } else if (role == 'PARENT') {
        _idController.text = 'parent@school.com';
        _passwordController.text = 'Parent@123';
      } else if (role == 'STUDENT') {
        _idController.text = 'DPS-2026-001';
        _passwordController.text = 'Student@123';
      }
    });
  }

  void _handleLogin() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final session = await ApiService.login(
        _idController.text,
        _passwordController.text,
      );

      if (!mounted) return;

      // Disallow Admin access on Mobile App per user requirements
      if (session.isSchoolAdmin || session.role == 'INSTITUTE_ADMIN' || session.role == 'SUPER_ADMIN') {
        setState(() {
          _errorMessage = widget.isHindi
              ? 'एडमिन पोर्टल केवल वेब ब्राउज़र पर उपलब्ध है (http://localhost:5174)। मोबाइल ऐप केवल शिक्षक, अभिभावक एवं छात्रों के लिए है।'
              : 'Admin access is exclusively available on Web Admin (http://localhost:5174). Mobile app is strictly for Teachers, Parents, and Students.';
        });
        return;
      }

      Widget targetScreen;
      if (session.isTeacher) {
        targetScreen = TeacherDashboardScreen(
          session: session,
          isHindi: widget.isHindi,
          onToggleLanguage: widget.onToggleLanguage,
        );
      } else if (session.isParent) {
        targetScreen = ParentDashboardScreen(
          session: session,
          isHindi: widget.isHindi,
          onToggleLanguage: widget.onToggleLanguage,
        );
      } else {
        targetScreen = SchoolMainNavigationScreen(
          session: session,
          isHindi: widget.isHindi,
          onToggleLanguage: widget.onToggleLanguage,
        );
      }

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => targetScreen),
      );
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceAll('Exception: ', '');
      });
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final h = widget.isHindi;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          TextButton.icon(
            onPressed: widget.onToggleLanguage,
            icon: const Icon(Icons.language, color: Color(0xFF474A74)),
            label: Text(
              h ? 'English' : 'हिंदी',
              style: const TextStyle(
                color: Color(0xFF474A74),
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // School Branding Icon
                Center(
                  child: Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: const Color(0xFF474A74),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF474A74).withValues(alpha: 0.3),
                          blurRadius: 16,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.school_rounded,
                      size: 40,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Center(
                  child: Text(
                    h ? 'राडिक्स स्कूल ईआरपी' : 'Radhix School ERP',
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                ),
                Center(
                  child: Text(
                    h ? 'मल्टी-स्कूल प्रबंधन प्रणाली' : 'Multi-Vendor School ERP Mobile App',
                    style: const TextStyle(
                      fontSize: 13,
                      color: Color(0xFF64748B),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Role Selector Tabs (Strictly 3 Dedicated Mobile Roles: Teacher, Parent, Student)
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Row(
                    children: [
                      _buildRoleButton('TEACHER', h ? 'शिक्षक' : 'Teacher', Icons.person_outline),
                      _buildRoleButton('PARENT', h ? 'अभिभावक' : 'Parent', Icons.family_restroom),
                      _buildRoleButton('STUDENT', h ? 'छात्र' : 'Student', Icons.backpack_outlined),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Login Card
                Container(
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.04),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      if (_errorMessage != null)
                        Container(
                          padding: const EdgeInsets.all(12),
                          margin: const EdgeInsets.only(bottom: 16),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF2F2),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: const Color(0xFFFECACA)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.error_outline, color: Color(0xFFDC2626), size: 20),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _errorMessage!,
                                  style: const TextStyle(color: Color(0xFFDC2626), fontSize: 13),
                                ),
                              ),
                            ],
                          ),
                        ),

                      Text(
                        _selectedRoleTab == 'STUDENT'
                            ? (h ? 'प्रवेश संख्या (Admission No)' : 'Admission Number')
                            : (h ? 'ईमेल या मोबाइल नंबर' : 'Username or Email'),
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF475569),
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _idController,
                        decoration: InputDecoration(
                          prefixIcon: Icon(
                            _selectedRoleTab == 'STUDENT' ? Icons.badge_outlined : Icons.person_outline,
                            color: const Color(0xFF94A3B8),
                            size: 20,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                          ),
                          filled: true,
                          fillColor: const Color(0xFFF8FAFC),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        ),
                      ),
                      const SizedBox(height: 16),

                      Text(
                        h ? 'पासवर्ड (Password)' : 'Password',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF475569),
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _passwordController,
                        obscureText: true,
                        decoration: InputDecoration(
                          prefixIcon: const Icon(Icons.lock_outline, color: Color(0xFF94A3B8), size: 20),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                          ),
                          filled: true,
                          fillColor: const Color(0xFFF8FAFC),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        ),
                      ),
                      const SizedBox(height: 22),

                      ElevatedButton(
                        onPressed: _isLoading ? null : _handleLogin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF474A74),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 0,
                        ),
                        child: _isLoading
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                              )
                            : Text(
                                h ? 'लॉग इन करें' : 'Sign In',
                                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                              ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),
                // Demo Hint Card
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.touch_app, color: Color(0xFF474A74), size: 18),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          h
                              ? 'डेमो के लिए ऊपर टैब चुनकर सीधे लॉगिन करें।'
                              : 'Tap any role above to auto-fill credentials & login directly.',
                          style: const TextStyle(fontSize: 12, color: Color(0xFF475569), fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRoleButton(String role, String label, IconData icon) {
    final isSelected = _selectedRoleTab == role;
    return Expanded(
      child: GestureDetector(
        onTap: () => _onRoleTabChanged(role),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF474A74) : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            children: [
              Icon(
                icon,
                size: 18,
                color: isSelected ? Colors.white : const Color(0xFF64748B),
              ),
              const SizedBox(height: 2),
              Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                  color: isSelected ? Colors.white : const Color(0xFF64748B),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
