import 'package:flutter/material.dart';

class ClassesTab extends StatefulWidget {
  final bool isHindi;
  final VoidCallback onBack;

  const ClassesTab({
    super.key,
    required this.isHindi,
    required this.onBack,
  });

  @override
  State<ClassesTab> createState() => _ClassesTabState();
}

class _ClassesTabState extends State<ClassesTab> {
  String _selectedDay = 'Mon';
  final Color _navyColor = const Color(0xFF474A74);

  final List<String> _days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  @override
  Widget build(BuildContext context) {
    final h = widget.isHindi;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Curved App Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: _navyColor,
              borderRadius: BorderRadius.circular(22),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back, color: Colors.white),
                  onPressed: widget.onBack,
                ),
                Text(
                  h ? 'ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â®ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¥ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¥ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¥ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â·ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡' : 'My Classes',
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                Stack(
                  children: [
                    const Icon(Icons.notifications_none, color: Colors.white),
                    Positioned(
                      right: 0,
                      top: 0,
                      child: Container(
                        width: 7,
                        height: 7,
                        decoration: const BoxDecoration(color: Color(0xFFEF4444), shape: BoxShape.circle),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Days Selector Strip Matching Screenshot 1
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: _days.map((d) {
                final isSel = _selectedDay == d;
                return InkWell(
                  onTap: () => setState(() => _selectedDay = d),
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: isSel ? _navyColor : Colors.transparent,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      d,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isSel ? Colors.white : const Color(0xFF64748B),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          const SizedBox(height: 20),

          // Period 1: English
          _periodTimelineCard(
            time: '09:00 AM',
            period: '7th A\nPeriod 1',
            subject: 'English',
            subtitle: 'Ch 5 Force & Law  85%\nTotal Chapters 15  Completed 08',
            bgColor: const Color(0xFFEBF5FF),
            borderColor: const Color(0xFFBAE6FD),
            icon: Icons.menu_book,
            iconColor: const Color(0xFF0284C7),
          ),

          const SizedBox(height: 14),

          // Period 2: Free Period
          _periodTimelineCard(
            time: '10:00 AM',
            period: '7th A\nPeriod 2',
            subject: 'Free Period',
            subtitle: 'Relaxation & Reading Time',
            bgColor: const Color(0xFFF1F5F9),
            borderColor: const Color(0xFFCBD5E1),
            icon: Icons.chair,
            iconColor: const Color(0xFF64748B),
          ),

          const SizedBox(height: 14),

          // Period 3: Maths
          _periodTimelineCard(
            time: '11:00 AM',
            period: '7th A\nPeriod 3',
            subject: 'Maths',
            subtitle: 'Quadratic Equations & Polynomials\nCompleted 06 of 12 Units',
            bgColor: const Color(0xFFFDF2F4),
            borderColor: const Color(0xFFFECDD3),
            icon: Icons.calculate,
            iconColor: const Color(0xFFE11D48),
          ),

          const SizedBox(height: 14),

          // Period 4: Social Science
          _periodTimelineCard(
            time: '12:00 PM',
            period: '7th A\nPeriod 4',
            subject: 'Social Science',
            subtitle: 'Contemporary India & Resources\nTotal Chapters 10  Completed 07',
            bgColor: const Color(0xFFFEF6E9),
            borderColor: const Color(0xFFFDE68A),
            icon: Icons.public,
            iconColor: const Color(0xFFD97706),
          ),

          const SizedBox(height: 14),

          // Period 5: Science
          _periodTimelineCard(
            time: '01:00 PM',
            period: '7th A\nPeriod 5',
            subject: 'Science',
            subtitle: 'Periodic Classification & Lab Activity\nCompleted 09 of 14 Units',
            bgColor: const Color(0xFFE8F8F0),
            borderColor: const Color(0xFFA7F3D0),
            icon: Icons.biotech,
            iconColor: const Color(0xFF059669),
          ),

          const SizedBox(height: 14),

          // Period 6: Geographic
          _periodTimelineCard(
            time: '02:00 PM',
            period: '7th A\nPeriod 6',
            subject: 'Geographic',
            subtitle: 'Physical Features of India\nTotal Chapters 08  Completed 05',
            bgColor: const Color(0xFFE0F2FE),
            borderColor: const Color(0xFFBAE6FD),
            icon: Icons.map,
            iconColor: const Color(0xFF0284C7),
          ),
        ],
      ),
    );
  }

  Widget _periodTimelineCard({
    required String time,
    required String period,
    required String subject,
    required String subtitle,
    required Color bgColor,
    required Color borderColor,
    required IconData icon,
    required Color iconColor,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 70,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                time,
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 2),
              Text(
                period,
                style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8)),
              ),
            ],
          ),
        ),
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: bgColor,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: borderColor),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor: Colors.white,
                  radius: 18,
                  child: Icon(icon, color: iconColor, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        subject,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1E293B),
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
