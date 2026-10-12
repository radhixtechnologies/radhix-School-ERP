import 'package:flutter/material.dart';
import '../models/user_session.dart';
import 'login_screen.dart';
import '../services/api_service.dart';
import '../services/theme_service.dart';

class TeacherDashboardScreen extends StatefulWidget {
  final UserSession session;
  final bool isHindi;
  final VoidCallback onToggleLanguage;

  const TeacherDashboardScreen({
    super.key,
    required this.session,
    required this.isHindi,
    required this.onToggleLanguage,
  });

  @override
  State<TeacherDashboardScreen> createState() => _TeacherDashboardScreenState();
}

class _TeacherDashboardScreenState extends State<TeacherDashboardScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // 1. Attendance state
  final String _selectedClass = "Class 10 - Section A";
  final List<Map<String, dynamic>> _studentsAttendance = [
    {"id": "8acc441b-598a-41a5-93d5-f869d8a52de3", "roll": "01", "name": "Aanya Verma", "status": "P"},
    {"id": "6db2aae9-a48b-4841-b6f9-ed21af0f0caa", "roll": "02", "name": "Anik Sen", "status": "P"},
    {"id": "29ff12d9-786b-490d-8a96-8f3bed0d022f", "roll": "03", "name": "Dev Malhotra", "status": "A"},
    {"id": "496d6eda-c690-43b2-a613-f022e98ea90e", "roll": "04", "name": "Diya Singh", "status": "P"},
    {"id": "33194b57-c948-4599-9ada-f701e8fac331", "roll": "05", "name": "Ishaan Gupta", "status": "P"},
    {"id": "677c61cd-3485-4f0d-a0cf-d1370b36af6e", "roll": "06", "name": "Kavya Joshi", "status": "P"},
    {"id": "766bce16-beea-4f37-8c83-20e44d9e90ae", "roll": "07", "name": "Manav Chopra", "status": "L"},
    {"id": "889f9029-7b9f-4049-b769-dbd580fbeba4", "roll": "08", "name": "Nitya Reddy", "status": "P"},
    {"id": "3ebd1535-f358-4fed-8052-07c246eaa912", "roll": "09", "name": "Pranav Deshmukh", "status": "P"},
    {"id": "4228ea5c-024e-422c-be01-380348b52fc3", "roll": "10", "name": "Riya Mishra", "status": "P"},
    {"id": "3ff83477-c847-49c1-a20a-a3f3ff8ddcbb", "roll": "11", "name": "Rohan Mehta", "status": "P"},
    {"id": "217bc093-a8c9-4eb8-9541-5a6d0d791f81", "roll": "12", "name": "Aarav Kumar", "status": "P"},
  ];

  // 2. Homework upload state with Class & Section targeting
  final _hwSubjectController = TextEditingController(text: "Physics");
  final _hwTitleController = TextEditingController(text: "Ray Optics Numerical 10-15");
  final _hwDescController = TextEditingController(text: "Complete all questions from NCERT Chapter 10 in homework notebook.");
  DateTime _hwDueDate = DateTime.now().add(const Duration(days: 3));
  String _targetClass = "Class 10";
  String _targetSection = "Section A";
  final List<String> _classList = [
    "Class 10",
    "Class 9",
    "Class 8",
    "Class 7",
    "Class 6",
    "Class 11",
    "Class 12",
    "Class 5",
    "All Classes"
  ];
  final List<String> _sectionList = [
    "Section A",
    "Section B",
    "Section C",
    "Section D",
    "All Sections"
  ];

  final List<Map<String, dynamic>> _postedHomework = [
    {
      "id": "hw-phys-01",
      "subject": "Physics",
      "title": "Ray Optics & Mirror Formula",
      "className": "Class 10",
      "sectionName": "Section A",
      "dueDate": "14 Oct 2026",
      "submitted": 38,
      "total": 42
    },
    {
      "id": "hw-math-02",
      "subject": "Mathematics",
      "title": "Quadratic Equations Exercise 4.3",
      "className": "Class 10",
      "sectionName": "Section A",
      "dueDate": "15 Oct 2026",
      "submitted": 34,
      "total": 42
    },
    {
      "id": "hw-eng-03",
      "subject": "English Literature",
      "title": "First Flight: Letter to God",
      "className": "Class 10",
      "sectionName": "Section A",
      "dueDate": "16 Oct 2026",
      "submitted": 40,
      "total": 42
    },
  ];

  // 3. Marks entry state
  final String _selectedExam = "Term 1 Mid-Term Examination";
  final List<Map<String, dynamic>> _studentsMarks = [
    {"roll": "01", "name": "Aanya Verma", "marks": 94, "grade": "A+"},
    {"roll": "02", "name": "Anik Sen", "marks": 78, "grade": "B+"},
    {"roll": "03", "name": "Dev Malhotra", "marks": 85, "grade": "A"},
    {"roll": "04", "name": "Diya Singh", "marks": 96, "grade": "A+"},
    {"roll": "05", "name": "Ishaan Gupta", "marks": 70, "grade": "B"},
    {"roll": "06", "name": "Kavya Joshi", "marks": 90, "grade": "A+"},
    {"roll": "12", "name": "Aarav Kumar", "marks": 91, "grade": "A+"},
  ];

  // 4. Leave request state
  String _leaveType = "Casual Leave (CL)";
  final _leaveReasonController = TextEditingController();
  final List<Map<String, dynamic>> _pastLeaves = [
    {"type": "Medical Leave", "dates": "12-14 Aug 2026", "status": "APPROVED", "days": "2 Days"},
    {"type": "Casual Leave", "dates": "25 Sep 2026", "status": "APPROVED", "days": "1 Day"},
  ];

  // 5. Parent announcements
  final _announcementController = TextEditingController();
  final List<Map<String, dynamic>> _announcements = [
    {
      "title": "Science Practical Lab Notebook Submission",
      "date": "Today, 10:30 AM",
      "content": "All students must bring signed physics lab records tomorrow morning for inspection."
    },
    {
      "title": "PTM Reminder for Term 1",
      "date": "08 Oct 2026",
      "content": "Parent-Teacher meeting scheduled for 24th Oct. Please check your time slot."
    }
  ];

  List<Map<String, dynamic>> _recentSubmissions = [];
  bool _isLoadingSubmissions = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    _tabController.addListener(() {
      if (_tabController.index == 1) {
        _syncHomeworkAndSubmissions();
      }
    });
    _syncHomeworkAndSubmissions();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _syncHomeworkAndSubmissions() async {
    if (!mounted) return;
    setState(() => _isLoadingSubmissions = true);
    final allSubs = await ApiService.getAllSubmissions(widget.session.token);
    final remoteHw = await ApiService.getHomework(widget.session.token);

    if (!mounted) return;
    setState(() {
      _isLoadingSubmissions = false;
      _recentSubmissions = allSubs;

      // Update submission counts on existing posted homework
      for (var hw in _postedHomework) {
        final hwId = hw['id']?.toString() ?? '';
        final hwTitle = hw['title']?.toString().toLowerCase() ?? '';
        final count = allSubs.where((s) {
          final sHwId = s['homework_id']?.toString() ?? '';
          final sTitle = s['homework_title']?.toString().toLowerCase() ?? '';
          if (hwId.isNotEmpty && sHwId == hwId) return true;
          if (hwTitle.isNotEmpty && sTitle.isNotEmpty && (sTitle == hwTitle || sTitle.contains(hwTitle) || hwTitle.contains(sTitle))) return true;
          if (hwId.isNotEmpty && sHwId.isNotEmpty && (sHwId.contains(hwId) || hwId.contains(sHwId))) return true;
          return false;
        }).length;

        final base = hw['submitted'] is int ? hw['submitted'] as int : 0;
        hw['submitted'] = count > base ? count : (count > 0 ? (base > count ? base : count) : base);
      }

      // Merge any newly added homework from ApiService
      for (var rhw in remoteHw) {
        final rId = rhw['id']?.toString() ?? '';
        final rTitle = rhw['title']?.toString() ?? '';
        final exists = _postedHomework.any((p) =>
            (rId.isNotEmpty && p['id']?.toString() == rId) ||
            (rTitle.isNotEmpty && p['title']?.toString().toLowerCase() == rTitle.toLowerCase()));
        if (!exists) {
          final count = allSubs.where((s) =>
              s['homework_id']?.toString() == rId ||
              s['homework_title']?.toString().toLowerCase() == rTitle.toLowerCase()).length;
          _postedHomework.insert(0, {
            "id": rId,
            "subject": rhw['subject'] ?? "General",
            "title": rTitle,
            "className": rhw['class_name'] ?? _targetClass,
            "sectionName": rhw['section_name'] ?? _targetSection,
            "dueDate": rhw['due_date'] ?? "Soon",
            "submitted": count,
            "total": 42,
          });
        }
      }
    });
  }

  void _markAllPresent() {
    setState(() {
      for (var s in _studentsAttendance) {
        s["status"] = "P";
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("All students marked Present (P)!"), backgroundColor: Color(0xFF10B981)),
    );
  }

  void _saveAttendance() async {
    final pCount = _studentsAttendance.where((s) => s["status"] == "P").length;
    final aCount = _studentsAttendance.where((s) => s["status"] == "A").length;
    final lCount = _studentsAttendance.where((s) => s["status"] == "L").length;

    final dateStr = DateTime.now().toIso8601String().split('T')[0];
    final records = _studentsAttendance.map((s) => {
      "student_id": s["id"],
      "status": s["status"] == "P" ? "PRESENT" : s["status"] == "A" ? "ABSENT" : "LATE",
      "remarks": "Marked by Teacher Sunita Sharma",
    }).toList();

    await ApiService.saveBatchAttendance(widget.session.token, dateStr, records);

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Attendance saved & synced to ERP server! ($pCount Present, $aCount Absent, $lCount Late)"),
        backgroundColor: const Color(0xFF10B981),
      ),
    );
  }

  void _postHomework() async {
    if (_hwTitleController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("कृपया गृहकार्य शीर्षक दर्ज करें (Enter homework title)"), backgroundColor: Colors.red),
      );
      return;
    }
    final title = _hwTitleController.text.trim();
    final subject = _hwSubjectController.text.trim().isEmpty ? "General" : _hwSubjectController.text.trim();
    final desc = _hwDescController.text.trim();
    final dueDateStr = "${_hwDueDate.year}-${_hwDueDate.month.toString().padLeft(2, '0')}-${_hwDueDate.day.toString().padLeft(2, '0')}";
    final newHwId = "hw-${DateTime.now().millisecondsSinceEpoch}";

    setState(() {
      _postedHomework.insert(0, {
        "id": newHwId,
        "subject": subject,
        "title": title,
        "className": _targetClass,
        "sectionName": _targetSection,
        "dueDate": "${_hwDueDate.day}/${_hwDueDate.month}/${_hwDueDate.year}",
        "submitted": 0,
        "total": 42
      });
      _hwTitleController.clear();
      _hwDescController.clear();
    });

    await ApiService.createHomework(
      widget.session.token,
      id: newHwId,
      subject: subject,
      title: title,
      description: desc,
      dueDate: dueDateStr,
      className: _targetClass,
      sectionName: _targetSection,
    );
    _syncHomeworkAndSubmissions();

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("गृहकार्य सफलतापूर्वक $_targetClass ($_targetSection) को भेजा गया! (Synced to Student & Parent apps)"),
        backgroundColor: const Color(0xFF10B981),
      ),
    );
  }

  void _showSubmissionsModal(Map<String, dynamic> hw) async {
    final hwId = hw['id'] ?? 'hw-phys-01';
    final token = widget.session.token;

    // Load submissions from ApiService with title matching fallback
    List<dynamic> submissions = await ApiService.getHomeworkSubmissions(token, hwId, homeworkTitle: hw['title']);

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
                                        "${hw['className'] ?? 'Class 10'} • ${hw['sectionName'] ?? 'Section A'}",
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
                                        "$checked/$total Checked",
                                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF15803D)),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  hw['title'] ?? 'Homework Submissions',
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
                            "No student submissions yet.",
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
                                        backgroundColor: isChecked ? const Color(0xFFD1FAE5) : const Color(0xFFEEF2FF),
                                        child: Text(
                                          rollNo,
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 13,
                                            color: isChecked ? const Color(0xFF065F46) : const Color(0xFF4338CA),
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
                                          "Verified Upload",
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
                                                  _showGradeDialog(ctx, sub, (newMarks, newRemarks) {
                                                    setModalState(() {
                                                      sub['status'] = 'CHECKED';
                                                      sub['marks_obtained'] = newMarks;
                                                      sub['teacher_remarks'] = newRemarks;
                                                    });
                                                  });
                                                },
                                                style: TextButton.styleFrom(
                                                  padding: EdgeInsets.zero,
                                                  minimumSize: Size.zero,
                                                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                                ),
                                                child: const Text("Edit Grade", style: TextStyle(fontSize: 11, color: Color(0xFF0F766E), fontWeight: FontWeight.bold)),
                                              ),
                                            ],
                                          ),
                                          if (remarks != null && remarks.isNotEmpty) ...[
                                            const SizedBox(height: 4),
                                            Text(
                                              "Teacher Remarks: \"$remarks\"",
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
                                          _showGradeDialog(ctx, sub, (newMarks, newRemarks) {
                                            setModalState(() {
                                              sub['status'] = 'CHECKED';
                                              sub['marks_obtained'] = newMarks;
                                              sub['teacher_remarks'] = newRemarks;
                                            });
                                            setState(() {
                                              hw['submitted'] = (hw['submitted'] ?? 0);
                                            });
                                          });
                                        },
                                        icon: const Icon(Icons.rate_review, size: 16),
                                        label: const Text(
                                          "जांचें व टिप्पणी दें (Review & Grade Submission)",
                                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                                        ),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: const Color(0xFF474A74),
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

  void _showGradeDialog(
    BuildContext parentCtx,
    Map<String, dynamic> sub,
    Function(String marks, String remarks) onGraded,
  ) {
    final subId = sub['id'] ?? 'sub-aarav-01';
    final studentName = sub['student_name'] ?? 'Student';
    final marksCtrl = TextEditingController(text: sub['marks_obtained'] ?? "10 / 10");
    final remarksCtrl = TextEditingController(
      text: sub['teacher_remarks'] ?? "उत्कृष्ट कार्य! सभी प्रश्न सही हल किए गए हैं। (Excellent work! Fully verified)",
    );

    showDialog(
      context: context,
      builder: (dlgCtx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Row(
          children: [
            const Icon(Icons.grading, color: Color(0xFF474A74)),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                "Grade: $studentName",
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
                  labelText: "Teacher Remarks (शिक्षक की टिप्पणी)",
                  hintText: "e.g. Very neat calculations and diagrams.",
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
                    content: Text("$studentName का गृहकार्य जांचा गया और टिप्पणी सुरक्षित हुई! (Synced to Student & Parent)"),
                    backgroundColor: const Color(0xFF10B981),
                  ),
                );
              }
            },
            icon: const Icon(Icons.check, size: 16),
            label: const Text("अंक व टिप्पणी सुरक्षित करें"),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
        ],
      ),
    );
  }

  void _submitLeave() async {
    if (_leaveReasonController.text.trim().isEmpty) return;
    final reason = _leaveReasonController.text.trim();
    final today = DateTime.now().toIso8601String().split('T')[0];

    setState(() {
      _pastLeaves.insert(0, {
        "type": _leaveType,
        "dates": "Next Week",
        "status": "PENDING",
        "days": "1 Day"
      });
      _leaveReasonController.clear();
    });

    await ApiService.applyTeacherLeave(
      widget.session.token,
      leaveType: _leaveType.contains("Medical") ? "MEDICAL" : "CASUAL",
      startDate: today,
      endDate: today,
      reason: reason,
    );

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Leave request sent to Principal for approval!"), backgroundColor: Color(0xFF4F46E5)),
    );
  }

  void _sendAnnouncement() async {
    if (_announcementController.text.trim().isEmpty) return;
    final text = _announcementController.text.trim();
    setState(() {
      _announcements.insert(0, {
        "title": "Teacher Note to Parents (Class 10-A)",
        "date": "Just now",
        "content": text
      });
      _announcementController.clear();
    });

    await ApiService.createNotice(
      widget.session.token,
      title: "Teacher Circular: Class 10-A",
      content: text,
      targetAudience: "ALL",
      category: "GENERAL",
    );

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Announcement broadcast to Class Parents, Students & Admin!"), backgroundColor: Color(0xFF10B981)),
    );
  }

  void _showTeacherTicketsModal() {
    final h = widget.isHindi;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          final myTickets = ApiService.getTicketsSync(raisedByRole: 'TEACHER');

          return Container(
            height: MediaQuery.of(context).size.height * 0.85,
            decoration: const BoxDecoration(
              color: Color(0xFFF8FAFC),
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Column(
              children: [
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
                                child: Icon(Icons.support_agent, color: AppThemeController.instance.primaryColor),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    h ? "शिक्षक सहायता व टिकट (Helpdesk)" : "Teacher Helpdesk & Tickets",
                                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                                  ),
                                  Text(
                                    h ? "प्रिंसिपल व स्कूल एडमिन को समस्या भेजें" : "Raise issues & requests to School Admin",
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
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () => _showRaiseTicketDialog(ctx, () => setModalState(() {})),
                      icon: const Icon(Icons.add, size: 18),
                      label: Text(
                        h ? "+ स्कूल एडमिन को नई समस्या / टिकट दर्ज करें" : "+ Raise New Ticket to School Admin",
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppThemeController.instance.primaryColor,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: myTickets.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.check_circle_outline, size: 48, color: Colors.grey.shade400),
                              const SizedBox(height: 8),
                              Text(
                                h ? "कोई लंबित टिकट नहीं है" : "No tickets raised yet",
                                style: const TextStyle(color: Color(0xFF64748B), fontSize: 14),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          itemCount: myTickets.length,
                          itemBuilder: (context, idx) {
                            final t = myTickets[idx];
                            final isResolved = t['status'] == 'RESOLVED';
                            final isHigh = t['priority'] == 'HIGH';

                            return Container(
                              margin: const EdgeInsets.only(bottom: 12),
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(
                                  color: isResolved ? const Color(0xFFA7F3D0) : const Color(0xFFE2E8F0),
                                ),
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
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: isHigh ? const Color(0xFFFEE2E2) : const Color(0xFFEDE9FE),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          "${t['category']} • ${t['priority']}",
                                          style: TextStyle(
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                            color: isHigh ? const Color(0xFFDC2626) : const Color(0xFF6D28D9),
                                          ),
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: isResolved ? const Color(0xFFDCFCE7) : const Color(0xFFFEF3C7),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          isResolved ? (h ? "समाधान हुआ (RESOLVED)" : "RESOLVED") : (h ? "प्रक्रिया में (OPEN)" : "OPEN"),
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
                                  if (t['admin_response'] != null && (t['admin_response'] as String).isNotEmpty) ...[
                                    const SizedBox(height: 10),
                                    Container(
                                      padding: const EdgeInsets.all(10),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFF0FDF4),
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(color: const Color(0xFFBBF7D0)),
                                      ),
                                      child: Row(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          const Icon(Icons.verified, size: 16, color: Color(0xFF15803D)),
                                          const SizedBox(width: 8),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  h ? "प्रिंसिपल / एडमिन उत्तर:" : "Admin Resolution Response:",
                                                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF15803D)),
                                                ),
                                                Text(
                                                  t['admin_response'],
                                                  style: const TextStyle(fontSize: 12, color: Color(0xFF166534)),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
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

  void _showRaiseTicketDialog(BuildContext parentCtx, VoidCallback onCreated) {
    final titleCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    String category = 'Lab & Smartboard';
    String priority = 'MEDIUM';
    final h = widget.isHindi;

    showDialog(
      context: context,
      builder: (dlgCtx) => StatefulBuilder(
        builder: (context, setDlgState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          title: Row(
            children: [
              Icon(Icons.edit_note, color: AppThemeController.instance.primaryColor),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  h ? "प्रिंसिपल को टिकट भेजें" : "Raise Ticket to Admin",
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                DropdownButtonFormField<String>(
                  value: category,
                  decoration: InputDecoration(
                    labelText: h ? "श्रेणी (Category)" : "Category",
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  items: [
                    'Lab & Smartboard',
                    'Timetable & Exam Clash',
                    'Classroom Furniture & AC',
                    'Student Discipline Report',
                    'Administrative & Leave Issue',
                  ].map((c) => DropdownMenuItem(value: c, child: Text(c, style: const TextStyle(fontSize: 13)))).toList(),
                  onChanged: (val) => setDlgState(() => category = val!),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  value: priority,
                  decoration: InputDecoration(
                    labelText: h ? "प्राथमिकता (Priority)" : "Priority",
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  items: ['LOW', 'MEDIUM', 'HIGH'].map((p) => DropdownMenuItem(value: p, child: Text(p, style: const TextStyle(fontSize: 13)))).toList(),
                  onChanged: (val) => setDlgState(() => priority = val!),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: titleCtrl,
                  decoration: InputDecoration(
                    labelText: h ? "विषय / शीर्षक" : "Title / Subject",
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: descCtrl,
                  maxLines: 3,
                  decoration: InputDecoration(
                    labelText: h ? "विस्तृत विवरण" : "Description Details",
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
              child: Text(h ? "रद्द करें" : "Cancel"),
            ),
            ElevatedButton(
              onPressed: () async {
                if (titleCtrl.text.trim().isEmpty) return;
                await ApiService.createTicket(
                  token: widget.session.token,
                  title: titleCtrl.text.trim(),
                  description: descCtrl.text.trim(),
                  category: category,
                  priority: priority,
                  raisedByRole: 'TEACHER',
                  targetRole: 'SCHOOL_ADMIN',
                  authorName: widget.session.displayName.isNotEmpty ? widget.session.displayName : 'Teacher',
                );
                onCreated();
                if (dlgCtx.mounted) Navigator.pop(dlgCtx);
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(h ? "टिकट सफलतापूर्वक प्रिंसिपल/एडमिन को भेजा गया!" : "Ticket submitted to School Admin!"),
                      backgroundColor: const Color(0xFF10B981),
                    ),
                  );
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppThemeController.instance.primaryColor,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: Text(h ? "दर्ज करें" : "Submit Ticket"),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final h = widget.isHindi;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            // Header with Deep Navy Slate theme
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              decoration: BoxDecoration(
                color: AppThemeController.instance.primaryColor,
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(24),
                  bottomRight: Radius.circular(24),
                ),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.person, color: Colors.white, size: 26),
                          ),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                h ? "नमस्ते, सुनीता शर्मा 👋" : "Hi, Sunita Sharma 👋",
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                h ? "कक्षा 10-A अध्यापिका • भौतिक विज्ञान" : "Class 10-A Teacher • Science Faculty",
                                style: TextStyle(
                                  color: Colors.white.withValues(alpha: 0.85),
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          IconButton(
                            onPressed: () => AppThemeController.showThemePickerDialog(context, h),
                            icon: const Icon(Icons.palette_outlined, color: Colors.white),
                            tooltip: h ? "थीम बदलें (App Theme)" : "App Theme",
                          ),
                          IconButton(
                            onPressed: _showTeacherTicketsModal,
                            icon: const Icon(Icons.support_agent_outlined, color: Colors.white),
                            tooltip: h ? "प्रिंसिपल/एडमिन को टिकट भेजें" : "Helpdesk Tickets",
                          ),
                          IconButton(
                            onPressed: widget.onToggleLanguage,
                            icon: const Icon(Icons.language, color: Colors.white),
                            tooltip: "Language",
                          ),
                          IconButton(
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
                            icon: const Icon(Icons.logout, color: Colors.white),
                            tooltip: "Logout",
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  // School Info Tag
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.school, color: Colors.amberAccent, size: 16),
                            const SizedBox(width: 8),
                            Text(
                              widget.session.instituteName.isNotEmpty
                                  ? widget.session.instituteName
                                  : "Delhi Public Academy",
                              style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            h ? "सत्र 2026-27" : "Session 2026-27",
                            style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Tab Bar
            Container(
              color: Colors.white,
              child: TabBar(
                controller: _tabController,
                isScrollable: true,
                labelColor: const Color(0xFF474A74),
                unselectedLabelColor: const Color(0xFF64748B),
                indicatorColor: const Color(0xFF474A74),
                indicatorWeight: 3,
                labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                tabs: [
                  Tab(icon: const Icon(Icons.check_circle_outline, size: 18), text: h ? "हाजिरी" : "Attendance"),
                  Tab(icon: const Icon(Icons.menu_book, size: 18), text: h ? "गृहकार्य" : "Homework"),
                  Tab(icon: const Icon(Icons.emoji_events_outlined, size: 18), text: h ? "अंक" : "Marks"),
                  Tab(icon: const Icon(Icons.schedule, size: 18), text: h ? "टाइमटेबल" : "Timetable"),
                  Tab(icon: const Icon(Icons.campaign_outlined, size: 18), text: h ? "सूचना" : "Announce"),
                ],
              ),
            ),

            // Tab Views
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildAttendanceTab(h),
                  _buildHomeworkTab(h),
                  _buildMarksTab(h),
                  _buildTimetableAndLeavesTab(h),
                  _buildAnnouncementsTab(h),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 1. Attendance Tab
  Widget _buildAttendanceTab(bool h) {
    final pCount = _studentsAttendance.where((s) => s["status"] == "P").length;
    final aCount = _studentsAttendance.where((s) => s["status"] == "A").length;
    final lCount = _studentsAttendance.where((s) => s["status"] == "L").length;

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_selectedClass, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  Text(h ? "आज: 11 अक्टूबर 2026" : "Today: 11 Oct 2026", style: const TextStyle(color: Colors.grey, fontSize: 12)),
                ],
              ),
              ElevatedButton.icon(
                onPressed: _markAllPresent,
                icon: const Icon(Icons.done_all, size: 16),
                label: Text(h ? "सभी उपस्थित" : "All Present"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _buildCounterCard(h ? "उपस्थित (P)" : "Present", "$pCount", const Color(0xFF10B981)),
              const SizedBox(width: 8),
              _buildCounterCard(h ? "अनुपस्थित (A)" : "Absent", "$aCount", const Color(0xFFEF4444)),
              const SizedBox(width: 8),
              _buildCounterCard(h ? "देरी से (L)" : "Late", "$lCount", const Color(0xFFF59E0B)),
            ],
          ),
          const SizedBox(height: 12),
          Expanded(
            child: ListView.separated(
              itemCount: _studentsAttendance.length,
              separatorBuilder: (_, _) => const SizedBox(height: 8),
              itemBuilder: (context, idx) {
                final student = _studentsAttendance[idx];
                final status = student["status"];
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          "#${student['roll']}",
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF474A74)),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          student["name"],
                          style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                        ),
                      ),
                      _buildStatusToggle("P", status == "P", const Color(0xFF10B981), () {
                        setState(() => student["status"] = "P");
                      }),
                      const SizedBox(width: 6),
                      _buildStatusToggle("A", status == "A", const Color(0xFFEF4444), () {
                        setState(() => student["status"] = "A");
                      }),
                      const SizedBox(width: 6),
                      _buildStatusToggle("L", status == "L", const Color(0xFFF59E0B), () {
                        setState(() => student["status"] = "L");
                      }),
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 8),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _saveAttendance,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF474A74),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text(
                h ? "हाजिरी सबमिट करें" : "Submit Attendance",
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusToggle(String label, bool isSelected, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 34,
        height: 34,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: isSelected ? color : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: isSelected ? color : const Color(0xFFCBD5E1), width: 1.5),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : const Color(0xFF64748B),
            fontSize: 13,
          ),
        ),
      ),
    );
  }

  Widget _buildCounterCard(String title, String val, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color.withValues(alpha: 0.3)),
        ),
        child: Column(
          children: [
            Text(val, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 2),
            Text(title, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: color)),
          ],
        ),
      ),
    );
  }

  // 2. Homework Tab with Class & Section Targeting
  Widget _buildHomeworkTab(bool h) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withAlpha(5),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.add_task, color: Color(0xFF474A74), size: 20),
                    const SizedBox(width: 8),
                    Text(
                      h ? "नया गृहकार्य असाइन करें (Target Class & Section)" : "Assign New Homework",
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // 1. Target Class & Target Section Selectors (Exact user requirement!)
                Row(
                  children: [
                    Expanded(
                      flex: 3,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        decoration: BoxDecoration(
                          border: Border.all(color: const Color(0xFFCBD5E1)),
                          borderRadius: BorderRadius.circular(10),
                          color: const Color(0xFFF8FAFC),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: _targetClass,
                            isExpanded: true,
                            icon: const Icon(Icons.arrow_drop_down, color: Color(0xFF474A74)),
                            items: _classList.map((cls) => DropdownMenuItem(
                              value: cls,
                              child: Row(
                                children: [
                                  const Icon(Icons.school, size: 16, color: Color(0xFF474A74)),
                                  const SizedBox(width: 6),
                                  Text(cls, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            )).toList(),
                            onChanged: (val) {
                              if (val != null) setState(() => _targetClass = val);
                            },
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      flex: 2,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        decoration: BoxDecoration(
                          border: Border.all(color: const Color(0xFFCBD5E1)),
                          borderRadius: BorderRadius.circular(10),
                          color: const Color(0xFFF8FAFC),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: _targetSection,
                            isExpanded: true,
                            icon: const Icon(Icons.arrow_drop_down, color: Color(0xFF474A74)),
                            items: _sectionList.map((sec) => DropdownMenuItem(
                              value: sec,
                              child: Text(sec, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                            )).toList(),
                            onChanged: (val) {
                              if (val != null) setState(() => _targetSection = val);
                            },
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // 2. Subject & Due Date Picker Row
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _hwSubjectController,
                        decoration: InputDecoration(
                          labelText: h ? "विषय (Subject)" : "Subject",
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: InkWell(
                        onTap: () async {
                          final picked = await showDatePicker(
                            context: context,
                            initialDate: _hwDueDate,
                            firstDate: DateTime.now(),
                            lastDate: DateTime.now().add(const Duration(days: 90)),
                          );
                          if (picked != null) {
                            setState(() => _hwDueDate = picked);
                          }
                        },
                        borderRadius: BorderRadius.circular(10),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
                          decoration: BoxDecoration(
                            border: Border.all(color: const Color(0xFFCBD5E1)),
                            borderRadius: BorderRadius.circular(10),
                            color: const Color(0xFFF8FAFC),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.calendar_month, size: 16, color: Color(0xFF474A74)),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  "${_hwDueDate.day}/${_hwDueDate.month}/${_hwDueDate.year}",
                                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // 3. Homework Title
                TextField(
                  controller: _hwTitleController,
                  decoration: InputDecoration(
                    labelText: h ? "गृहकार्य शीर्षक (Title)" : "Homework Title",
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  ),
                ),
                const SizedBox(height: 10),

                // 4. Instructions
                TextField(
                  controller: _hwDescController,
                  maxLines: 2,
                  decoration: InputDecoration(
                    labelText: h ? "निर्देश / विवरण (Instructions)" : "Instructions / Questions",
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  ),
                ),
                const SizedBox(height: 14),

                // 5. Submit Button with target class indicator
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _postHomework,
                    icon: const Icon(Icons.cloud_upload_outlined, size: 18),
                    label: Text(
                      h
                          ? "$_targetClass ($_targetSection) को गृहकार्य भेजें"
                          : "Upload & Send to $_targetClass ($_targetSection)",
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF474A74),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      elevation: 2,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                h ? "सक्रिय गृहकार्य सूची (Active Homework Assigned)" : "Active Homework Assigned",
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A)),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  "${_postedHomework.length} Active",
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF474A74)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ..._postedHomework.map((hw) => Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
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
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEEF2FF),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.menu_book, color: Color(0xFF4F46E5), size: 20),
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
                                      color: const Color(0xFFF3E8FF),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      "${hw['className'] ?? 'Class 10'} • ${hw['sectionName'] ?? 'Sec A'}",
                                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF7C3AED)),
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Expanded(
                                    child: Text(
                                      hw["title"] ?? "",
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                "${hw['subject']} • Due: ${hw['dueDate']}",
                                style: const TextStyle(color: Colors.grey, fontSize: 11),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF0FDF4),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFFBBF7D0)),
                          ),
                          child: Column(
                            children: [
                              Text(
                                "${hw['submitted']}/${hw['total']}",
                                style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF15803D), fontSize: 13),
                              ),
                              Text(
                                h ? "जमा हुए" : "Submitted",
                                style: const TextStyle(fontSize: 9, color: Color(0xFF166534), fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Divider(height: 1, color: Colors.grey.shade200),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          h ? "विद्यार्थी उत्तर देखने के लिए टैप करें" : "Tap to inspect all solutions",
                          style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                        ),
                        InkWell(
                          onTap: () => _showSubmissionsModal(hw),
                          borderRadius: BorderRadius.circular(6),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF1F5F9),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.visibility_outlined, size: 14, color: Color(0xFF474A74)),
                                const SizedBox(width: 4),
                                Text(
                                  h ? "उत्तर देखें (${hw['submitted']})" : "View Submissions (${hw['submitted']})",
                                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF474A74)),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              )),
          const SizedBox(height: 24),

          // Live Submissions Section (Directly visible to teacher)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.mark_email_read_outlined, size: 18, color: Color(0xFF474A74)),
                  const SizedBox(width: 6),
                  Text(
                    h ? "छात्रों द्वारा हाल ही में जमा उत्तर" : "Recent Student Submissions",
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A)),
                  ),
                  const SizedBox(width: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEDE9FE),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      "${_recentSubmissions.length}",
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF6D28D9)),
                    ),
                  ),
                ],
              ),
              InkWell(
                onTap: _syncHomeworkAndSubmissions,
                borderRadius: BorderRadius.circular(6),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                  child: Row(
                    children: [
                      _isLoadingSubmissions
                          ? const SizedBox(
                              width: 12,
                              height: 12,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF474A74)),
                            )
                          : const Icon(Icons.refresh, size: 14, color: Color(0xFF474A74)),
                      const SizedBox(width: 4),
                      Text(
                        h ? "रिफ्रेश" : "Refresh",
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF474A74)),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          if (_recentSubmissions.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  const Icon(Icons.inbox_outlined, size: 36, color: Color(0xFF94A3B8)),
                  const SizedBox(height: 8),
                  Text(
                    h ? "अभी तक किसी छात्र ने उत्तर जमा नहीं किया है" : "No student submissions yet",
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF474A74)),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    h
                        ? "विद्यार्थी द्वारा सबमिट करते ही यहाँ तुरंत दिखाई देगा।"
                        : "Student homework submissions will appear here automatically in real time.",
                    style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            )
          else
            ..._recentSubmissions.map((sub) => _buildRecentSubmissionCard(sub, h)),
        ],
      ),
    );
  }

  Widget _buildRecentSubmissionCard(Map<String, dynamic> sub, bool h) {
    final isChecked = sub['status'] == 'CHECKED';
    final studentName = sub['student_name'] ?? 'Student';
    final rollNo = sub['roll_number'] ?? '01';
    final admNo = sub['admission_number'] ?? 'DPS-2026';
    final cls = sub['class_name'] ?? 'Class 10';
    final sec = sub['section_name'] ?? 'Section A';
    final hwTitle = sub['homework_title'] ?? 'Homework';
    final subject = sub['subject'] ?? 'General';
    final subTime = sub['submitted_at'] ?? 'Recently';
    final subText = sub['submission_text'] ?? 'Completed assigned questions.';
    final fileName = sub['file_name'] ?? 'assignment_solution.pdf';
    final marks = sub['marks_obtained'];
    final remarks = sub['teacher_remarks'];

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isChecked ? const Color(0xFFBBF7D0) : const Color(0xFFE2E8F0),
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
          // Header: Student info & status chip
          Row(
            children: [
              CircleAvatar(
                radius: 18,
                backgroundColor: isChecked ? const Color(0xFFD1FAE5) : const Color(0xFFEEF2FF),
                child: Text(
                  rollNo,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    color: isChecked ? const Color(0xFF065F46) : const Color(0xFF4338CA),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            studentName,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            "$cls ($sec)",
                            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Color(0xFF475569)),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "Adm: $admNo • $subTime",
                      style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: isChecked ? const Color(0xFFDCFCE7) : const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      isChecked ? Icons.check_circle : Icons.schedule,
                      size: 11,
                      color: isChecked ? const Color(0xFF15803D) : const Color(0xFFB45309),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      isChecked ? (marks != null ? "CHECKED • $marks" : "CHECKED") : "NEW SUBMISSION",
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        color: isChecked ? const Color(0xFF15803D) : const Color(0xFFB45309),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Homework context bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                const Icon(Icons.assignment, size: 14, color: Color(0xFF474A74)),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    "$hwTitle ($subject)",
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 8),

          // Student Notes / Solution preview
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  h ? "विद्यार्थी द्वारा समाधान टिप्पणी:" : "Student Solution Notes:",
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 2),
                Text(
                  subText,
                  style: const TextStyle(fontSize: 11, color: Color(0xFF1E293B), height: 1.3),
                ),
              ],
            ),
          ),

          const SizedBox(height: 8),

          // Attached file chip
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFEFF6FF),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFBFDBFE)),
            ),
            child: Row(
              children: [
                const Icon(Icons.picture_as_pdf, color: Color(0xFF2563EB), size: 14),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    fileName,
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF1E40AF)),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Text(
                  h ? "अपलोड सत्यापित" : "Verified Upload",
                  style: const TextStyle(fontSize: 9, color: Color(0xFF3B82F6), fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),

          // Remarks if checked
          if (isChecked && remarks != null && remarks.toString().isNotEmpty) ...[
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFBBF7D0)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.comment, size: 13, color: Color(0xFF15803D)),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      "Remarks: \"$remarks\"",
                      style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: Color(0xFF166534)),
                    ),
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 10),

          // Action button to Grade / Review
          SizedBox(
            width: double.infinity,
            child: isChecked
                ? OutlinedButton.icon(
                    onPressed: () {
                      _showGradeDialog(context, sub, (newMarks, newRemarks) {
                        _syncHomeworkAndSubmissions();
                      });
                    },
                    icon: const Icon(Icons.edit_note, size: 16),
                    label: Text(
                      h ? "अंक व टिप्पणी संपादित करें (Edit Grade)" : "Edit Grade & Remarks",
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF474A74),
                      side: const BorderSide(color: Color(0xFF474A74)),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  )
                : ElevatedButton.icon(
                    onPressed: () {
                      _showGradeDialog(context, sub, (newMarks, newRemarks) {
                        _syncHomeworkAndSubmissions();
                      });
                    },
                    icon: const Icon(Icons.rate_review, size: 16),
                    label: Text(
                      h ? "जांचें व टिप्पणी दें (Review & Grade)" : "Review & Grade Submission",
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF474A74),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  // 3. Marks Tab
  Widget _buildMarksTab(bool h) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(_selectedExam, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: const Color(0xFFEEF2FF), borderRadius: BorderRadius.circular(8)),
                child: const Text("Science (100)", style: TextStyle(color: Color(0xFF4338CA), fontWeight: FontWeight.bold, fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Expanded(
            child: ListView.separated(
              itemCount: _studentsMarks.length,
              separatorBuilder: (_, _) => const SizedBox(height: 8),
              itemBuilder: (context, idx) {
                final s = _studentsMarks[idx];
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Row(
                    children: [
                      Text("#${s['roll']}", style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Text(s["name"], style: const TextStyle(fontWeight: FontWeight.w700)),
                      ),
                      Text("${s['marks']}/100", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      const SizedBox(width: 10),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFDCFCE7),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(s["grade"], style: const TextStyle(color: Color(0xFF15803D), fontWeight: FontWeight.bold, fontSize: 11)),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Marks saved & updated in report cards!"), backgroundColor: Color(0xFF10B981)),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF474A74),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text(h ? "अंक सुरक्षित करें" : "Save & Publish Marks", style: const TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  // 4. Timetable & Leave Requests
  Widget _buildTimetableAndLeavesTab(bool h) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(h ? "आज का शिक्षण शेड्यूल (Today's Periods)" : "Today's Teaching Schedule", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 10),
          _buildPeriodCard("08:30 - 09:15 AM", "Class 10-A", "Physics Theory", "Room 302"),
          _buildPeriodCard("10:00 - 10:45 AM", "Class 9-B", "General Science", "Room 204"),
          _buildPeriodCard("11:45 - 12:30 PM", "Class 10-A", "Physics Practical Lab", "Science Lab 1"),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.event_busy, color: Color(0xFF474A74), size: 20),
                    const SizedBox(width: 8),
                    Text(h ? "छुट्टी का आवेदन (Apply Leave)" : "Apply for Teacher Leave", style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  initialValue: _leaveType,
                  items: ["Casual Leave (CL)", "Medical Leave (ML)", "Duty Leave (OD)"]
                      .map((t) => DropdownMenuItem(value: t, child: Text(t, style: const TextStyle(fontSize: 13))))
                      .toList(),
                  onChanged: (v) => setState(() => _leaveType = v ?? _leaveType),
                  decoration: InputDecoration(
                    labelText: "Leave Type",
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _leaveReasonController,
                  decoration: InputDecoration(
                    labelText: h ? "अवकाश का कारण (Reason)" : "Reason for Leave",
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _submitLeave,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF474A74),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    child: Text(h ? "आवेदन भेजें" : "Submit Leave Application"),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Text(h ? "हाल के अवकाश आवेदन" : "Recent Leave History", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 8),
          ..._pastLeaves.map((l) => Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(l["type"], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        Text("${l['dates']} • ${l['days']}", style: const TextStyle(color: Colors.grey, fontSize: 11)),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: l["status"] == "APPROVED" ? const Color(0xFFDCFCE7) : const Color(0xFFFEF3C7),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        l["status"],
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: l["status"] == "APPROVED" ? const Color(0xFF15803D) : const Color(0xFFB45309),
                        ),
                      ),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }

  Widget _buildPeriodCard(String time, String cls, String sub, String room) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(8)),
            child: Text(time, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFF474A74))),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("$cls • $sub", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                Text(room, style: const TextStyle(color: Colors.grey, fontSize: 11)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // 5. Announcements Tab
  Widget _buildAnnouncementsTab(bool h) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.campaign, color: Color(0xFF474A74), size: 22),
                    const SizedBox(width: 8),
                    Text(
                      h ? "अभिभावकों को संदेश भेजें" : "Broadcast Message to Parents",
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _announcementController,
                  maxLines: 3,
                  decoration: InputDecoration(
                    hintText: h ? "अभिभावकों के लिए संदेश लिखें..." : "Type notice or update for class parents...",
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _sendAnnouncement,
                    icon: const Icon(Icons.send, size: 16),
                    label: Text(h ? "नोटिस भेजें" : "Send Announcement"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF474A74),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Text(h ? "हाल की घोषणाएं" : "Recent Broadcasts", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 10),
          ..._announcements.map((a) => Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(a["title"], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF474A74))),
                        Text(a["date"], style: const TextStyle(color: Colors.grey, fontSize: 11)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(a["content"], style: const TextStyle(color: Color(0xFF334155), fontSize: 12, height: 1.4)),
                  ],
                ),
              )),
        ],
      ),
    );
  }
}
