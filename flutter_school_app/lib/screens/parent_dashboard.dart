import 'package:flutter/material.dart';
import '../models/user_session.dart';
import '../services/api_service.dart';
import 'attendance_screen.dart';
import 'fee_screen.dart';
import 'notices_screen.dart';
import 'homework_screen.dart';
import 'login_screen.dart';
import 'bus_tracking_map_screen.dart';

class ParentDashboardScreen extends StatefulWidget {
  final UserSession session;
  final bool isHindi;
  final VoidCallback onToggleLanguage;

  const ParentDashboardScreen({
    super.key,
    required this.session,
    required this.isHindi,
    required this.onToggleLanguage,
  });

  @override
  State<ParentDashboardScreen> createState() => _ParentDashboardScreenState();
}

class _ParentDashboardScreenState extends State<ParentDashboardScreen> {
  List<dynamic> _homeworkList = [];
  bool _isLoadingHw = false;

  // Exam Marks
  final List<Map<String, dynamic>> _examMarks = [
    {'subject': 'Mathematics', 'marks': '94 / 100', 'grade': 'A1'},
    {'subject': 'Science', 'marks': '91 / 100', 'grade': 'A1'},
    {'subject': 'Hindi', 'marks': '92 / 100', 'grade': 'A1'},
    {'subject': 'Social Studies', 'marks': '89 / 100', 'grade': 'A2'},
    {'subject': 'English', 'marks': '88 / 100', 'grade': 'A2'},
  ];

  @override
  void initState() {
    super.initState();
    _loadLiveHomework();
  }

  void _loadLiveHomework() async {
    setState(() => _isLoadingHw = true);
    final data = await ApiService.getHomework(widget.session.token);
    if (mounted) {
      setState(() {
        _homeworkList = data;
        _isLoadingHw = false;
      });
    }
  }

