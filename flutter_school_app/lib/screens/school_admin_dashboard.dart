import 'package:flutter/material.dart';
import '../models/user_session.dart';
import '../services/api_service.dart';
import '../services/theme_service.dart';
import 'login_screen.dart';

class SchoolAdminDashboardScreen extends StatefulWidget {
  final UserSession session;
  final bool isHindi;
  final VoidCallback onToggleLanguage;

  const SchoolAdminDashboardScreen({
    super.key,
    required this.session,
    required this.isHindi,
    required this.onToggleLanguage,
  });

  @override
  State<SchoolAdminDashboardScreen> createState() =>
      _SchoolAdminDashboardScreenState();
}

class _SchoolAdminDashboardScreenState
    extends State<SchoolAdminDashboardScreen> {
  // Sample classes data
  final List<Map<String, dynamic>> _classes = [
    {
      'name': 'Class 10',
      'section': 'Sec A',
      'students': 42,
      'attendance': '95.2%',
      'teacher': 'Smt. Sunita Sharma',
    },
    {
      'name': 'Class 10',
      'section': 'Sec B',
      'students': 40,
      'attendance': '92.5%',
      'teacher': 'Shri R. K. Gupta',
    },
    {
      'name': 'Class 9',
      'section': 'Sec A',
      'students': 45,
      'attendance': '96.0%',
      'teacher': 'Ms. Anjali Verma',
    },
    {
      'name': 'Class 9',
      'section': 'Sec B',
      'students': 44,
      'attendance': '91.8%',
      'teacher': 'Shri Mohan Lal',
    },
    {
      'name': 'Class 11',
      'section': 'Sci A',
      'students': 38,
      'attendance': '97.4%',
      'teacher': 'Dr. V. K. Mishra',
    },
    {
      'name': 'Class 12',
      'section': 'Sci A',
      'students': 36,
      'attendance': '98.1%',
      'teacher': 'Dr. S. K. Roy',
    },
  ];

  // Notices
  final List<Map<String, dynamic>> _notices = [
    {
      'title': 'वार्षिक खेलकूद महोत्सव 2026 पंजीकरण प्रारंभ',
      'date': '08 Oct 2026',
      'target': 'All Parents & Students',
      'category': 'SPORTS',
    },
    {
      'title': 'Class 10 & 12 Pre-Board Exam Datesheet Announced',
      'date': '06 Oct 2026',
      'target': 'High School',
      'category': 'EXAM',
    },
    {
      'title': 'Monthly PTM Schedule - Saturday 9:00 AM',
      'date': '04 Oct 2026',
      'target': 'Parents',
      'category': 'PTM',
    },
  ];

  // Admission inquiries
  final List<Map<String, dynamic>> _admissions = [
    {
      'student': 'Rohan Das',
      'class': 'Class 9th',
      'parent': 'Manoj Das',
      'status': 'Pending',
    },
    {
      'student': 'Sneha Patil',
      'class': 'Class 6th',
      'parent': 'Santosh Patil',
      'status': 'Pending',
    },
  ];

  List<dynamic> _allHomework = [];
  bool _isLoadingHomework = false;

  @override
  void initState() {
    super.initState();
    _loadHomework();
  }

  Future<void> _loadHomework() async {
    setState(() => _isLoadingHomework = true);
    final list = await ApiService.getAllHomeworkForAdmin(widget.session.token);
    if (mounted) {
      setState(() {
        _allHomework = list;
        _isLoadingHomework = false;
      });
    }
  }

  void _showNoticeDialog() {
    final titleCtrl = TextEditingController();
    final bodyCtrl = TextEditingController();
    final h = widget.isHindi;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            const Icon(Icons.campaign, color: Color(0xFF7C3AED)),
            const SizedBox(width: 8),
            Text(h ? 'नया स्कूल परिपत्र (Circular) जारी करें' : 'Publish School Circular'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: titleCtrl,
              decoration: InputDecoration(
                labelText: h ? 'शीर्षक (Title)' : 'Circular Title',
                border: const OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: bodyCtrl,
              maxLines: 3,
              decoration: InputDecoration(
                labelText: h ? 'संदेश (Message)' : 'Notice Content',
                border: const OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(h ? 'रद्द करें' : 'Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF7C3AED),
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              if (titleCtrl.text.isNotEmpty) {
                setState(() {
                  _notices.insert(0, {
                    'title': titleCtrl.text,
                    'date': 'Just now',
                    'target': 'School Parents & Students',
                    'category': 'NOTICE',
                  });
                });
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      h
                          ? 'परिपत्र सफलतापूर्वक प्रकाशित कर दिया गया!'
                          : 'Circular published & sent to parents!',
                    ),
                    backgroundColor: const Color(0xFF10B981),
                  ),
                );
              }
            },
            child: Text(h ? 'जारी करें' : 'Publish'),
          ),
        ],
      ),
    );
  }

  void _sendFeeReminders() {
    final h = widget.isHindi;
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(h ? 'शुल्क अनुस्मारक भेजें?' : 'Send Fee Reminders?'),
        content: Text(
          h
              ? 'बकाया शुल्क वाले 148 विद्यार्थियों के अभिभावकों को SMS / WhatsApp संदेश भेजा जाएगा।'
              : 'WhatsApp / SMS reminders will be dispatched to 148 parents with pending fees.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(h ? 'रद्द करें' : 'Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    h
                        ? '148 अभिभावकों को रिमाइंडर सफलतापूर्वक भेजा गया!'
                        : 'Fee reminders dispatched to 148 parents!',
                  ),
                  backgroundColor: const Color(0xFF10B981),
                ),
              );
            },
            child: Text(h ? 'भेजें (Send Alert)' : 'Send Now'),
          ),
        ],
      ),
    );
  }

  // --- Admin Homework Review & Monitoring Modal ---
  void _showAdminHomeworkModal() {
    final h = widget.isHindi;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return Container(
            height: MediaQuery.of(context).size.height * 0.90,
            decoration: const BoxDecoration(
              color: Color(0xFFF8FAFC),
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                    border: Border(bottom: BorderSide(color: Color(0xFFE2E8F0))),
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: const Color(0xFFCBD5E1),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEDE9FE),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(Icons.menu_book, color: Color(0xFF7C3AED), size: 20),
                              ),
                              const SizedBox(width: 10),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    h ? 'स्कूल गृहकार्य व मूल्यांकन निगरानी' : 'School Homework & Evaluation',
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A)),
                                  ),
                                  Text(
                                    h ? 'सभी कक्षाओं के गृहकार्य व छात्र उत्तर जांचें' : 'Inspect student submissions & give remarks',
                                    style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () => Navigator.pop(ctx),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Homework list
                Expanded(
                  child: _isLoadingHomework
                      ? const Center(child: CircularProgressIndicator())
                      : _allHomework.isEmpty
                          ? const Center(child: Text("No homework records found."))
                          : ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: _allHomework.length,
                              itemBuilder: (context, i) {
                                final hw = _allHomework[i];
                                final title = hw['title'] ?? 'Homework Assignment';
                                final sub = hw['subject'] ?? 'General';
                                final cls = hw['class_name'] ?? 'Class 10';
                                final sec = hw['section_name'] ?? 'Section A';
                                final teacher = hw['teacher_name'] ?? 'Teacher';
                                final dueDate = hw['due_date'] ?? '16 Oct 2026';
                                final totalSubs = hw['total_submissions'] ?? 38;
                                final evaluated = hw['evaluated_count'] ?? 28;

                                return Container(
                                  margin: const EdgeInsets.only(bottom: 12),
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: const Color(0xFFE2E8F0)),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withAlpha(4),
                                        blurRadius: 8,
                                        offset: const Offset(0, 2),
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
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFFEDE9FE),
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                            child: Text(
                                              "$cls • $sec",
                                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF6D28D9)),
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFFDCFCE7),
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                            child: Text(
                                              "$evaluated / $totalSubs Checked",
                                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF15803D)),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        title,
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A)),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        "Subject: $sub • By: $teacher • Due: $dueDate",
                                        style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                                      ),
                                      const SizedBox(height: 12),
                                      SizedBox(
                                        width: double.infinity,
                                        child: ElevatedButton.icon(
                                          onPressed: () {
                                            _showAdminSubmissionsModal(hw);
                                          },
                                          icon: const Icon(Icons.visibility, size: 16),
                                          label: Text(
                                            h ? "छात्रों का काम जांचें व टिप्पणी दें (View & Grade)" : "Inspect Submissions & Grade",
                                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                                          ),
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: AppThemeController.instance.primaryColor,
                                            foregroundColor: Colors.white,
                                            padding: const EdgeInsets.symmetric(vertical: 10),
                                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  // --- Admin Submissions Inspection Modal ---
  void _showAdminSubmissionsModal(Map<String, dynamic> hw) async {
    final h = widget.isHindi;
    final hwId = hw['id'] ?? 'hw-phys-01';
    final token = widget.session.token;

    final submissions = await ApiService.getHomeworkSubmissions(token, hwId);

    if (!mounted) return;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          final total = submissions.length;
          final checked = submissions.where((s) => s['status'] == 'CHECKED').length;

          return Container(
            height: MediaQuery.of(context).size.height * 0.85,
            decoration: const BoxDecoration(
              color: Color(0xFFF8FAFC),
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Column(
              children: [
                // Modal Handle & Header
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                    border: Border(bottom: BorderSide(color: Color(0xFFE2E8F0))),
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: const Color(0xFFCBD5E1),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFEDE9FE),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        "${hw['class_name'] ?? 'Class 10'} • ${hw['section_name'] ?? 'Sec A'}",
                                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF6D28D9)),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFDCFCE7),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        "Admin Review ($checked/$total Checked)",
                                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF15803D)),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  hw['title'] ?? 'Student Work Submissions',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A)),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () => Navigator.pop(ctx),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Submissions List
                Expanded(
                  child: submissions.isEmpty
                      ? const Center(
                          child: Text(
                            "No student submissions logged yet.",
                            style: TextStyle(color: Color(0xFF64748B), fontSize: 14),
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: submissions.length,
                          itemBuilder: (context, idx) {
                            final sub = submissions[idx];
                            final isChecked = sub['status'] == 'CHECKED';
                            final studentName = sub['student_name'] ?? 'Student';
                            final rollNo = sub['roll_number'] ?? '${idx + 1}';
                            final admNo = sub['admission_number'] ?? 'DPS-2026';
                            final subTime = sub['submitted_at'] ?? 'Recently';
                            final subText = sub['submission_text'] ?? 'Completed assigned exercises.';
                            final fileName = sub['file_name'] ?? 'assignment_solution.pdf';
                            final marks = sub['marks_obtained'];
                            final remarks = sub['teacher_remarks'];

                            return Container(
                              margin: const EdgeInsets.only(bottom: 14),
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: isChecked ? const Color(0xFFA7F3D0) : const Color(0xFFE2E8F0),
                                  width: isChecked ? 1.5 : 1.0,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withAlpha(4),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Student identity header
                                  Row(
                                    children: [
                                      CircleAvatar(
                                        radius: 20,
                                        backgroundColor: isChecked ? const Color(0xFFD1FAE5) : const Color(0xFFEDE9FE),
                                        child: Text(
                                          rollNo,
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 13,
                                            color: isChecked ? const Color(0xFF065F46) : const Color(0xFF6D28D9),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              "$studentName (Roll: $rollNo)",
                                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)),
                                            ),
                                            Text(
                                              "Adm: $admNo • Submitted: $subTime",
                                              style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: isChecked ? const Color(0xFFDCFCE7) : const Color(0xFFFEF3C7),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(
                                              isChecked ? Icons.check_circle : Icons.schedule,
                                              size: 12,
                                              color: isChecked ? const Color(0xFF15803D) : const Color(0xFFB45309),
                                            ),
                                            const SizedBox(width: 4),
                                            Text(
                                              isChecked ? "CHECKED" : "SUBMITTED",
                                              style: TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.bold,
                                                color: isChecked ? const Color(0xFF15803D) : const Color(0xFFB45309),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),

                                  const SizedBox(height: 12),

                                  // Student's submitted work content
                                  Container(
                                    width: double.infinity,
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF8FAFC),
                                      borderRadius: BorderRadius.circular(10),
                                      border: Border.all(color: const Color(0xFFE2E8F0)),
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          "Student's Work / Solution Notes:",
                                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          subText,
                                          style: const TextStyle(fontSize: 12, color: Color(0xFF1E293B), height: 1.4),
                                        ),
                                      ],
                                    ),
                                  ),

                                  const SizedBox(height: 10),

                                  // Attached file badge
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFEFF6FF),
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(color: const Color(0xFFBFDBFE)),
                                    ),
                                    child: Row(
                                      children: [
                                        const Icon(Icons.picture_as_pdf, color: Color(0xFF2563EB), size: 16),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: Text(
                                            fileName,
                                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF1E40AF)),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        const Text(
                                          "Uploaded File",
                                          style: TextStyle(fontSize: 10, color: Color(0xFF3B82F6), fontWeight: FontWeight.w600),
                                        ),
                                      ],
                                    ),
                                  ),

                                  // If already checked: show marks and remarks card
                                  if (isChecked) ...[
                                    const SizedBox(height: 10),
                                    Container(
                                      width: double.infinity,
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFF0FDF4),
                                        borderRadius: BorderRadius.circular(10),
                                        border: Border.all(color: const Color(0xFFBBF7D0)),
                                      ),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                            children: [
                                              Row(
                                                children: [
                                                  const Icon(Icons.stars, color: Color(0xFF15803D), size: 16),
                                                  const SizedBox(width: 6),
                                                  Text(
                                                    "Marks: ${marks ?? '10 / 10'}",
                                                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF15803D)),
                                                  ),
                                                ],
                                              ),
                                              TextButton(
                                                onPressed: () {
                                                  _showAdminGradeDialog(ctx, sub, (newMarks, newRemarks) {
                                                    setModalState(() {
                                                      sub['status'] = 'CHECKED';
                                                      sub['marks_obtained'] = newMarks;
                                                      sub['teacher_remarks'] = newRemarks;
                                                    });
                                                    _loadHomework();
                                                  });
                                                },
                                                style: TextButton.styleFrom(
                                                  padding: EdgeInsets.zero,
                                                  minimumSize: Size.zero,
                                                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                                ),
                                                child: const Text("Edit Marks/Remarks", style: TextStyle(fontSize: 11, color: Color(0xFF6D28D9), fontWeight: FontWeight.bold)),
                                              ),
                                            ],
                                          ),
                                          if (remarks != null && remarks.isNotEmpty) ...[
                                            const SizedBox(height: 4),
                                            Text(
                                              "Evaluator Remarks: \"$remarks\"",
                                              style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: Color(0xFF166534)),
                                            ),
                                          ],
                                        ],
                                      ),
                                    ),
                                  ] else ...[
                                    const SizedBox(height: 12),
                                    SizedBox(
                                      width: double.infinity,
                                      child: ElevatedButton.icon(
                                        onPressed: () {
                                          _showAdminGradeDialog(ctx, sub, (newMarks, newRemarks) {
                                            setModalState(() {
                                              sub['status'] = 'CHECKED';
                                              sub['marks_obtained'] = newMarks;
                                              sub['teacher_remarks'] = newRemarks;
                                            });
                                            _loadHomework();
                                          });
                                        },
                                        icon: const Icon(Icons.rate_review, size: 16),
                                        label: Text(
                                          h ? "प्रिंसिपल/एडमिन मूल्यांकन व टिप्पणी (Grade & Remarks)" : "Admin Evaluation & Give Remarks",
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                                        ),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: const Color(0xFF6D28D9),
                                          foregroundColor: Colors.white,
                                          padding: const EdgeInsets.symmetric(vertical: 10),
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                        ),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  void _showAdminGradeDialog(
    BuildContext parentCtx,
    Map<String, dynamic> sub,
    Function(String marks, String remarks) onGraded,
  ) {
    final subId = sub['id'] ?? 'sub-aarav-01';
    final studentName = sub['student_name'] ?? 'Student';
    final marksCtrl = TextEditingController(text: sub['marks_obtained'] ?? "10 / 10");
    final remarksCtrl = TextEditingController(
      text: sub['teacher_remarks'] ?? "प्रिंसिपल/एडमिन द्वारा अनुमोदित - उत्कृष्ट प्रदर्शन! (Verified & Approved by Principal)",
    );

    showDialog(
      context: context,
      builder: (dlgCtx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Row(
          children: [
            const Icon(Icons.verified, color: Color(0xFF6D28D9)),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                "Admin Review: $studentName",
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Submission: ${sub['file_name'] ?? 'Assignment doc'}",
                style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: marksCtrl,
                decoration: InputDecoration(
                  labelText: "Marks / Grade (अंक)",
                  hintText: "e.g. 10 / 10 or A+",
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: remarksCtrl,
                maxLines: 3,
                decoration: InputDecoration(
                  labelText: "Admin / Evaluator Remarks (टिप्पणी)",
                  hintText: "e.g. Approved by Principal. Accurate answers.",
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dlgCtx),
            child: const Text("Cancel"),
          ),
          ElevatedButton.icon(
            onPressed: () async {
              final marks = marksCtrl.text.trim();
              final remarks = remarksCtrl.text.trim();

              await ApiService.gradeHomework(
                widget.session.token,
                subId,
                marks,
                remarks,
              );

              onGraded(marks, remarks);

              if (dlgCtx.mounted) Navigator.pop(dlgCtx);
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text("$studentName का गृहकार्य एडमिन द्वारा जांचा गया और टिप्पणी सुरक्षित हुई!"),
                    backgroundColor: const Color(0xFF10B981),
                  ),
                );
              }
            },
            icon: const Icon(Icons.check, size: 16),
            label: const Text("अंक व टिप्पणी सुरक्षित करें"),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6D28D9),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
        ],
      ),
    );
  }


  // --- Admin Helpdesk & Ticket Management Hub ---
  void _showAdminTicketsHub() {
    final h = widget.isHindi;
    int currentTab = 0;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          final schoolTickets = ApiService.getTicketsSync(targetRole: 'SCHOOL_ADMIN');
          final superAdminTickets = ApiService.getTicketsSync(raisedByRole: 'SCHOOL_ADMIN');

          return Container(
            height: MediaQuery.of(context).size.height * 0.88,
            decoration: const BoxDecoration(
              color: Color(0xFFF8FAFC),
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                    border: Border(bottom: BorderSide(color: Color(0xFFE2E8F0))),
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: const Color(0xFFCBD5E1),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                backgroundColor: AppThemeController.instance.primaryColor.withAlpha(25),
                                child: Icon(Icons.confirmation_number, color: AppThemeController.instance.primaryColor),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    h ? "टिकट्स व शिकायत निवारण हब" : "Helpdesk & Tickets Hub",
                                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                                  ),
                                  Text(
                                    h ? "शिक्षक, अभिभावक व छात्र टिकट निवारण" : "Manage School & Super Admin Tickets",
                                    style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () => Navigator.pop(ctx),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      // Tab Switcher
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: GestureDetector(
                                onTap: () => setModalState(() => currentTab = 0),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 8),
                                  decoration: BoxDecoration(
                                    color: currentTab == 0 ? Colors.white : Colors.transparent,
                                    borderRadius: BorderRadius.circular(10),
                                    boxShadow: currentTab == 0
                                        ? [BoxShadow(color: Colors.black.withAlpha(8), blurRadius: 4)]
                                        : null,
                                  ),
                                  child: Text(
                                    h ? "स्कूल टिकट्स (${schoolTickets.length})" : "School Tickets (${schoolTickets.length})",
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: currentTab == 0 ? AppThemeController.instance.primaryColor : const Color(0xFF64748B),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            Expanded(
                              child: GestureDetector(
                                onTap: () => setModalState(() => currentTab = 1),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 8),
                                  decoration: BoxDecoration(
                                    color: currentTab == 1 ? Colors.white : Colors.transparent,
                                    borderRadius: BorderRadius.circular(10),
                                    boxShadow: currentTab == 1
                                        ? [BoxShadow(color: Colors.black.withAlpha(8), blurRadius: 4)]
                                        : null,
                                  ),
                                  child: Text(
                                    h ? "सुपर एडमिन को प्रेषित (${superAdminTickets.length})" : "To Super Admin (${superAdminTickets.length})",
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: currentTab == 1 ? AppThemeController.instance.primaryColor : const Color(0xFF64748B),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // Content
                Expanded(
                  child: currentTab == 0
                      ? (schoolTickets.isEmpty
                          ? Center(
                              child: Text(h ? "कोई स्कूल टिकट लंबित नहीं है" : "No active tickets"),
                            )
                          : ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: schoolTickets.length,
                              itemBuilder: (context, idx) {
                                final t = schoolTickets[idx];
                                final isResolved = t['status'] == 'RESOLVED';
                                // priority check
                                final author = t['author_name'] ?? 'User';
                                final role = t['raised_by_role'] ?? 'USER';

                                return Container(
                                  margin: const EdgeInsets.only(bottom: 12),
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(14),
                                    border: Border.all(
                                      color: isResolved ? const Color(0xFFA7F3D0) : const Color(0xFFE2E8F0),
                                    ),
                                    boxShadow: [
                                      BoxShadow(color: Colors.black.withAlpha(4), blurRadius: 6, offset: const Offset(0, 2)),
                                    ],
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Row(
                                            children: [
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                                decoration: BoxDecoration(
                                                  color: role == 'TEACHER' ? const Color(0xFFEDE9FE) : const Color(0xFFE0F2FE),
                                                  borderRadius: BorderRadius.circular(6),
                                                ),
                                                child: Text(
                                                  role,
                                                  style: TextStyle(
                                                    fontSize: 10,
                                                    fontWeight: FontWeight.bold,
                                                    color: role == 'TEACHER' ? const Color(0xFF6D28D9) : const Color(0xFF0369A1),
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(width: 8),
                                              Text(author, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                            ],
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: isResolved ? const Color(0xFFDCFCE7) : const Color(0xFFFEF3C7),
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: Text(
                                              isResolved ? "RESOLVED" : "OPEN",
                                              style: TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.bold,
                                                color: isResolved ? const Color(0xFF15803D) : const Color(0xFFD97706),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        t['title'] ?? '',
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A)),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        t['description'] ?? '',
                                        style: const TextStyle(fontSize: 13, color: Color(0xFF475569)),
                                      ),
                                      const SizedBox(height: 10),
                                      if (isResolved && t['admin_response'] != null)
                                        Container(
                                          padding: const EdgeInsets.all(10),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFFF0FDF4),
                                            borderRadius: BorderRadius.circular(8),
                                            border: Border.all(color: const Color(0xFFBBF7D0)),
                                          ),
                                          child: Text(
                                            "Admin Response: ${t['admin_response']}",
                                            style: const TextStyle(fontSize: 12, color: Color(0xFF166534)),
                                          ),
                                        )
                                      else
                                        SizedBox(
                                          width: double.infinity,
                                          child: ElevatedButton.icon(
                                            onPressed: () {
                                              _showAdminResolveTicketDialog(ctx, t, () => setModalState(() {}));
                                            },
                                            icon: const Icon(Icons.reply, size: 16),
                                            label: Text(h ? "उत्तर दें व समाधान करें" : "Resolve & Reply to Ticket"),
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: AppThemeController.instance.primaryColor,
                                              foregroundColor: Colors.white,
                                              padding: const EdgeInsets.symmetric(vertical: 8),
                                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                );
                              },
                            ))
                      : Column(
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(16),
                              child: SizedBox(
                                width: double.infinity,
                                child: ElevatedButton.icon(
                                  onPressed: () => _showEscalateToSuperAdminDialog(ctx, () => setModalState(() {})),
                                  icon: const Icon(Icons.shield_outlined, size: 18),
                                  label: Text(
                                    h ? "+ सुपर एडमिन को नई समस्या / टिकट भेजें" : "+ Escalate Issue to Super Admin",
                                    style: const TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF1E1B4B),
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(vertical: 12),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
                                ),
                              ),
                            ),
                            Expanded(
                              child: superAdminTickets.isEmpty
                                  ? Center(
                                      child: Text(h ? "सुपर एडमिन को कोई टिकट नहीं भेजा गया है" : "No escalated tickets"),
                                    )
                                  : ListView.builder(
                                      padding: const EdgeInsets.symmetric(horizontal: 16),
                                      itemCount: superAdminTickets.length,
                                      itemBuilder: (context, idx) {
                                        final t = superAdminTickets[idx];
                                        final isResolved = t['status'] == 'RESOLVED';

                                        return Container(
                                          margin: const EdgeInsets.only(bottom: 12),
                                          padding: const EdgeInsets.all(16),
                                          decoration: BoxDecoration(
                                            color: Colors.white,
                                            borderRadius: BorderRadius.circular(14),
                                            border: Border.all(color: const Color(0xFFE2E8F0)),
                                          ),
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Row(
                                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                children: [
                                                  Container(
                                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                                    decoration: BoxDecoration(
                                                      color: const Color(0xFFEDE9FE),
                                                      borderRadius: BorderRadius.circular(6),
                                                    ),
                                                    child: Text(
                                                      "Escalated • ${t['category']}",
                                                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF6D28D9)),
                                                    ),
                                                  ),
                                                  Container(
                                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                                    decoration: BoxDecoration(
                                                      color: isResolved ? const Color(0xFFDCFCE7) : const Color(0xFFFEF3C7),
                                                      borderRadius: BorderRadius.circular(6),
                                                    ),
                                                    child: Text(
                                                      isResolved ? "RESOLVED BY SUPER ADMIN" : "AWAITING SUPER ADMIN",
                                                      style: TextStyle(
                                                        fontSize: 10,
                                                        fontWeight: FontWeight.bold,
                                                        color: isResolved ? const Color(0xFF15803D) : const Color(0xFFD97706),
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                              const SizedBox(height: 8),
                                              Text(t['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                              const SizedBox(height: 4),
                                              Text(t['description'] ?? '', style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                                              if (isResolved && t['admin_response'] != null) ...[
                                                const SizedBox(height: 10),
                                                Container(
                                                  padding: const EdgeInsets.all(10),
                                                  decoration: BoxDecoration(
                                                    color: const Color(0xFFF0FDF4),
                                                    borderRadius: BorderRadius.circular(8),
                                                  ),
                                                  child: Text(
                                                    "Super Admin Response: ${t['admin_response']}",
                                                    style: const TextStyle(fontSize: 11, color: Color(0xFF166534)),
                                                  ),
                                                ),
                                              ],
                                            ],
                                          ),
                                        );
                                      },
                                    ),
                            ),
                          ],
                        ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  void _showAdminResolveTicketDialog(BuildContext parentCtx, Map<String, dynamic> ticket, VoidCallback onResolved) {
    final responseCtrl = TextEditingController();
    final h = widget.isHindi;

    showDialog(
      context: context,
      builder: (dlgCtx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(h ? "टिकट का समाधान करें" : "Resolve Ticket"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Ticket: ${ticket['title']}", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(height: 12),
            TextField(
              controller: responseCtrl,
              maxLines: 3,
              decoration: InputDecoration(
                labelText: h ? "प्रिंसिपल / एडमिन उत्तर" : "Admin Resolution Note",
                hintText: h ? "समस्या का समाधान विवरण लिखें..." : "Enter resolution note...",
                border: const OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dlgCtx), child: Text(h ? "रद्द करें" : "Cancel")),
          ElevatedButton(
            onPressed: () async {
              if (responseCtrl.text.trim().isEmpty) return;
              await ApiService.resolveTicket(
                widget.session.token,
                ticket['id'],
                responseCtrl.text.trim(),
              );
              onResolved();
              if (dlgCtx.mounted) Navigator.pop(dlgCtx);
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(h ? "टिकट का सफलतापूर्वक समाधान हुआ!" : "Ticket marked as resolved!"), backgroundColor: const Color(0xFF10B981)),
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981), foregroundColor: Colors.white),
            child: Text(h ? "समाधान करें" : "Resolve"),
          ),
        ],
      ),
    );
  }

  void _showEscalateToSuperAdminDialog(BuildContext parentCtx, VoidCallback onEscalated) {
    final titleCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    String category = 'CBSE / Affiliation';
    String priority = 'HIGH';
    final h = widget.isHindi;

    showDialog(
      context: context,
      builder: (dlgCtx) => StatefulBuilder(
        builder: (context, setDlgState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          title: Row(
            children: [
              const Icon(Icons.shield, color: Color(0xFF1E1B4B)),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  h ? "सुपर एडमिन को टिकट भेजें" : "Escalate to Super Admin",
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                DropdownButtonFormField<String>(
                  value: category,
                  decoration: const InputDecoration(labelText: "Category", border: OutlineInputBorder()),
                  items: [
                    'CBSE / Affiliation',
                    'Server & Quota Expansion',
                    'Payment Gateway / Fees Settlement',
                    'Legal & Compliance Dispute',
                    'Feature Request / Bug',
                  ].map((c) => DropdownMenuItem(value: c, child: Text(c, style: const TextStyle(fontSize: 12)))).toList(),
                  onChanged: (val) => setDlgState(() => category = val!),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: titleCtrl,
                  decoration: const InputDecoration(labelText: "Subject / Title", border: OutlineInputBorder()),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: descCtrl,
                  maxLines: 3,
                  decoration: const InputDecoration(labelText: "Detailed Description", border: OutlineInputBorder()),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(dlgCtx), child: Text(h ? "रद्द करें" : "Cancel")),
            ElevatedButton(
              onPressed: () async {
                if (titleCtrl.text.trim().isEmpty) return;
                await ApiService.createTicket(
                  token: widget.session.token,
                  title: titleCtrl.text.trim(),
                  description: descCtrl.text.trim(),
                  category: category,
                  priority: priority,
                  raisedByRole: 'SCHOOL_ADMIN',
                  targetRole: 'SUPER_ADMIN',
                  authorName: widget.session.instituteName.isNotEmpty ? widget.session.instituteName : 'School Admin',
                );
                onEscalated();
                if (dlgCtx.mounted) Navigator.pop(dlgCtx);
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(h ? "टिकट सुपर एडमिन को प्रेषित कर दिया गया!" : "Escalated to Super Admin!"), backgroundColor: const Color(0xFF10B981)),
                  );
                }
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1E1B4B), foregroundColor: Colors.white),
              child: Text(h ? "भेजें" : "Escalate"),
            ),
          ],
        ),
      ),
    );
  }

  // --- Admin Driver Verification & Bus Tracking Hub ---
  void _showDriversAndBusTrackingModal() {
    final h = widget.isHindi;
    int currentTab = 0;
    String selectedBus = "Bus #01";

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          final drivers = ApiService.getDriversSync();

          return Container(
            height: MediaQuery.of(context).size.height * 0.88,
            decoration: const BoxDecoration(
              color: Color(0xFFF8FAFC),
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                    border: Border(bottom: BorderSide(color: Color(0xFFE2E8F0))),
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: const Color(0xFFCBD5E1),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                backgroundColor: const Color(0xFFF59E0B).withAlpha(25),
                                child: const Icon(Icons.directions_bus, color: Color(0xFFD97706)),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    h ? "चालक सत्यापन व बस ट्रैकिंग" : "Drivers & Bus GPS Tracking",
                                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                                  ),
                                  Text(
                                    h ? "ड्राइवर लाइसेंस, पुलिस वेरिफिकेशन व लाइव लोकेशन" : "Verify Drivers & Select Bus to Track",
                                    style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () => Navigator.pop(ctx),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      // Tab Switcher
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: GestureDetector(
                                onTap: () => setModalState(() => currentTab = 0),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 8),
                                  decoration: BoxDecoration(
                                    color: currentTab == 0 ? Colors.white : Colors.transparent,
                                    borderRadius: BorderRadius.circular(10),
                                    boxShadow: currentTab == 0 ? [BoxShadow(color: Colors.black.withAlpha(8), blurRadius: 4)] : null,
                                  ),
                                  child: Text(
                                    h ? "चालक व सत्यापन (${drivers.length})" : "Drivers & Verification (${drivers.length})",
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: currentTab == 0 ? const Color(0xFFD97706) : const Color(0xFF64748B),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            Expanded(
                              child: GestureDetector(
                                onTap: () => setModalState(() => currentTab = 1),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 8),
                                  decoration: BoxDecoration(
                                    color: currentTab == 1 ? Colors.white : Colors.transparent,
                                    borderRadius: BorderRadius.circular(10),
                                    boxShadow: currentTab == 1 ? [BoxShadow(color: Colors.black.withAlpha(8), blurRadius: 4)] : null,
                                  ),
                                  child: Text(
                                    h ? "लाइव बस ट्रैकिंग (Select Bus)" : "Live Bus Tracking",
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: currentTab == 1 ? const Color(0xFFD97706) : const Color(0xFF64748B),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // Body
                Expanded(
                  child: currentTab == 0
                      ? Column(
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(16),
                              child: SizedBox(
                                width: double.infinity,
                                child: ElevatedButton.icon(
                                  onPressed: () => _showAddDriverDialog(ctx, () => setModalState(() {})),
                                  icon: const Icon(Icons.person_add, size: 18),
                                  label: Text(
                                    h ? "+ नया ड्राइवर जोड़ें व दस्तावेज सत्यापित करें" : "+ Add Driver & Verify Documents",
                                    style: const TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFFD97706),
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(vertical: 12),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
                                ),
                              ),
                            ),
                            Expanded(
                              child: ListView.builder(
                                padding: const EdgeInsets.symmetric(horizontal: 16),
                                itemCount: drivers.length,
                                itemBuilder: (context, idx) {
                                  final d = drivers[idx];

                                  return Container(
                                    margin: const EdgeInsets.only(bottom: 12),
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(color: const Color(0xFFE2E8F0)),
                                      boxShadow: [
                                        BoxShadow(color: Colors.black.withAlpha(4), blurRadius: 6, offset: const Offset(0, 2)),
                                      ],
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            CircleAvatar(
                                              radius: 22,
                                              backgroundColor: const Color(0xFFFEF3C7),
                                              child: Text(
                                                d['name'][0],
                                                style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFB45309)),
                                              ),
                                            ),
                                            const SizedBox(width: 12),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(d['name'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                                                  Text("${d['assigned_bus']} • ${d['route']}", style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                                                ],
                                              ),
                                            ),
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                              decoration: BoxDecoration(
                                                color: const Color(0xFFDCFCE7),
                                                borderRadius: BorderRadius.circular(6),
                                              ),
                                              child: const Text("VERIFIED", style: TextStyle(color: Color(0xFF15803D), fontWeight: FontWeight.bold, fontSize: 10)),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 12),
                                        // Document Badges
                                        Wrap(
                                          spacing: 8,
                                          runSpacing: 6,
                                          children: [
                                            _docBadge("HMV: ${d['license_number']}", Icons.badge, const Color(0xFF4338CA), const Color(0xFFEEF2FF)),
                                            _docBadge("Police: ${d['police_verification']}", Icons.verified_user, const Color(0xFF15803D), const Color(0xFFDCFCE7)),
                                            _docBadge("Medical: ${d['medical_fitness']}", Icons.health_and_safety, const Color(0xFFB45309), const Color(0xFFFEF3C7)),
                                            _docBadge("Aadhaar: ${d['aadhaar_number']}", Icons.credit_card, const Color(0xFF0F766E), const Color(0xFFCCFBF1)),
                                          ],
                                        ),
                                        const SizedBox(height: 10),
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text("Contact: ${d['phone']}", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
                                            Text("Exp: ${d['experience']}", style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                                          ],
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                            ),
                          ],
                        )
                      : SingleChildScrollView(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(h ? "ट्रैक करने के लिए बस चुनें (Select Bus):" : "Select Bus to Track:", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                              const SizedBox(height: 10),
                              SingleChildScrollView(
                                scrollDirection: Axis.horizontal,
                                child: Row(
                                  children: ["Bus #01", "Bus #02", "Bus #04", "Bus #07"].map((b) {
                                    final isSel = selectedBus == b;
                                    return Padding(
                                      padding: const EdgeInsets.only(right: 8),
                                      child: ChoiceChip(
                                        label: Text(b),
                                        selected: isSel,
                                        selectedColor: const Color(0xFFD97706),
                                        labelStyle: TextStyle(color: isSel ? Colors.white : const Color(0xFF1E293B), fontWeight: FontWeight.bold),
                                        onSelected: (val) {
                                          if (val) setModalState(() => selectedBus = b);
                                        },
                                      ),
                                    );
                                  }).toList(),
                                ),
                              ),
                              const SizedBox(height: 16),
                              // Live Tracking Map Card
                              Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: const Color(0xFFE2E8F0)),
                                  boxShadow: [
                                    BoxShadow(color: Colors.black.withAlpha(4), blurRadius: 8, offset: const Offset(0, 2)),
                                  ],
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Row(
                                          children: [
                                            const Icon(Icons.navigation, color: Color(0xFF10B981)),
                                            const SizedBox(width: 6),
                                            Text("$selectedBus (GPS Live)", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                                          ],
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(color: const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(6)),
                                          child: const Text("34 km/h • ON ROUTE", style: TextStyle(color: Color(0xFF15803D), fontWeight: FontWeight.bold, fontSize: 11)),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 14),
                                    // Visual route tracker
                                    Container(
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(12)),
                                      child: Column(
                                        children: [
                                          Row(
                                            children: const [
                                              Icon(Icons.radio_button_checked, color: Color(0xFF10B981), size: 16),
                                              SizedBox(width: 8),
                                              Text("Current Stop: Sector 14 Metro Station", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                            ],
                                          ),
                                          const Padding(
                                            padding: EdgeInsets.only(left: 7),
                                            child: SizedBox(height: 16, child: VerticalDivider(thickness: 2, color: Color(0xFFCBD5E1))),
                                          ),
                                          Row(
                                            children: const [
                                              Icon(Icons.location_on, color: Color(0xFFEF4444), size: 16),
                                              SizedBox(width: 8),
                                              Text("Next Stop: Green Avenue Main Gate (ETA 8 mins)", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Color(0xFF64748B))),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(height: 14),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: const [
                                        Text("Students Onboard: 32 / 40", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                        Text("GPS Signal: Excellent (4G)", style: TextStyle(fontSize: 12, color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  static Widget _docBadge(String text, IconData icon, Color color, Color bg) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: color),
          const SizedBox(width: 4),
          Text(text, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: color)),
        ],
      ),
    );
  }

  void _showAddDriverDialog(BuildContext parentCtx, VoidCallback onAdded) {
    final nameCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final busCtrl = TextEditingController(text: "Bus #05");
    final routeCtrl = TextEditingController(text: "East Delhi - Preet Vihar");
    final licCtrl = TextEditingController(text: "DL-14-2022-HMV-8891");
    final h = widget.isHindi;

    showDialog(
      context: context,
      builder: (dlgCtx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Row(
          children: const [
            Icon(Icons.person_add, color: Color(0xFFD97706)),
            SizedBox(width: 8),
            Text("Add & Verify Driver", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: "Driver Name", border: OutlineInputBorder())),
              const SizedBox(height: 10),
              TextField(controller: phoneCtrl, decoration: const InputDecoration(labelText: "Mobile Phone", border: OutlineInputBorder())),
              const SizedBox(height: 10),
              TextField(controller: busCtrl, decoration: const InputDecoration(labelText: "Assigned Bus No", border: OutlineInputBorder())),
              const SizedBox(height: 10),
              TextField(controller: routeCtrl, decoration: const InputDecoration(labelText: "Bus Route", border: OutlineInputBorder())),
              const SizedBox(height: 10),
              TextField(controller: licCtrl, decoration: const InputDecoration(labelText: "HMV Driving License No", border: OutlineInputBorder())),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dlgCtx), child: Text(h ? "रद्द करें" : "Cancel")),
          ElevatedButton(
            onPressed: () {
              if (nameCtrl.text.trim().isEmpty) return;
              ApiService.addDriver({
                'name': nameCtrl.text.trim(),
                'phone': phoneCtrl.text.trim(),
                'assigned_bus': busCtrl.text.trim(),
                'route': routeCtrl.text.trim(),
                'license_number': licCtrl.text.trim(),
                'police_verification': 'Verified (Recent)',
                'medical_fitness': 'Fit & Cleared',
                'aadhaar_number': 'XXXX-XXXX-9912',
                'experience': '6 Years',
              });
              onAdded();
              Navigator.pop(dlgCtx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Driver registered & verified successfully!"), backgroundColor: Color(0xFF10B981)),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFD97706), foregroundColor: Colors.white),
            child: Text(h ? "जोड़ें" : "Save Driver"),
          ),
        ],
      ),
    );
  }

  // --- Student, Teacher, Staff Directory & Granular Filters ---
  void _showDirectoryFiltersModal() {
    final h = widget.isHindi;
    int currentTab = 0;
    String searchFilter = "";
    String classFilter = "All";
    String feeFilter = "All";
    String deptFilter = "All";
    String roleFilter = "All";

    final sampleStudents = [
      {'name': 'Aanya Verma', 'class': 'Class 10', 'sec': 'A', 'fee': 'PAID', 'att': '98%'},
      {'name': 'Anik Sen', 'class': 'Class 10', 'sec': 'A', 'fee': 'PAID', 'att': '95%'},
      {'name': 'Dev Malhotra', 'class': 'Class 10', 'sec': 'B', 'fee': 'PENDING', 'att': '88%'},
      {'name': 'Diya Singh', 'class': 'Class 9', 'sec': 'A', 'fee': 'PAID', 'att': '96%'},
      {'name': 'Ishaan Gupta', 'class': 'Class 9', 'sec': 'B', 'fee': 'PENDING', 'att': '91%'},
      {'name': 'Kavya Joshi', 'class': 'Class 11', 'sec': 'Sci', 'fee': 'PAID', 'att': '97%'},
      {'name': 'Rohan Mehta', 'class': 'Class 12', 'sec': 'Com', 'fee': 'PAID', 'att': '94%'},
    ];

    final sampleTeachers = [
      {'name': 'Smt. Sunita Sharma', 'dept': 'Science', 'subject': 'Physics', 'class': 'Class 10-A'},
      {'name': 'Shri R. K. Gupta', 'dept': 'Mathematics', 'subject': 'Maths', 'class': 'Class 10-B'},
      {'name': 'Ms. Anjali Verma', 'dept': 'Languages', 'subject': 'English', 'class': 'Class 9-A'},
      {'name': 'Shri Mohan Lal', 'dept': 'Social Studies', 'subject': 'History', 'class': 'Class 9-B'},
      {'name': 'Dr. V. K. Mishra', 'dept': 'Science', 'subject': 'Chemistry', 'class': 'Class 11-Sci'},
    ];

    final sampleStaff = [
      {'name': 'Rajesh Kumar', 'role': 'Transport', 'duty': 'Senior Driver', 'ver': 'Verified'},
      {'name': 'Suresh Chandra', 'role': 'Security', 'duty': 'Main Gate Head', 'ver': 'Verified'},
      {'name': 'Meena Devi', 'role': 'Admin Office', 'duty': 'Accountant', 'ver': 'Verified'},
      {'name': 'Ramesh Yadav', 'role': 'Maintenance', 'duty': 'Electrician', 'ver': 'Verified'},
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          final filteredStudents = sampleStudents.where((s) {
            final matchClass = classFilter == 'All' || s['class'] == classFilter;
            final matchFee = feeFilter == 'All' || s['fee'] == feeFilter;
            final matchSearch = searchFilter.isEmpty || s['name']!.toLowerCase().contains(searchFilter.toLowerCase());
            return matchClass && matchFee && matchSearch;
          }).toList();

          final filteredTeachers = sampleTeachers.where((t) {
            final matchDept = deptFilter == 'All' || t['dept'] == deptFilter;
            final matchSearch = searchFilter.isEmpty || t['name']!.toLowerCase().contains(searchFilter.toLowerCase());
            return matchDept && matchSearch;
          }).toList();

          final filteredStaff = sampleStaff.where((st) {
            final matchRole = roleFilter == 'All' || st['role'] == roleFilter;
            final matchSearch = searchFilter.isEmpty || st['name']!.toLowerCase().contains(searchFilter.toLowerCase());
            return matchRole && matchSearch;
          }).toList();

          return Container(
            height: MediaQuery.of(context).size.height * 0.90,
            decoration: const BoxDecoration(
              color: Color(0xFFF8FAFC),
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                    border: Border(bottom: BorderSide(color: Color(0xFFE2E8F0))),
                  ),
                  child: Column(
                    children: [
                      Container(width: 40, height: 4, decoration: BoxDecoration(color: const Color(0xFFCBD5E1), borderRadius: BorderRadius.circular(2))),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                backgroundColor: AppThemeController.instance.primaryColor.withAlpha(25),
                                child: Icon(Icons.filter_list, color: AppThemeController.instance.primaryColor),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(h ? "छात्र, शिक्षक व स्टाफ डायरेक्टरी" : "Directory & Filters Hub", style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                                  Text(h ? "कक्षा, विभाग, फीस व स्टेटस फ़िल्टर" : "Filter by Class, Fee, Dept, and Role", style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                                ],
                              ),
                            ],
                          ),
                          IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                        ],
                      ),
                      const SizedBox(height: 12),
                      // Search field
                      TextField(
                        onChanged: (val) => setModalState(() => searchFilter = val),
                        decoration: InputDecoration(
                          hintText: h ? "नाम से खोजें..." : "Search by name...",
                          prefixIcon: const Icon(Icons.search, size: 20),
                          contentPadding: const EdgeInsets.symmetric(vertical: 8),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                          fillColor: const Color(0xFFF8FAFC),
                          filled: true,
                        ),
                      ),
                      const SizedBox(height: 10),
                      // 3-way Tab
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(12)),
                        child: Row(
                          children: [
                            _subTabBtn("Students (${filteredStudents.length})", 0, currentTab, () => setModalState(() => currentTab = 0)),
                            _subTabBtn("Teachers (${filteredTeachers.length})", 1, currentTab, () => setModalState(() => currentTab = 1)),
                            _subTabBtn("Staff (${filteredStaff.length})", 2, currentTab, () => setModalState(() => currentTab = 2)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // Body based on active tab
                Expanded(
                  child: currentTab == 0
                      ? Column(
                          children: [
                            // Student Filters Bar
                            Padding(
                              padding: const EdgeInsets.all(12),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: DropdownButtonFormField<String>(
                                      value: classFilter,
                                      decoration: const InputDecoration(labelText: "Class", contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8), border: OutlineInputBorder()),
                                      items: ['All', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((c) => DropdownMenuItem(value: c, child: Text(c, style: const TextStyle(fontSize: 12)))).toList(),
                                      onChanged: (val) => setModalState(() => classFilter = val!),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: DropdownButtonFormField<String>(
                                      value: feeFilter,
                                      decoration: const InputDecoration(labelText: "Fee Status", contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8), border: OutlineInputBorder()),
                                      items: ['All', 'PAID', 'PENDING'].map((f) => DropdownMenuItem(value: f, child: Text(f, style: const TextStyle(fontSize: 12)))).toList(),
                                      onChanged: (val) => setModalState(() => feeFilter = val!),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Expanded(
                              child: ListView.builder(
                                padding: const EdgeInsets.symmetric(horizontal: 16),
                                itemCount: filteredStudents.length,
                                itemBuilder: (context, idx) {
                                  final s = filteredStudents[idx];
                                  final isPaid = s['fee'] == 'PAID';

                                  return Card(
                                    margin: const EdgeInsets.only(bottom: 8),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                    child: ListTile(
                                      leading: CircleAvatar(backgroundColor: const Color(0xFFEDE9FE), child: Text(s['name']![0])),
                                      title: Text(s['name']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                      subtitle: Text("${s['class']} • Sec ${s['sec']} • Att: ${s['att']}"),
                                      trailing: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: isPaid ? const Color(0xFFDCFCE7) : const Color(0xFFFEE2E2),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          s['fee']!,
                                          style: TextStyle(color: isPaid ? const Color(0xFF15803D) : const Color(0xFFDC2626), fontWeight: FontWeight.bold, fontSize: 10),
                                        ),
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                          ],
                        )
                      : currentTab == 1
                          ? Column(
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(12),
                                  child: DropdownButtonFormField<String>(
                                    value: deptFilter,
                                    decoration: const InputDecoration(labelText: "Department", contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8), border: OutlineInputBorder()),
                                    items: ['All', 'Science', 'Mathematics', 'Languages', 'Social Studies'].map((d) => DropdownMenuItem(value: d, child: Text(d, style: const TextStyle(fontSize: 12)))).toList(),
                                    onChanged: (val) => setModalState(() => deptFilter = val!),
                                  ),
                                ),
                                Expanded(
                                  child: ListView.builder(
                                    padding: const EdgeInsets.symmetric(horizontal: 16),
                                    itemCount: filteredTeachers.length,
                                    itemBuilder: (context, idx) {
                                      final t = filteredTeachers[idx];
                                      return Card(
                                        margin: const EdgeInsets.only(bottom: 8),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                        child: ListTile(
                                          leading: CircleAvatar(backgroundColor: const Color(0xFFDCFCE7), child: Text(t['name']![0])),
                                          title: Text(t['name']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                          subtitle: Text("${t['dept']} • ${t['subject']}"),
                                          trailing: Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                            decoration: BoxDecoration(color: const Color(0xFFEDE9FE), borderRadius: BorderRadius.circular(6)),
                                            child: Text(t['class']!, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF6D28D9))),
                                          ),
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ],
                            )
                          : Column(
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(12),
                                  child: DropdownButtonFormField<String>(
                                    value: roleFilter,
                                    decoration: const InputDecoration(labelText: "Staff Role", contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8), border: OutlineInputBorder()),
                                    items: ['All', 'Transport', 'Security', 'Admin Office', 'Maintenance'].map((r) => DropdownMenuItem(value: r, child: Text(r, style: const TextStyle(fontSize: 12)))).toList(),
                                    onChanged: (val) => setModalState(() => roleFilter = val!),
                                  ),
                                ),
                                Expanded(
                                  child: ListView.builder(
                                    padding: const EdgeInsets.symmetric(horizontal: 16),
                                    itemCount: filteredStaff.length,
                                    itemBuilder: (context, idx) {
                                      final st = filteredStaff[idx];
                                      return Card(
                                        margin: const EdgeInsets.only(bottom: 8),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                        child: ListTile(
                                          leading: CircleAvatar(backgroundColor: const Color(0xFFFEF3C7), child: Text(st['name']![0])),
                                          title: Text(st['name']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                          subtitle: Text("${st['role']} • Duty: ${st['duty']}"),
                                          trailing: Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                            decoration: BoxDecoration(color: const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(6)),
                                            child: const Text("Verified", style: TextStyle(color: Color(0xFF15803D), fontWeight: FontWeight.bold, fontSize: 11)),
                                          ),
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ],
                            ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  static Widget _subTabBtn(String label, int tabIdx, int currentTab, VoidCallback onTap) {
    final isSel = tabIdx == currentTab;
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSel ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            boxShadow: isSel ? [BoxShadow(color: Colors.black.withAlpha(8), blurRadius: 4)] : null,
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: isSel ? AppThemeController.instance.primaryColor : const Color(0xFF64748B),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final h = widget.isHindi;
    final instName = widget.session.instituteName.isNotEmpty
        ? widget.session.instituteName
        : 'Delhi Public Global School';

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF6D28D9),
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              instName,
              style: const TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            Text(
              h
                  ? 'स्कूल एडमिन पोर्टल (प्रिंसिपल कंसोल)'
                  : 'School Admin Portal (Principal Console)',
              style: const TextStyle(fontSize: 11, color: Colors.white70),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.palette_outlined, color: Colors.white),
            tooltip: h ? 'थीम बदलें (App Theme)' : 'App Theme',
            onPressed: () => AppThemeController.showThemePickerDialog(context, h),
          ),
          TextButton.icon(
            onPressed: widget.onToggleLanguage,
            icon: const Icon(Icons.language, color: Colors.white, size: 18),
            label: Text(
              h ? 'English' : 'हिंदी',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.white,
                fontSize: 13,
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            tooltip: h ? 'लॉगआउट' : 'Logout',
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
            // Principal Profile Banner
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [AppThemeController.instance.primaryColor, AppThemeController.instance.primaryColor.withAlpha(200)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(18),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF6D28D9).withAlpha(70),
                    blurRadius: 12,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Row(
                children: [
                  const CircleAvatar(
                    radius: 28,
                    backgroundColor: Colors.white24,
                    child: Icon(Icons.account_balance, size: 30, color: Colors.white),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.session.displayName,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.amber.withAlpha(50),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.amberAccent),
                              ),
                              child: Text(
                                h ? 'सत्र 2026-27' : 'Session 2026-27',
                                style: const TextStyle(
                                  color: Colors.amberAccent,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text(
                              'CBSE Code: 213084',
                              style: TextStyle(color: Colors.white70, fontSize: 11),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 18),

            // Top Key Metrics Row
            Row(
              children: [
                Expanded(
                  child: _kpiCard(
                    title: h ? 'कुल विद्यार्थी' : 'Total Students',
                    value: '1,248',
                    sub: h ? '12 कक्षाएं' : '12 Grades',
                    icon: Icons.people,
                    color: const Color(0xFF3B82F6),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _kpiCard(
                    title: h ? 'कुल शिक्षक' : 'Staff / Teachers',
                    value: '64',
                    sub: h ? '62 उपस्थित' : '62 Present',
                    icon: Icons.person_pin,
                    color: const Color(0xFF10B981),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _kpiCard(
                    title: h ? 'छात्र उपस्थिति' : 'Student Attendance',
                    value: '94.2%',
                    sub: h ? '1,176 / 1,248 उपस्थित' : '1,176 Present',
                    icon: Icons.check_circle_outline,
                    color: const Color(0xFF8B5CF6),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _kpiCard(
                    title: h ? 'शुल्क संग्रह' : 'Fee Collection',
                    value: '₹1.45 L',
                    sub: h ? 'बकाया: ₹3.20 L' : 'Dues: ₹3.20 L',
                    icon: Icons.currency_rupee,
                    color: const Color(0xFFF59E0B),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Quick Actions Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  h ? 'प्रशासनिक कार्य' : 'Administrative Actions',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0F172A),
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: _showNoticeDialog,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF7C3AED),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  icon: const Icon(Icons.add, size: 16, color: Colors.white),
                  label: Text(
                    h ? 'नया नोटिस' : '+ Notice',
                    style: const TextStyle(color: Colors.white, fontSize: 12),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 14),

            // Grid of Administrative Modules (Now with Homework & Evaluation tile!)
            GridView.count(
              crossAxisCount: 3,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 0.9,
              children: [
                _actionTile(
                  icon: Icons.confirmation_number,
                  label: h ? 'टिकट व हेल्पडेस्क' : 'Tickets & Helpdesk',
                  color: const Color(0xFF6D28D9),
                  onTap: _showAdminTicketsHub,
                ),
                _actionTile(
                  icon: Icons.directions_bus,
                  label: h ? 'चालक व बस ट्रैकिंग' : 'Drivers & Bus GPS',
                  color: const Color(0xFFD97706),
                  onTap: _showDriversAndBusTrackingModal,
                ),
                _actionTile(
                  icon: Icons.filter_list,
                  label: h ? 'डायरेक्टरी व फ़िल्टर' : 'Directory & Filter',
                  color: const Color(0xFF0284C7),
                  onTap: _showDirectoryFiltersModal,
                ),
                _actionTile(
                  icon: Icons.palette,
                  label: h ? 'ऐप थीम' : 'App Theme',
                  color: AppThemeController.instance.primaryColor,
                  onTap: () => AppThemeController.showThemePickerDialog(context, h),
                ),
                _actionTile(
                  icon: Icons.assignment_turned_in,
                  label: h ? 'गृहकार्य व मूल्यांकन' : 'Homework & Grading',
                  color: const Color(0xFF7C3AED),
                  onTap: _showAdminHomeworkModal,
                ),
                _actionTile(
                  icon: Icons.co_present,
                  label: h ? 'दैनिक उपस्थिति' : 'Attendance',
                  color: const Color(0xFF10B981),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(h ? 'सभी 12 कक्षाओं की उपस्थिति दर्ज है!' : 'Attendance logged for all 12 grades.')),
                    );
                  },
                ),
                _actionTile(
                  icon: Icons.send_to_mobile,
                  label: h ? 'फीस अलर्ट' : 'Fee Remind',
                  color: const Color(0xFFF59E0B),
                  onTap: _sendFeeReminders,
                ),
                _actionTile(
                  icon: Icons.app_registration,
                  label: h ? 'नए दाखिले' : 'Admissions',
                  color: const Color(0xFF3B82F6),
                  onTap: () {
                    _showAdmissionsModal();
                  },
                ),
                _actionTile(
                  icon: Icons.calendar_month,
                  label: h ? 'समय सारिणी' : 'Timetable',
                  color: const Color(0xFF8B5CF6),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(h ? 'समय-सारिणी सक्रिय है (कक्षा 1 - 12)' : 'Class Timetable 2026-27 is Active')),
                    );
                  },
                ),
                _actionTile(
                  icon: Icons.campaign,
                  label: h ? 'सर्कुलर / नोटिस' : 'Notices',
                  color: const Color(0xFFEC4899),
                  onTap: _showNoticeDialog,
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Dedicated Homework & Submissions Monitoring Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  h ? 'गृहकार्य व मूल्यांकन निगरानी' : 'Homework & Evaluation Monitoring',
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0F172A),
                  ),
                ),
                TextButton(
                  onPressed: _showAdminHomeworkModal,
                  child: Text(
                    h ? 'सभी देखें >' : 'View All >',
                    style: const TextStyle(color: Color(0xFF7C3AED), fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Top homework cards
            if (_isLoadingHomework)
              const Center(child: Padding(padding: EdgeInsets.all(16), child: CircularProgressIndicator()))
            else if (_allHomework.isEmpty)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: const Text("No homework records found."),
              )
            else
              ..._allHomework.take(2).map((hw) {
                final title = hw['title'] ?? 'Homework';
                final sub = hw['subject'] ?? 'General';
                final cls = hw['class_name'] ?? 'Class 10';
                final sec = hw['section_name'] ?? 'Section A';
                final teacher = hw['teacher_name'] ?? 'Teacher';
                final totalSubs = hw['total_submissions'] ?? 38;
                final evaluated = hw['evaluated_count'] ?? 28;

                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withAlpha(4),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEDE9FE),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  "$cls • $sec",
                                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF6D28D9)),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                sub,
                                style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: const Color(0xFFDCFCE7),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              "$evaluated/$totalSubs Checked",
                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF15803D)),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        title,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        "Teacher: $teacher",
                        style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          ElevatedButton.icon(
                            onPressed: () => _showAdminSubmissionsModal(hw),
                            icon: const Icon(Icons.rate_review, size: 14),
                            label: Text(
                              h ? "उत्तर जांचें व टिप्पणी दें" : "Review Submissions",
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF7C3AED),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              }),

            const SizedBox(height: 20),

            // Class-wise student & attendance status
            Text(
              h ? 'कक्षावार विद्यार्थी व उपस्थिति स्थिति' : 'Class-wise Attendance & Students',
              style: const TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 10),

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _classes.length,
              separatorBuilder: (context, index) => const SizedBox(height: 8),
              itemBuilder: (ctx, i) {
                final c = _classes[i];
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3E8FF),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          c['name']!,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF7C3AED),
                            fontSize: 13,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${c['section']} • ${c['students']} ${h ? 'विद्यार्थी' : 'Students'}',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                                color: Color(0xFF1E293B),
                              ),
                            ),
                            Text(
                              '${h ? 'कक्षा अध्यापक:' : 'Class Teacher:'} ${c['teacher']}',
                              style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFECFDF5),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color(0xFFA7F3D0)),
                        ),
                        child: Text(
                          c['attendance']!,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                            color: Color(0xFF059669),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),

            const SizedBox(height: 24),

            // Recent Circulars List
            Text(
              h ? 'हाल ही के स्कूल परिपत्र' : 'Recent School Circulars',
              style: const TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 10),

            Column(
              children: _notices.map((n) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.article, color: Color(0xFF7C3AED), size: 28),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              n['title']!,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                                color: Color(0xFF1E293B),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${n['target']} • ${n['date']}',
                              style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  void _showAdmissionsModal() {
    final h = widget.isHindi;
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              h ? 'नए दाखिले आवेदन (सत्र 2026-27)' : 'Pending Admission Applications',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 14),
            ..._admissions.map(
              (adm) => Card(
                child: ListTile(
                  leading: const CircleAvatar(child: Icon(Icons.person)),
                  title: Text(adm['student']!),
                  subtitle: Text('${adm['class']} • Parent: ${adm['parent']}'),
                  trailing: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () {
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            h
                                ? '${adm['student']} का दाखिला स्वीकृत कर दिया गया!'
                                : 'Admission approved for ${adm['student']}!',
                          ),
                          backgroundColor: const Color(0xFF10B981),
                        ),
                      );
                    },
                    child: Text(h ? 'स्वीकृत करें' : 'Approve'),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _kpiCard({
    required String title,
    required String value,
    required String sub,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(5),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF64748B),
                ),
              ),
              Icon(icon, color: color, size: 20),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            sub,
            style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
          ),
        ],
      ),
    );
  }

  Widget _actionTile({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircleAvatar(
              backgroundColor: color.withAlpha(25),
              radius: 20,
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1E293B),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
