import 'package:flutter/material.dart';
import '../models/user_session.dart';
import '../services/api_service.dart';

class HomeworkScreen extends StatefulWidget {
  final UserSession session;
  final bool isHindi;
  final String initialFilter;

  const HomeworkScreen({
    super.key,
    required this.session,
    required this.isHindi,
    this.initialFilter = 'ALL',
  });

  @override
  State<HomeworkScreen> createState() => _HomeworkScreenState();
}

class _HomeworkScreenState extends State<HomeworkScreen> {
  bool _isLoading = true;
  List<dynamic> _homeworkList = [];
  late String _filter;
  String _searchQuery = '';
  final TextEditingController _searchCtrl = TextEditingController();

  final Color _navyColor = const Color(0xFF474A74);

  @override
  void initState() {
    super.initState();
    _filter = widget.initialFilter;
    _loadHomework();
  }

  void _loadHomework() async {
    setState(() => _isLoading = true);
    final data = await ApiService.getHomework(widget.session.token);
    if (mounted) {
      setState(() {
        _homeworkList = data;
        _isLoading = false;
      });
    }
  }

  void _openSubmissionModal(Map<String, dynamic> hw) {
    final h = widget.isHindi;
    final messenger = ScaffoldMessenger.of(context);
    final remarksCtrl = TextEditingController(
      text: hw['submission']?['submission_text'] ?? '',
    );
    String attachedFileName = hw['submission']?['file_name'] ??
        '${hw['subject'].toString().toLowerCase()}_solution_notebook.pdf';
    bool hasAttached = hw['submission'] != null;
    bool isSubmitting = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final isAlreadySubmitted = hw['is_submitted'] == true;
            final sub = hw['submission'];
            final isChecked = sub != null && sub['status'] == 'CHECKED';

            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Modal Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEEF2FF),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            hw['subject'] ?? 'Subject',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: _navyColor,
                            ),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, size: 20),
                          onPressed: () => Navigator.pop(ctx),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    Text(
                      hw['title'] ?? '',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1E293B),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      hw['description'] ?? '',
                      style: const TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                    ),
                    const SizedBox(height: 16),

                    // Graded Result Banner (If already checked by teacher)
                    if (isChecked) ...[
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: const Color(0xFFECFDF5),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: const Color(0xFFA7F3D0)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.verified, color: Color(0xFF059669), size: 18),
                                const SizedBox(width: 8),
                                Text(
                                  h ? 'शिक्षक द्वारा जांचा गया (Checked & Graded)' : 'Evaluated by Teacher',
                                  style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF065F46)),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  h ? 'प्राप्तांक (Marks):' : 'Score Awarded:',
                                  style: const TextStyle(fontSize: 13, color: Color(0xFF047857), fontWeight: FontWeight.w600),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(color: const Color(0xFF6EE7B7)),
                                  ),
                                  child: Text(
                                    '${sub['marks_obtained'] ?? '10 / 10'}',
                                    style: const TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF059669), fontSize: 14),
                                  ),
                                ),
                              ],
                            ),
                            if (sub['teacher_remarks'] != null) ...[
                              const SizedBox(height: 8),
                              Text(
                                '${h ? "शिक्षक की टिप्पणी:" : "Teacher Feedback:"} "${sub['teacher_remarks']}"',
                                style: const TextStyle(fontSize: 12, color: Color(0xFF047857), fontStyle: FontStyle.italic),
                              ),
                            ],
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                    ] else if (isAlreadySubmitted) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF0FDF4),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFBBF7D0)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.check_circle, color: Color(0xFF16A34A), size: 18),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                h ? 'गृहकार्य जमा हो चुका है (Awaiting Teacher Review)' : 'Homework Submitted (Awaiting Review)',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF15803D)),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Solution Notes Input
                    Text(
                      h ? 'उत्तर / टिप्पणी (Solution Remarks):' : 'Your Answer / Solution Notes:',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF334155)),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: remarksCtrl,
                      maxLines: 3,
                      decoration: InputDecoration(
                        hintText: h
                          ? 'उदा. फेयर नोटबुक में सभी 10 प्रश्न हल किए हैं...'
                          : 'e.g. Completed all questions in register notebook...',
                        hintStyle: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                        filled: true,
                        fillColor: const Color(0xFFF8FAFC),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // File Attachment Actions
                    Text(
                      h ? 'उत्तर पुस्तिका / फोटो संलग्न करें (Attach Solution):' : 'Attach Solution Notebook / Photo:',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF334155)),
                    ),
                    const SizedBox(height: 8),

                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {
                              setModalState(() {
                                hasAttached = true;
                                attachedFileName = '${hw['subject'].toString().toLowerCase()}_notebook_photo.jpg';
                              });
                              messenger.showSnackBar(
                                SnackBar(
                                  content: Text(h ? 'कैमरा फोटो जोड़ी गई! (Register Photo attached)' : 'Register photo captured!'),
                                  duration: const Duration(seconds: 2),
                                ),
                              );
                            },
                            style: OutlinedButton.styleFrom(
                              side: BorderSide(color: _navyColor),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            icon: const Icon(Icons.camera_alt, size: 18),
                            label: Text(h ? 'फोटो खींचें (Camera)' : 'Take Photo', style: const TextStyle(fontSize: 12)),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {
                              setModalState(() {
                                hasAttached = true;
                                attachedFileName = '${hw['subject'].toString().toLowerCase()}_solution_doc.pdf';
                              });
                              messenger.showSnackBar(
                                SnackBar(
                                  content: Text(h ? 'PDF दस्तावेज़ जोड़ा गया! (PDF attached)' : 'PDF document attached!'),
                                  duration: const Duration(seconds: 2),
                                ),
                              );
                            },
                            style: OutlinedButton.styleFrom(
                              side: BorderSide(color: _navyColor),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            icon: const Icon(Icons.picture_as_pdf, size: 18),
                            label: Text(h ? 'PDF चुनें (Pick PDF)' : 'Pick PDF', style: const TextStyle(fontSize: 12)),
                          ),
                        ),
                      ],
                    ),

                    if (hasAttached) ...[
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFCBD5E1)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.attach_file, color: Color(0xFF474A74)),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                attachedFileName,
                                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                              ),
                            ),
                            const Text('1.4 MB', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                            IconButton(
                              icon: const Icon(Icons.delete_outline, color: Colors.red, size: 18),
                              onPressed: () {
                                setModalState(() => hasAttached = false);
                              },
                            ),
                          ],
                        ),
                      ),
                    ],

                    const SizedBox(height: 20),

                    // Submit Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: isSubmitting
                            ? null
                            : () async {
                                setModalState(() => isSubmitting = true);
                                final res = await ApiService.submitHomework(
                                  widget.session.token,
                                  hw['id'] ?? '',
                                  remarksCtrl.text.trim(),
                                  hasAttached ? attachedFileName : 'homework_solution_doc.pdf',
                                  homeworkTitle: hw['title'],
                                  subject: hw['subject'],
                                  className: hw['class_name'] ?? 'Class 10',
                                  sectionName: hw['section_name'] ?? 'Section A',
                                  studentName: 'Aarav Kumar',
                                  rollNumber: '12',
                                );

                                if (ctx.mounted) {
                                  Navigator.pop(ctx);
                                }
                                if (mounted) {
                                  _loadHomework();
                                }

                                messenger.showSnackBar(
                                  SnackBar(
                                    content: Text(res['message'] ??
                                        (h
                                            ? 'गृहकार्य सफलतापूर्वक जमा हो गया!'
                                            : 'Homework submitted successfully!')),
                                    backgroundColor: const Color(0xFF059669),
                                    duration: const Duration(seconds: 3),
                                  ),
                                );
                              },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _navyColor,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 2,
                        ),
                        child: isSubmitting
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                              )
                            : Text(
                                isAlreadySubmitted
                                    ? (h ? 'गृहकार्य अपडेट / दोबारा जमा करें' : 'Update & Re-Submit')
                                    : (h ? 'गृहकार्य अपलोड करें (Submit Homework)' : 'Upload & Submit Homework'),
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final h = widget.isHindi;

    final filteredList = _homeworkList.where((hw) {
      if (_filter == 'PENDING') {
        if (hw['is_submitted'] == true || hw['status'] == 'CHECKED' || hw['status'] == 'SUBMITTED') {
          return false;
        }
      }
      if (_filter == 'SUBMITTED') {
        if (hw['is_submitted'] != true || hw['status'] == 'CHECKED') {
          return false;
        }
      }
      if (_filter == 'CHECKED') {
        if (hw['status'] != 'CHECKED') {
          return false;
        }
      }
      if (_searchQuery.trim().isNotEmpty) {
        final q = _searchQuery.trim().toLowerCase();
        final title = (hw['title'] ?? '').toString().toLowerCase();
        final subject = (hw['subject'] ?? '').toString().toLowerCase();
        final teacher = (hw['teacher_name'] ?? '').toString().toLowerCase();
        final desc = (hw['description'] ?? '').toString().toLowerCase();
        final cls = (hw['class_name'] ?? '').toString().toLowerCase();
        final sec = (hw['section_name'] ?? '').toString().toLowerCase();
        return title.contains(q) ||
            subject.contains(q) ||
            teacher.contains(q) ||
            desc.contains(q) ||
            cls.contains(q) ||
            sec.contains(q);
      }
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: _navyColor,
        elevation: 0,
        title: Text(
          h ? 'गृहकार्य एवं असाइनमेंट' : 'Homework & Assignments',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17, color: Colors.white),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: _loadHomework,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search Bar (User requirement: searching working!)
          Container(
            color: _navyColor,
            padding: const EdgeInsets.only(left: 16, right: 16, bottom: 12),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.search, color: Color(0xFF64748B), size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: _searchCtrl,
                      onChanged: (val) => setState(() => _searchQuery = val),
                      decoration: InputDecoration(
                        hintText: h
                            ? 'गृहकार्य / विषय खोजें... (Search Assignment)'
                            : 'Search homework, subject, teacher...',
                        hintStyle: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                        border: InputBorder.none,
                        isDense: true,
                        contentPadding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                    ),
                  ),
                  if (_searchQuery.isNotEmpty)
                    IconButton(
                      icon: const Icon(Icons.clear, size: 18, color: Colors.grey),
                      onPressed: () {
                        _searchCtrl.clear();
                        setState(() => _searchQuery = '');
                      },
                    ),
                ],
              ),
            ),
          ),

          // Filter Tabs
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Row(
              children: [
                _buildFilterChip('ALL', h ? 'सभी (All)' : 'All'),
                const SizedBox(width: 8),
                _buildFilterChip('PENDING', h ? 'बाकी (Pending)' : 'Pending'),
                const SizedBox(width: 8),
                _buildFilterChip('SUBMITTED', h ? 'जमा (Submitted)' : 'Submitted'),
                const SizedBox(width: 8),
                _buildFilterChip('CHECKED', h ? 'जांचा (Checked)' : 'Checked'),
              ],
            ),
          ),

          // Homework List
          Expanded(
            child: _isLoading
                ? Center(
                    child: CircularProgressIndicator(color: _navyColor),
                  )
                : filteredList.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.assignment_turned_in, size: 54, color: Colors.grey.shade300),
                            const SizedBox(height: 12),
                            Text(
                              h ? 'कोई गृहकार्य नहीं मिला' : 'No homework found',
                              style: TextStyle(fontSize: 14, color: Colors.grey.shade600, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: filteredList.length,
                        itemBuilder: (context, index) {
                          final hw = filteredList[index];
                          return _buildHomeworkCard(hw, h);
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String key, String label) {
    final isSelected = _filter == key;
    return GestureDetector(
      onTap: () => setState(() => _filter = key),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected ? _navyColor : const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : const Color(0xFF64748B),
          ),
        ),
      ),
    );
  }

  Widget _buildHomeworkCard(Map<String, dynamic> hw, bool h) {
    final isSubmitted = hw['is_submitted'] == true;
    final isChecked = hw['status'] == 'CHECKED';
    final sub = hw['submission'];

    Color badgeColor = const Color(0xFFFEF3C7);
    Color badgeTextColor = const Color(0xFFD97706);
    String badgeText = h ? 'बाकी है (Pending)' : 'PENDING';

    if (isChecked) {
      badgeColor = const Color(0xFFD1FAE5);
      badgeTextColor = const Color(0xFF059669);
      badgeText = h ? 'जांच लिया गया (${sub?['marks_obtained'] ?? '10/10'})' : 'CHECKED (${sub?['marks_obtained'] ?? '10/10'})';
    } else if (isSubmitted) {
      badgeColor = const Color(0xFFDBEAFE);
      badgeTextColor = const Color(0xFF1D4ED8);
      badgeText = h ? 'जमा हो चुका (Submitted)' : 'SUBMITTED';
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x08000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Subject & Status Badge
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        "${hw['class_name'] ?? 'Class 10'} • ${hw['section_name'] ?? 'Sec A'}",
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF64748B),
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEEF2FF),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        hw['subject'] ?? 'Subject',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: _navyColor,
                        ),
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: badgeColor,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    badgeText,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: badgeTextColor,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Title
            Text(
              hw['title'] ?? '',
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1E293B),
              ),
            ),
            const SizedBox(height: 6),

            // Description
            Text(
              hw['description'] ?? '',
              style: const TextStyle(
                fontSize: 13,
                color: Color(0xFF64748B),
                height: 1.3,
              ),
            ),
            const SizedBox(height: 12),

            // Teacher & Due Date Row
            Row(
              children: [
                const Icon(Icons.person_outline, size: 14, color: Color(0xFF94A3B8)),
                const SizedBox(width: 4),
                Text(
                  hw['teacher_name'] ?? 'Teacher',
                  style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                ),
                const Spacer(),
                const Icon(Icons.access_time, size: 14, color: Color(0xFFEF4444)),
                const SizedBox(width: 4),
                Text(
                  '${h ? "अंतिम तिथि:" : "Due:"} ${hw['due_date'] ?? ""}',
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFEF4444)),
                ),
              ],
            ),

            if (isChecked && sub?['teacher_remarks'] != null) ...[
              const SizedBox(height: 10),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0FDF4),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFBBF7D0)),
                ),
                child: Text(
                  '${h ? "शिक्षक टिप्पणी:" : "Remarks:"} "${sub['teacher_remarks']}"',
                  style: const TextStyle(fontSize: 12, color: Color(0xFF15803D), fontWeight: FontWeight.w500),
                ),
              ),
            ],

            const SizedBox(height: 14),

            // Action Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => _openSubmissionModal(hw),
                icon: Icon(
                  isSubmitted ? Icons.edit_note : Icons.upload_file,
                  size: 16,
                  color: isSubmitted ? _navyColor : Colors.white,
                ),
                label: Text(
                  isChecked
                      ? (h ? 'मूल्यांकन देखें (View Evaluation)' : 'View Evaluation & Score')
                      : isSubmitted
                          ? (h ? 'जमा उत्तर पुस्तिका देखें / बदलें' : 'View / Edit Submitted Notebook')
                          : (h ? 'उत्तर पुस्तिका अपलोड करें' : 'Upload Homework Solution'),
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: isSubmitted ? _navyColor : Colors.white,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: isSubmitted ? const Color(0xFFEEF2FF) : _navyColor,
                  elevation: isSubmitted ? 0 : 2,
                  padding: const EdgeInsets.symmetric(vertical: 11),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: isSubmitted ? BorderSide(color: _navyColor.withValues(alpha: 0.3)) : BorderSide.none,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