  void _showChildProfileModal() {
    final child = widget.session.studentProfile ?? {};
    final childName = '${child['first_name'] ?? 'Aarav'} ${child['last_name'] ?? 'Kumar'}'.trim();
    final className = child['class_name'] ?? 'Class 10';
    final sectionName = child['section_name'] ?? 'Section A';
    final rollNumber = child['roll_number'] ?? '12';
    final admissionNo = child['admission_number'] ?? 'DPS-2026-001';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
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
                    CircleAvatar(
                      radius: 32,
                      backgroundColor: const Color(0xFF0F766E),
                      child: Text(
                        childName.isNotEmpty ? childName.substring(0, 1) : 'A',
                        style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 18),
                    ),
                  ],
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        childName,
                        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '$className - $sectionName  •  Roll: $rollNumber',
                        style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                      ),
                      Text(
                        'Admission No: $admissionNo',
                        style: const TextStyle(fontSize: 12, color: Color(0xFF0D9488), fontWeight: FontWeight.bold),
                      ),
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
              child: Row(
                children: [
                  const Icon(Icons.verified, color: Color(0xFF059669), size: 28),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'आज की उपस्थिति: उपस्थित (Present Today)',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF065F46)),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'चेक-इन: 08:12 AM  •  कक्षा अध्यापिका (Sunita Sharma द्वारा सत्यापित)',
                          style: TextStyle(fontSize: 11, color: Color(0xFF047857)),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF059669),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text('PRESENT', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Profile Attributes Table
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  _profileItemRow('Overall Attendance', '96.4% (108 / 112 Days)', isHighlight: true),
                  _profileItemRow('Class Teacher', 'Smt. Sunita Sharma (Senior Faculty)'),
                  _profileItemRow('Date of Birth', '15 Aug 2010'),
                  _profileItemRow('Blood Group', 'O+ (Positive)'),
                  _profileItemRow('Father / Guardian', 'Ramesh Kumar (+91 98444 55566)'),
                  _profileItemRow('Address', 'Sector 14, Rohini, New Delhi - 110085'),
                  _profileItemRow('School Transport', 'Bus Route No. 12 (DL-1P-9821)'),
                ],
              ),
            ),

            const SizedBox(height: 18),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(ctx),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F766E),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('बंद करें (Close)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  static Widget _profileItemRow(String label, String value, {bool isHighlight = false}) {
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

  void _showHomeworkDetailModal(Map<String, dynamic> hw) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE0E7FF),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    "${hw['subject'] ?? 'Subject'}  •  ${hw['class_name'] ?? 'Class 10'} (${hw['section_name'] ?? 'Sec A'})",
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFF3730A3)),
                  ),
                ),
                IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
              ],
            ),
            const SizedBox(height: 10),
            Text(hw['title'] ?? '', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
            const SizedBox(height: 6),
            Text(hw['description'] ?? 'No additional description provided.', style: const TextStyle(fontSize: 13, color: Color(0xFF475569))),
            const SizedBox(height: 14),
            Row(
              children: [
                const Icon(Icons.person, size: 16, color: Color(0xFF64748B)),
                const SizedBox(width: 4),
                Text('Teacher: ${hw['teacher_name'] ?? 'Sunita Sharma'}', style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                const Spacer(),
                const Icon(Icons.calendar_today, size: 14, color: Color(0xFF64748B)),
                const SizedBox(width: 4),
                Text('Due: ${hw['due_date'] ?? 'Upcoming'}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFD97706))),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F766E),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  Navigator.pop(ctx);
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => HomeworkScreen(session: widget.session, isHindi: widget.isHindi)),
                  );
                },
                child: const Text('गृहकार्य पोर्टल खोलें (Open Homework Portal)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showLeaveDialog() {
    final reasonCtrl = TextEditingController();
    final daysCtrl = TextEditingController(text: '1');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.note_alt, color: Color(0xFF0D9488)),
            SizedBox(width: 8),
            Text('Apply Child Leave'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: daysCtrl,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Number of Days',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: reasonCtrl,
              maxLines: 2,
              decoration: const InputDecoration(
                labelText: 'Reason for Leave',
                hintText: 'e.g. Mild fever / Family travel',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0D9488),
            ),
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Leave application submitted to Class Teacher!'),
                  backgroundColor: Color(0xFF0D9488),
                ),
              );
            },
            child: const Text('Submit Leave', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _showBusTrackingModal() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => BusTrackingMapScreen(
          session: widget.session,
          isHindi: widget.isHindi,
        ),
      ),
    );
  }

  void _showReportCardModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Quarterly Report Card 2026',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFECFDF5),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Text(
                    'Overall: 90.8% (A1)',
                    style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF059669)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Table(
              border: TableBorder.all(color: const Color(0xFFE2E8F0)),
              children: [
                const TableRow(
                  decoration: BoxDecoration(color: Color(0xFFF1F5F9)),
                  children: [
                    Padding(padding: EdgeInsets.all(8), child: Text('Subject', style: TextStyle(fontWeight: FontWeight.bold))),
                    Padding(padding: EdgeInsets.all(8), child: Text('Marks', style: TextStyle(fontWeight: FontWeight.bold))),
                    Padding(padding: EdgeInsets.all(8), child: Text('Grade', style: TextStyle(fontWeight: FontWeight.bold))),
                  ],
                ),
                ..._examMarks.map((m) => TableRow(
                      children: [
                        Padding(padding: const EdgeInsets.all(8), child: Text(m['subject']!)),
                        Padding(padding: const EdgeInsets.all(8), child: Text(m['marks']!)),
                        Padding(
                          padding: const EdgeInsets.all(8),
                          child: Text(
                            m['grade']!,
                            style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0D9488)),
                          ),
                        ),
                      ],
                    )),
              ],
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: const Text(
                'Teacher Remark: "Aarav is well-disciplined and consistently performs excellently in Mathematics & Science."',
                style: TextStyle(fontStyle: FontStyle.italic, color: Color(0xFF475569), fontSize: 12),
              ),
            ),
            const SizedBox(height: 14),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final child = widget.session.studentProfile ?? {};
    final childName = '${child['first_name'] ?? 'Aarav'} ${child['last_name'] ?? 'Kumar'}'.trim();
    final className = child['class_name'] ?? 'Class 10';
    final sectionName = child['section_name'] ?? 'Section A';
    final rollNumber = child['roll_number'] ?? '12';
    final admissionNo = child['admission_number'] ?? 'DPS-2026-001';
    final instName = widget.session.instituteName.isNotEmpty
        ? widget.session.instituteName
        : 'Delhi Public Academy';

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F766E), // Elegant Teal for Parents
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              instName,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const Text(
              'School Parent Portal',
              style: TextStyle(fontSize: 11, color: Colors.white70),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            tooltip: 'Logout',
            onPressed: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (_) => LoginScreen(
                    isHindi: widget.isHindi,
                    onToggleLanguage: widget.onToggleLanguage,
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
            // Parent Greeting & Child Identity Card (Tappable for Full Profile & Attendance)
            InkWell(
              onTap: _showChildProfileModal,
              borderRadius: BorderRadius.circular(20),
              child: Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0F766E), Color(0xFF115E59)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF0F766E).withAlpha(70),
                      blurRadius: 14,
                      offset: const Offset(0, 6),
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
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white24,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.family_restroom, size: 14, color: Colors.white),
                              SizedBox(width: 6),
                              Text(
                                'STUDENT WARD',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Today's attendance badge right on the card header
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFF059669),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: const Color(0xFF6EE7B7)),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.verified, size: 12, color: Colors.white),
                              SizedBox(width: 4),
                              Text(
                                'TODAY: PRESENT',
                                style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Stack(
                          alignment: Alignment.bottomRight,
                          children: [
                            Container(
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(color: const Color(0xFF34D399), width: 2.5),
                              ),
                              child: CircleAvatar(
                                radius: 26,
                                backgroundColor: Colors.white,
                                child: Text(
                                  childName.isNotEmpty ? childName.substring(0, 1) : 'A',
                                  style: const TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF0F766E),
                                  ),
                                ),
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
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                childName,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '$className - $sectionName  •  Roll: $rollNumber  •  Adm: $admissionNo',
                                style: const TextStyle(color: Colors.white70, fontSize: 13),
                              ),
                              const SizedBox(height: 3),
                              Row(
                                children: [
                                  const Icon(Icons.touch_app, color: Color(0xFF99F6E4), size: 12),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Tap to view student profile & record >',
                                    style: TextStyle(color: Colors.teal.shade100, fontSize: 11, fontWeight: FontWeight.w600),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Today's Child Status Quick Bar
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _statusItem(
                    icon: Icons.check_circle,
                    color: const Color(0xFF10B981),
                    title: "Today's Status",
                    value: 'Present (08:12 AM)',
                  ),
                  Container(height: 36, width: 1, color: const Color(0xFFE2E8F0)),
                  _statusItem(
                    icon: Icons.calendar_today,
                    color: const Color(0xFF0EA5E9),
                    title: 'Monthly Avg',
                    value: '96.4% (40/42)',
                  ),
                ],
              ),
            ),

            const SizedBox(height: 14),

            // Fee Due Alert & Quick Pay
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF3C7),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFFDE68A)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.error_outline, color: Color(0xFFD97706), size: 28),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Pending School Fee Dues',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF92400E),
                          ),
                        ),
                        Text(
                          '₹5,000 (Q2 Tuition Fee  •  Due: 31 Oct)',
                          style: TextStyle(fontSize: 11, color: Color(0xFFB45309)),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFD97706),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => FeeScreen(
                            session: widget.session,
                            isHindi: widget.isHindi,
                          ),
                        ),
                      );
                    },
                    child: const Text(
                      'Pay Now',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 22),

            const Text(
              'Parent Services',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 12),

            // Primary Modules Grid
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.1,
              children: [
                _parentTile(
                  icon: Icons.calendar_month,
                  color: const Color(0xFF10B981),
                  title: 'Attendance Record',
                  subtitle: 'Full Month Log',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => AttendanceScreen(
                          session: widget.session,
                          isHindi: widget.isHindi,
                        ),
                      ),
                    );
                  },
                ),
                _parentTile(
                  icon: Icons.account_balance_wallet,
                  color: const Color(0xFF0EA5E9),
                  title: 'Fee Ledger & Rec.',
                  subtitle: 'Pay via UPI/Card',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => FeeScreen(
                          session: widget.session,
                          isHindi: widget.isHindi,
                        ),
                      ),
                    );
                  },
                ),
                _parentTile(
                  icon: Icons.military_tech,
                  color: const Color(0xFFF59E0B),
                  title: 'Report Card',
                  subtitle: 'Grade A1 (90.8%)',
                  onTap: _showReportCardModal,
                ),
                _parentTile(
                  icon: Icons.directions_bus,
                  color: const Color(0xFFD97706),
                  title: 'Bus GPS Tracking',
                  subtitle: 'Live Telematics Map',
                  onTap: _showBusTrackingModal,
                ),
                _parentTile(
                  icon: Icons.notifications_active,
                  color: const Color(0xFF8B5CF6),
                  title: 'School Notices',
                  subtitle: 'Sports & Circulars',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => NoticesScreen(
                          session: widget.session,
                          isHindi: widget.isHindi,
                        ),
                      ),
                    );
                  },
                ),
                _parentTile(
                  icon: Icons.edit_note,
                  color: const Color(0xFF0D9488),
                  title: 'Apply Leave',
                  subtitle: 'Teacher Connect',
                  onTap: _showLeaveDialog,
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Child's Daily Homework & Diary
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Today's Homework Diary",
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0F172A),
                  ),
                ),
                InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => HomeworkScreen(session: widget.session, isHindi: widget.isHindi),
                      ),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE0E7FF),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'View All >',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF3730A3)),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            _isLoadingHw
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(20),
                      child: CircularProgressIndicator(color: Color(0xFF0F766E)),
                    ),
                  )
                : _homeworkList.isEmpty
                    ? Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: const Center(
                          child: Text(
                            'कोई लंबित गृहकार्य नहीं है (No Pending Homework)',
                            style: TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.bold),
                          ),
                        ),
                      )
                    : ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _homeworkList.length,
                        separatorBuilder: (context, index) => const SizedBox(height: 8),
                        itemBuilder: (ctx, i) {
                          final hw = _homeworkList[i];
                          final isSubmitted = hw['is_submitted'] == true || hw['status'] == 'SUBMITTED' || hw['status'] == 'CHECKED';
                          final isChecked = hw['status'] == 'CHECKED';

                          return InkWell(
                            onTap: () => _showHomeworkDetailModal(hw),
                            borderRadius: BorderRadius.circular(12),
                            child: Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: const Color(0xFFE2E8F0)),
                              ),
                              child: Row(
                                children: [
                                  CircleAvatar(
                                    backgroundColor: isChecked
                                        ? const Color(0xFFECFDF5)
                                        : isSubmitted
                                            ? const Color(0xFFEEF2FF)
                                            : const Color(0xFFFEF3C7),
                                    child: Icon(
                                      Icons.assignment,
                                      color: isChecked
                                          ? const Color(0xFF059669)
                                          : isSubmitted
                                              ? const Color(0xFF4F46E5)
                                              : const Color(0xFFD97706),
                                      size: 20,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                              decoration: BoxDecoration(
                                                color: const Color(0xFFF1F5F9),
                                                borderRadius: BorderRadius.circular(6),
                                              ),
                                              child: Text(
                                                "${hw['class_name'] ?? 'Class 10'} • ${hw['section_name'] ?? 'Sec A'}",
                                                style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF475569)),
                                              ),
                                            ),
                                            const SizedBox(width: 6),
                                            Expanded(
                                              child: Text(
                                                hw['subject'] ?? 'Subject',
                                                style: const TextStyle(
                                                  fontSize: 11,
                                                  fontWeight: FontWeight.bold,
                                                  color: Color(0xFF0F766E),
                                                ),
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          hw['title'] ?? '',
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 13,
                                            color: Color(0xFF1E293B),
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          'Teacher: ${hw['teacher_name'] ?? hw['teacher'] ?? 'Sunita Sharma'}  •  Due: ${hw['due_date'] ?? hw['due'] ?? 'Upcoming'}',
                                          style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: isChecked
                                          ? const Color(0xFFECFDF5)
                                          : isSubmitted
                                              ? const Color(0xFFEFF6FF)
                                              : const Color(0xFFFEF3C7),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      isChecked
                                          ? 'Checked'
                                          : isSubmitted
                                              ? 'Submitted'
                                              : 'Pending',
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: isChecked
                                            ? const Color(0xFF059669)
                                            : isSubmitted
                                                ? const Color(0xFF2563EB)
                                                : const Color(0xFFB45309),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
          ],
        ),
      ),
    );
  }

  Widget _statusItem({
    required IconData icon,
    required Color color,
    required String title,
    required String value,
  }) {
    return Row(
      children: [
        Icon(icon, color: color, size: 22),
        const SizedBox(width: 8),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
            Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
          ],
        ),
      ],
    );
  }

  Widget _parentTile({
    required IconData icon,
    required Color color,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircleAvatar(
                backgroundColor: color.withAlpha(25),
                child: Icon(icon, color: color),
              ),
              const Spacer(),
              Text(
                title,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
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
