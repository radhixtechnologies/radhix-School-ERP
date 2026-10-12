import 'package:flutter/material.dart';
import '../models/user_session.dart';
import 'attendance_screen.dart';
import 'notices_screen.dart';
import 'fee_screen.dart';
import 'login_screen.dart';
import 'homework_screen.dart';

class StudentDashboardScreen extends StatelessWidget {
  final UserSession session;
  final bool isHindi;
  final VoidCallback onToggleLanguage;

  const StudentDashboardScreen({
    super.key,
    required this.session,
    required this.isHindi,
    required this.onToggleLanguage,
  });

  @override
  Widget build(BuildContext context) {
    final isSchool = session.isSchool;
    final stu = session.studentProfile;
    final studentName = stu != null
        ? '${stu['first_name']} ${stu['last_name'] ?? ''}'.trim()
        : session.username;

    final primaryColor =
        isSchool ? const Color(0xFF7C3AED) : const Color(0xFF0284C7);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(session.instituteName),
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
            onPressed: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (_) => LoginScreen(
                    isHindi: isHindi,
                    onToggleLanguage: onToggleLanguage,
                  ),
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Student Profile Identity Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: isSchool
                      ? [const Color(0xFF7C3AED), const Color(0xFF4F46E5)]
                      : [const Color(0xFF0284C7), const Color(0xFF0369A1)],
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: primaryColor.withAlpha(76),
                    blurRadius: 15,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withAlpha(51),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          isSchool ? 'SCHOOL ERP' : 'COLLEGE ERP',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981),
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withAlpha(30),
                              blurRadius: 4,
                            ),
                          ],
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.check_circle, size: 12, color: Colors.white),
                            SizedBox(width: 4),
                            Text(
                              'TODAY: PRESENT (08:12 AM)',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.3,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Container(
                        width: 52,
                        height: 52,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white.withAlpha(50),
                          border: Border.all(color: const Color(0xFF10B981), width: 2.5),
                        ),
                        child: const Center(
                          child: Icon(Icons.person, color: Colors.white, size: 30),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              studentName,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 3),
                            Text(
                              isSchool
                                  ? 'Class 10 - Section A  •  Roll No: 12'
                                  : 'B.Tech (CSE) - Semester 4',
                              style: const TextStyle(color: Colors.white70, fontSize: 13),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),
            const Text(
              'Quick Features',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 14),

            // Feature Grid
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 14,
              mainAxisSpacing: 14,
              children: [
                _menuCard(
                  context,
                  title: 'Attendance',
                  subtitle: '96% Overall Log',
                  icon: Icons.calendar_today,
                  color: const Color(0xFF10B981),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => AttendanceScreen(
                          session: session,
                          isHindi: isHindi,
                        ),
                      ),
                    );
                  },
                ),
                _menuCard(
                  context,
                  title: 'Notices',
                  subtitle: 'Circulars & Alerts',
                  icon: Icons.notifications_active,
                  color: const Color(0xFFF59E0B),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => NoticesScreen(
                          session: session,
                          isHindi: isHindi,
                        ),
                      ),
                    );
                  },
                ),
                _menuCard(
                  context,
                  title: isSchool ? 'Homework' : 'Curriculum',
                  subtitle: isSchool ? 'Pending Tasks & Deadlines' : 'Credits & Labs',
                  icon: Icons.assignment,
                  color: const Color(0xFF8B5CF6),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => HomeworkScreen(
                          session: session,
                          isHindi: isHindi,
                          initialFilter: 'PENDING',
                        ),
                      ),
                    );
                  },
                ),
                _menuCard(
                  context,
                  title: 'Fee Payment',
                  subtitle: 'Pay via UPI/Card',
                  icon: Icons.account_balance_wallet,
                  color: const Color(0xFF0EA5E9),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => FeeScreen(
                          session: session,
                          isHindi: isHindi,
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _menuCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircleAvatar(
                backgroundColor: color.withAlpha(30),
                child: Icon(icon, color: color),
              ),
              const Spacer(),
              Text(
                title,
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
