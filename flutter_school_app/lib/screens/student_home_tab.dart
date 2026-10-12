import 'package:flutter/material.dart';
import '../models/user_session.dart';
import 'attendance_screen.dart';
import 'fee_screen.dart';
import 'notices_screen.dart';
import 'homework_screen.dart';

class StudentHomeTab extends StatelessWidget {
  final UserSession session;
  final bool isHindi;
  final VoidCallback onToggleLanguage;
  final Function(int) onNavigateTab;

  const StudentHomeTab({
    super.key,
    required this.session,
    required this.isHindi,
    required this.onToggleLanguage,
    required this.onNavigateTab,
  });

  final Color _navyColor = const Color(0xFF474A74);

  @override
  Widget build(BuildContext context) {
    final stu = session.studentProfile;
    final name = stu != null
        ? '${stu['first_name'] ?? ''} ${stu['last_name'] ?? ''}'.trim()
        : 'Aarav Kumar';
    final sub = stu != null
        ? '${stu['class_name'] ?? 'Class 10'}, 2026-27'
        : 'Class 10, 2026-27';

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Curved Profile Bar
          // Top Curved Profile Bar with Today Attendance Badge & Tap-to-View Profile
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: _navyColor,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: _navyColor.withAlpha(50),
                  blurRadius: 16,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Row(
              children: [
                InkWell(
                  onTap: () => _showStudentProfileModal(context),
                  borderRadius: BorderRadius.circular(24),
                  child: Stack(
                    alignment: Alignment.bottomRight,
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: const Color(0xFF34D399), width: 2),
                        ),
                        child: const CircleAvatar(
                          radius: 24,
                          backgroundColor: Color(0xFFCBD5E1),
                          child: Icon(Icons.person, color: Color(0xFF474A74), size: 28),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.all(2),
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 14),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: InkWell(
                    onTap: () => _showStudentProfileModal(context),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          name.isEmpty ? 'Aarav Kumar' : name,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          sub,
                          style: const TextStyle(fontSize: 12, color: Colors.white70),
                        ),
                        const SizedBox(height: 4),
                        // Today's Attendance Badge (User requirement!)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
                          decoration: BoxDecoration(
                            color: const Color(0xFF059669),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: const Color(0xFF6EE7B7)),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.verified, size: 11, color: Colors.white),
                              SizedBox(width: 4),
                              Text(
                                'आज: उपस्थित (Present 08:12 AM)',
                                style: TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.search, color: Colors.white),
                  tooltip: 'Search ERP',
                  onPressed: () => _showSearchModal(context),
                ),
                Stack(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.notifications_none, color: Colors.white),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => NoticesScreen(session: session, isHindi: isHindi),
                          ),
                        );
                      },
                    ),
                    Positioned(
                      right: 12,
                      top: 12,
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: Color(0xFFEF4444),
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 22),

          // Section Title: My Favourites / Dashboards
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'My Favourites',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  Text(
                    'Dashboards',
                    style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 14),

          // 6 Pastel Cards Grid Matching Screenshot 1
          GridView.count(
            crossAxisCount: 3,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 0.95,
            children: [
              _pastelModuleCard(
                title: 'My Classes',
                bgColor: const Color(0xFFE8F8F0),
                iconColor: const Color(0xFF059669),
                icon: Icons.school,
                onTap: () => onNavigateTab(1),
              ),
              _pastelModuleCard(
                title: 'Attendance',
                bgColor: const Color(0xFFEBF5FF),
                iconColor: const Color(0xFF2563EB),
                icon: Icons.assignment_ind,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => AttendanceScreen(session: session, isHindi: isHindi),
                    ),
                  );
                },
              ),
              _pastelModuleCard(
                title: 'Home Work',
                bgColor: const Color(0xFFFEF6E9),
                iconColor: const Color(0xFFD97706),
                icon: Icons.menu_book,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => HomeworkScreen(session: session, isHindi: isHindi),
                    ),
                  );
                },
              ),
              _pastelModuleCard(
                title: 'Assignment',
                bgColor: const Color(0xFFF3E8FF),
                iconColor: const Color(0xFF7C3AED),
                icon: Icons.assignment,
                onTap: () {
                  // User requirement: Tapping opens assignments to do
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
              _pastelModuleCard(
                title: 'Pay Fee',
                bgColor: const Color(0xFFE8FBF4),
                iconColor: const Color(0xFF0D9488),
                icon: Icons.account_balance_wallet,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => FeeScreen(session: session, isHindi: isHindi),
                    ),
                  );
                },
              ),
              _pastelModuleCard(
                title: 'My Result',
                bgColor: const Color(0xFFFDF2F4),
                iconColor: const Color(0xFFE11D48),
                icon: Icons.insert_chart,
                onTap: () {
                  _showResultDialog(context);
                },
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Section Title: Schedule with working "View All" (Switches to Tab 2: Calendar)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Schedule',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
              ),
              InkWell(
                onTap: () => onNavigateTab(2), // Switches to full calendar tab
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEEF2FF),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'View All >',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: _navyColor),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Schedule Timeline Items
          _scheduleTimelineItem(
            day: '25',
            month: 'Jan',
            badgeColor: _navyColor,
            title: 'Economy Class',
            time: '09:00 - 11:00 AM',
            room: 'Room 02, 2nd Floor',
          ),
          const SizedBox(height: 10),
          _scheduleTimelineItem(
            day: '26',
            month: 'Jan',
            badgeColor: const Color(0xFFF97316),
            title: 'Geography Class',
            time: '09:00 - 11:00 AM',
            room: 'Room 02, 2nd Floor',
          ),
          const SizedBox(height: 10),
          _scheduleTimelineItem(
            day: '27',
            month: 'Jan',
            badgeColor: const Color(0xFF0284C7),
            title: 'Accounting Class',
            time: '09:00 - 11:00 AM',
            room: 'Room 02, 2nd Floor',
          ),
        ],
      ),
    );
  }

  Widget _pastelModuleCard({
    required String title,
    required Color bgColor,
    required Color iconColor,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(16)),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: iconColor, size: 26),
            const SizedBox(height: 8),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _scheduleTimelineItem({
    required String day,
    required String month,
    required Color badgeColor,
    required String title,
    required String time,
    required String room,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(color: badgeColor, borderRadius: BorderRadius.circular(12)),
            child: Column(
              children: [
                Text(day, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                Text(month, style: const TextStyle(fontSize: 11, color: Colors.white70)),
              ],
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
                const SizedBox(height: 2),
                Text('$time  •  $room', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showResultDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => const Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('My Result  •  Class 10-A', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 12),
            ListTile(leading: Icon(Icons.star, color: Colors.amber), title: Text('Overall Grade: A1 (90.8%)'), subtitle: Text('Rank: 2nd in Class')),
            Divider(),
            ListTile(title: Text('Mathematics: 94 / 100 (A1)')),
            ListTile(title: Text('Science: 91 / 100 (A1)')),
            ListTile(title: Text('English: 88 / 100 (A2)')),
          ],
        ),
      ),
    );
  }

  void _showStudentProfileModal(BuildContext context) {
    final stu = session.studentProfile ?? {};
    final studentName = stu['first_name'] != null
        ? '${stu['first_name']} ${stu['last_name'] ?? ''}'.trim()
        : 'Aarav Kumar';
    final className = stu['class_name'] ?? 'Class 10';
    final sectionName = stu['section_name'] ?? 'Section A';
    final rollNumber = stu['roll_number'] ?? '12';
    final admissionNo = stu['admission_number'] ?? 'DPS-2026-001';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(22),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Stack(
                  alignment: Alignment.bottomRight,
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFF10B981), width: 2.5),
                      ),
                      child: const CircleAvatar(
                        radius: 30,
                        backgroundColor: Color(0xFF474A74),
                        child: Icon(Icons.person, color: Colors.white, size: 34),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(2),
                      decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                      child: const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 16),
                    ),
                  ],
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(studentName, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                      const SizedBox(height: 2),
                      Text('$className - $sectionName  •  Roll No: $rollNumber', style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.w600)),
                      Text('Adm No: $admissionNo', style: const TextStyle(fontSize: 12, color: Color(0xFF474A74), fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Today's Attendance Real-Time Status Card
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFECFDF5),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFA7F3D0)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.verified, color: Color(0xFF059669), size: 28),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('आज की उपस्थिति: उपस्थित (Present Today)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF065F46))),
                        SizedBox(height: 2),
                        Text('बायोमेट्रिक / कक्षा अध्यापिका (Sunita Sharma): 08:12 AM', style: TextStyle(fontSize: 11, color: Color(0xFF047857))),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Profile info table
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  _infoRow('कुल उपस्थिति (Overall Att.)', '96.4% (108 / 112 Days)', isHighlight: true),
                  _infoRow('जन्म तिथि (Date of Birth)', '15 August 2010'),
                  _infoRow('रक्त समूह (Blood Group)', 'O+ (Positive)'),
                  _infoRow('अभिभावक (Guardian)', 'Ramesh Kumar (+91 98444 55566)'),
                  _infoRow('पता (Address)', 'Sector 14, Rohini, New Delhi - 110085'),
                  _infoRow('सत्र (Academic Session)', '2026-27 (Term 1 Ongoing)'),
                ],
              ),
            ),
            const SizedBox(height: 16),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: _navyColor,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                onPressed: () => Navigator.pop(ctx),
                child: const Text('बंद करें (Close)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  static Widget _infoRow(String label, String value, {bool isHighlight = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
          Text(
            value,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: isHighlight ? const Color(0xFF059669) : const Color(0xFF1E293B),
            ),
          ),
        ],
      ),
    );
  }

  void _showSearchModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        String query = '';
        return StatefulBuilder(
          builder: (context, setModalState) {
            final allItems = [
              {
                'type': 'HOMEWORK',
                'title': 'Ray Optics & Mirror Formula Numerical',
                'subtitle': 'Physics • Due: 14 Oct 2026',
                'icon': Icons.assignment,
                'action': () {
                  Navigator.pop(ctx);
                  Navigator.push(context, MaterialPageRoute(builder: (_) => HomeworkScreen(session: session, isHindi: isHindi)));
                },
              },
              {
                'type': 'HOMEWORK',
                'title': 'Quadratic Equations Exercise 4.3',
                'subtitle': 'Mathematics • Due: 15 Oct 2026',
                'icon': Icons.assignment,
                'action': () {
                  Navigator.pop(ctx);
                  Navigator.push(context, MaterialPageRoute(builder: (_) => HomeworkScreen(session: session, isHindi: isHindi)));
                },
              },
              {
                'type': 'SCHEDULE',
                'title': 'Physics Ray Optics Period',
                'subtitle': 'Today 09:35 - 10:30 AM • Lab 2',
                'icon': Icons.schedule,
                'action': () {
                  Navigator.pop(ctx);
                  onNavigateTab(2);
                },
              },
              {
                'type': 'NOTICE',
                'title': 'Annual Sports Meet 2026 Announcement',
                'subtitle': 'Event • 25th October 2026',
                'icon': Icons.campaign,
                'action': () {
                  Navigator.pop(ctx);
                  Navigator.push(context, MaterialPageRoute(builder: (_) => NoticesScreen(session: session, isHindi: isHindi)));
                },
              },
              {
                'type': 'FEE',
                'title': 'Quarter 2 Transport Fee (₹4,500)',
                'subtitle': 'Due: 31st October 2026',
                'icon': Icons.account_balance_wallet,
                'action': () {
                  Navigator.pop(ctx);
                  Navigator.push(context, MaterialPageRoute(builder: (_) => FeeScreen(session: session, isHindi: isHindi)));
                },
              },
            ];

            final results = allItems.where((item) {
              if (query.isEmpty) return true;
              final q = query.toLowerCase();
              return (item['title'] as String).toLowerCase().contains(q) ||
                  (item['subtitle'] as String).toLowerCase().contains(q);
            }).toList();

            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.search, color: Color(0xFF474A74)),
                      const SizedBox(width: 8),
                      Text(
                        isHindi ? 'खोजें (Search ERP Modules)' : 'Search ERP Modules',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const Spacer(),
                      IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                    ],
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    autofocus: true,
                    onChanged: (val) => setModalState(() => query = val),
                    decoration: InputDecoration(
                      hintText: isHindi ? 'गृहकार्य, विषय, सूचना या शुल्क खोजें...' : 'Search homework, subjects, notices, fee...',
                      prefixIcon: const Icon(Icons.search, size: 20),
                      filled: true,
                      fillColor: const Color(0xFFF1F5F9),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    ),
                  ),
                  const SizedBox(height: 14),
                  ConstrainedBox(
                    constraints: const BoxConstraints(maxHeight: 280),
                    child: results.isEmpty
                        ? const Center(
                            child: Padding(
                              padding: EdgeInsets.all(20),
                              child: Text('कोई परिणाम नहीं मिला (No results found)', style: TextStyle(color: Colors.grey)),
                            ),
                          )
                        : ListView.separated(
                            shrinkWrap: true,
                            itemCount: results.length,
                            separatorBuilder: (context, index) => const Divider(height: 1),
                            itemBuilder: (context, index) {
                              final it = results[index];
                              return ListTile(
                                contentPadding: EdgeInsets.zero,
                                leading: CircleAvatar(
                                  backgroundColor: const Color(0xFFEEF2FF),
                                  child: Icon(it['icon'] as IconData, color: const Color(0xFF474A74), size: 20),
                                ),
                                title: Text(it['title'] as String, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                                subtitle: Text(it['subtitle'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                                trailing: const Icon(Icons.chevron_right, size: 18, color: Colors.grey),
                                onTap: it['action'] as VoidCallback,
                              );
                            },
                          ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}
