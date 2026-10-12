import 'package:flutter/material.dart';
import '../models/user_session.dart';
import '../services/api_service.dart';
import '../services/theme_service.dart';
import 'student_home_tab.dart';
import 'classes_tab.dart';
import 'calendar_tab.dart';
import 'school_admin_dashboard.dart';
import 'parent_dashboard.dart';
import 'login_screen.dart';

class SchoolMainNavigationScreen extends StatefulWidget {
  final UserSession session;
  final bool isHindi;
  final VoidCallback onToggleLanguage;

  const SchoolMainNavigationScreen({
    super.key,
    required this.session,
    required this.isHindi,
    required this.onToggleLanguage,
  });

  @override
  State<SchoolMainNavigationScreen> createState() =>
      _SchoolMainNavigationScreenState();
}

class _SchoolMainNavigationScreenState
    extends State<SchoolMainNavigationScreen> {
  int _currentIndex = 0;
  Color get _navyColor => AppThemeController.instance.primaryColor;

  @override
  Widget build(BuildContext context) {
    final session = widget.session;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: IndexedStack(
          index: _currentIndex,
          children: [
            // Tab 0: Student Home / Parent Home / Admin Home
            session.isSchoolAdmin
                ? SchoolAdminDashboardScreen(
                    session: session,
                    isHindi: widget.isHindi,
                    onToggleLanguage: widget.onToggleLanguage,
                  )
                : session.isParent
                ? ParentDashboardScreen(
                    session: session,
                    isHindi: widget.isHindi,
                    onToggleLanguage: widget.onToggleLanguage,
                  )
                : StudentHomeTab(
                    session: session,
                    isHindi: widget.isHindi,
                    onToggleLanguage: widget.onToggleLanguage,
                    onNavigateTab: (idx) => setState(() => _currentIndex = idx),
                  ),

            // Tab 1: My Classes (Screenshot 1 Center)
            ClassesTab(
              isHindi: widget.isHindi,
              onBack: () => setState(() => _currentIndex = 0),
            ),

            // Tab 2: Calendar (Screenshot 1 Right)
            CalendarTab(
              isHindi: widget.isHindi,
              onBack: () => setState(() => _currentIndex = 0),
            ),

            // Tab 3: Profile & Role Switcher
            _buildProfileView(),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomBar(),
    );
  }

  Widget _buildBottomBar() {
    return Container(
      margin: const EdgeInsets.only(left: 20, right: 20, bottom: 16),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: _navyColor, // Dark navy from Screenshot 1
        borderRadius: BorderRadius.circular(32),
        boxShadow: [
          BoxShadow(
            color: _navyColor.withAlpha(80),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _navItem(0, Icons.home_rounded, 'Home'),
          _navItem(1, Icons.menu_book_rounded, 'Classes'),
          _navItem(2, Icons.calendar_month_rounded, 'Calendar'),
          _navItem(3, Icons.person_rounded, 'Profile'),
        ],
      ),
    );
  }

  Widget _navItem(int index, IconData icon, String label) {
    final isSel = _currentIndex == index;
    return InkWell(
      onTap: () => setState(() => _currentIndex = index),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSel ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 20,
              color: isSel ? _navyColor : Colors.white70,
            ),
            if (isSel) ...[
              const SizedBox(width: 6),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: _navyColor,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildProfileView() {
    final s = widget.session;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          CircleAvatar(
            radius: 40,
            backgroundColor: _navyColor,
            child: const Icon(Icons.school, size: 40, color: Colors.white),
          ),
          const SizedBox(height: 12),
          Text(
            s.displayName,
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 4),
          Text(
            s.isParent
                ? 'School Parent â€¢ Guardian Portal'
                : s.isSchoolAdmin
                ? 'School Principal â€¢ Administration'
                : 'Class 10 - Section A â€¢ Roll No: 12',
            style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 20),

          // Student Info & Today's Attendance Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withAlpha(8),
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
                    const Text(
                      'Today\'s Status',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFECFDF5),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFA7F3D0)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.check_circle, size: 14, color: Color(0xFF059669)),
                          SizedBox(width: 4),
                          Text(
                            'Present (08:12 AM)',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF059669)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const Divider(height: 24),
                _buildProfileRow('Admission No', 'DPS-2026-001'),
                _buildProfileRow('Class & Sec', 'Class 10 - Section A'),
                _buildProfileRow('Roll Number', '12'),
                _buildProfileRow('Guardian', 'Ramesh Kumar'),
                _buildProfileRow('Phone', '+91 98765 43210'),
                _buildProfileRow('School', 'Delhi Public Academy'),
                _buildProfileRow('Academic Session', '2026-27'),
              ],
            ),
          ),

          const SizedBox(height: 14),

          // 1. App UI Theme Selector (User requested in profile!)
          ListTile(
            tileColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
              side: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
            leading: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppThemeController.instance.currentTheme.badgeBg,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(Icons.palette_outlined, color: AppThemeController.instance.primaryColor, size: 20),
            ),
            title: Text(
              widget.isHindi ? 'ऐप थीम व रंग (Theme Colors)' : 'App Theme & Color Palette',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            subtitle: Text(
              widget.isHindi
                  ? 'सक्रिय: ${AppThemeController.instance.currentTheme.nameHi}'
                  : 'Active: ${AppThemeController.instance.currentTheme.nameEn}',
              style: TextStyle(fontSize: 12, color: AppThemeController.instance.primaryColor, fontWeight: FontWeight.w600),
            ),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              AppThemeController.showThemePickerDialog(context, widget.isHindi);
            },
          ),

          const SizedBox(height: 10),

          // 2. Helpdesk & Support Tickets (User requested for students/parents)
          ListTile(
            tileColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
              side: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
            leading: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFEEF2FF),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.confirmation_number_outlined, color: Color(0xFF4F46E5), size: 20),
            ),
            title: Text(
              widget.isHindi ? 'शिकायत व सहायता टिकट (Support Helpdesk)' : 'Raise Ticket / Helpdesk',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            subtitle: Text(
              widget.isHindi
                  ? 'स्कूल एडमिन व प्रिंसिपल को सीधे समस्या भेजें'
                  : 'Report issue directly to School Administration',
              style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
            ),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => _showTicketsModal(context),
          ),

          const SizedBox(height: 10),

          ListTile(
            tileColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
              side: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
            leading: const Icon(Icons.language, color: Color(0xFF474A74)),
            title: Text(widget.isHindi ? 'Switch to English' : 'हिंदी में बदलें (Hindi)'),
            trailing: const Icon(Icons.chevron_right),
            onTap: widget.onToggleLanguage,
          ),
          const SizedBox(height: 12),
          ListTile(
            tileColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
              side: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Logout / Exit Session', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
            onTap: () {
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
    );
  }

  Widget _buildProfileRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: Color(0xFF64748B))),
          Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
        ],
      ),
    );
  }

  void _showTicketsModal(BuildContext context) async {
    final h = widget.isHindi;
    final role = widget.session.isParent
        ? 'PARENT'
        : (widget.session.isSchoolAdmin ? 'SCHOOL_ADMIN' : 'STUDENT');

    List<Map<String, dynamic>> tickets = await ApiService.getTickets(raisedByRole: role);

    if (!context.mounted) return;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return Container(
            height: MediaQuery.of(context).size.height * 0.85,
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
                                  color: const Color(0xFFEEF2FF),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(Icons.confirmation_number_outlined, color: Color(0xFF4F46E5), size: 20),
                              ),
                              const SizedBox(width: 10),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    h ? "सहायता व शिकायत टिकट" : "Helpdesk & Support Tickets",
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A)),
                                  ),
                                  Text(
                                    h ? "सीधे स्कूल एडमिन व प्रिंसिपल को भेजा जाएगा" : "Directly routed to School Administration",
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

                // Button to raise ticket
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        _showRaiseTicketDialog(ctx, (newTicket) {
                          setModalState(() {
                            tickets.insert(0, newTicket);
                          });
                        });
                      },
                      icon: const Icon(Icons.add, size: 18),
                      label: Text(
                        h ? "नया टिकट दर्ज करें (+ Raise Support Ticket)" : "+ Raise New Support Ticket",
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

                // Tickets list
                Expanded(
                  child: tickets.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.inbox_outlined, size: 40, color: Color(0xFF94A3B8)),
                              const SizedBox(height: 8),
                              Text(
                                h ? "कोई सक्रिय टिकट नहीं है" : "No support tickets found",
                                style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF475569)),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                h ? "किसी भी समस्या या सवाल के लिए नया टिकट बनाएं।" : "Raise a ticket above to contact administration.",
                                style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          itemCount: tickets.length,
                          itemBuilder: (context, idx) {
                            final tkt = tickets[idx];
                            final isResolved = tkt['status'] == 'RESOLVED';
                            final isInProgress = tkt['status'] == 'IN_PROGRESS';

                            return Container(
                              margin: const EdgeInsets.only(bottom: 12),
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(
                                  color: isResolved
                                      ? const Color(0xFFBBF7D0)
                                      : (isInProgress ? const Color(0xFFBFDBFE) : const Color(0xFFFED7AA)),
                                ),
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
                                          color: const Color(0xFFF1F5F9),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          "${tkt['ticket_number']} • ${tkt['category']}",
                                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF475569)),
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: isResolved
                                              ? const Color(0xFFDCFCE7)
                                              : (isInProgress ? const Color(0xFFEFF6FF) : const Color(0xFFFEF3C7)),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          tkt['status'] ?? 'OPEN',
                                          style: TextStyle(
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                            color: isResolved
                                                ? const Color(0xFF15803D)
                                                : (isInProgress ? const Color(0xFF1D4ED8) : const Color(0xFFB45309)),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    tkt['title'] ?? '',
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    tkt['description'] ?? '',
                                    style: const TextStyle(fontSize: 12, color: Color(0xFF475569), height: 1.3),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    "Submitted: ${tkt['created_at']}",
                                    style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8)),
                                  ),
                                  if (tkt['admin_response'] != null) ...[
                                    const SizedBox(height: 8),
                                    Container(
                                      width: double.infinity,
                                      padding: const EdgeInsets.all(10),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFF0FDF4),
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(color: const Color(0xFFBBF7D0)),
                                      ),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              const Icon(Icons.reply, size: 12, color: Color(0xFF15803D)),
                                              const SizedBox(width: 4),
                                              Text(
                                                h ? "स्कूल एडमिन की प्रतिक्रिया:" : "School Admin Response:",
                                                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF15803D)),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            "${tkt['admin_response']}",
                                            style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: Color(0xFF166534)),
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

  void _showRaiseTicketDialog(BuildContext parentCtx, Function(Map<String, dynamic> ticket) onCreated) {
    final titleCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    String category = 'FEES';
    String priority = 'NORMAL';
    final h = widget.isHindi;

    showDialog(
      context: context,
      builder: (dlgCtx) => StatefulBuilder(
        builder: (context, setDlgState) {
          return AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
            title: Row(
              children: [
                const Icon(Icons.add_task, color: Color(0xFF4F46E5)),
                const SizedBox(width: 8),
                Text(
                  h ? "नया सहायता टिकट दर्ज करें" : "Raise Support Ticket",
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
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
                      labelText: h ? "समस्या श्रेणी (Category)" : "Category",
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                    items: [
                      DropdownMenuItem(value: 'FEES', child: Text(h ? 'फीस व रसीद (Fees)' : 'Fees & Receipts')),
                      DropdownMenuItem(value: 'ACADEMICS', child: Text(h ? 'शिक्षा व होमवर्क (Academics)' : 'Academics & Homework')),
                      DropdownMenuItem(value: 'TRANSPORT', child: Text(h ? 'बस व ट्रांसपोर्ट (Transport)' : 'Bus & Transport')),
                      DropdownMenuItem(value: 'INFRASTRUCTURE', child: Text(h ? 'सुविधाएं व कक्षा (Infrastructure)' : 'Infrastructure & Lab')),
                      DropdownMenuItem(value: 'TECHNICAL', child: Text(h ? 'ऐप व लॉगिन (Technical App)' : 'App & Technical')),
                    ],
                    onChanged: (v) => setDlgState(() => category = v ?? category),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: priority,
                    decoration: InputDecoration(
                      labelText: h ? "प्राथमिकता (Priority)" : "Priority",
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                    items: [
                      DropdownMenuItem(value: 'NORMAL', child: Text(h ? 'सामान्य (Normal)' : 'Normal')),
                      DropdownMenuItem(value: 'HIGH', child: Text(h ? 'उच्च प्राथमिकता (High)' : 'High')),
                      DropdownMenuItem(value: 'URGENT', child: Text(h ? 'अति आवश्यक (Urgent)' : 'Urgent')),
                    ],
                    onChanged: (v) => setDlgState(() => priority = v ?? priority),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: titleCtrl,
                    decoration: InputDecoration(
                      labelText: h ? "विषय / शीर्षक (Subject)" : "Subject / Title",
                      hintText: h ? "उदा. फीस रसीद जनरेट नहीं हुई" : "e.g. Fee deduction receipt issue",
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: descCtrl,
                    maxLines: 3,
                    decoration: InputDecoration(
                      labelText: h ? "विवरण (Detailed Description)" : "Description",
                      hintText: h ? "समस्या का पूरा विवरण लिखें..." : "Describe your query or issue in detail...",
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
                  final role = widget.session.isParent
                      ? 'PARENT'
                      : (widget.session.isSchoolAdmin ? 'SCHOOL_ADMIN' : 'STUDENT');
                  final name = widget.session.displayName;

                  final created = await ApiService.createTicket(
                    title: titleCtrl.text.trim(),
                    description: descCtrl.text.trim(),
                    category: category,
                    priority: priority,
                    raisedByRole: role,
                    raisedByName: name,
                    targetRole: 'SCHOOL_ADMIN',
                  );

                  onCreated(created);
                  if (dlgCtx.mounted) Navigator.pop(dlgCtx);
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(h ? "टिकट सफलतापूर्वक दर्ज हो गया!" : "Support ticket submitted successfully!"),
                        backgroundColor: const Color(0xFF10B981),
                      ),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppThemeController.instance.primaryColor,
                  foregroundColor: Colors.white,
                ),
                child: Text(h ? "टिकट भेजें" : "Submit Ticket"),
              ),
            ],
          );
        },
      ),
    );
  }
}
