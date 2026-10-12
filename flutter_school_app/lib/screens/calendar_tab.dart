import 'package:flutter/material.dart';

class CalendarTab extends StatefulWidget {
  final bool isHindi;
  final VoidCallback onBack;

  const CalendarTab({
    super.key,
    required this.isHindi,
    required this.onBack,
  });

  @override
  State<CalendarTab> createState() => _CalendarTabState();
}

class _CalendarTabState extends State<CalendarTab> {
  int _selectedDate = 12; // Default to today: 12th Oct
  final Color _navyColor = const Color(0xFF474A74);

  // Dates for current active month (October 2026)
  final List<Map<String, dynamic>> _calendarDates = [
    {'day': 'Mon', 'date': 12, 'isToday': true, 'hasClasses': true, 'hasHomework': false, 'hasEvent': false},
    {'day': 'Tue', 'date': 13, 'isToday': false, 'hasClasses': true, 'hasHomework': false, 'hasEvent': true},
    {'day': 'Wed', 'date': 14, 'isToday': false, 'hasClasses': true, 'hasHomework': true, 'hasEvent': false},
    {'day': 'Thu', 'date': 15, 'isToday': false, 'hasClasses': true, 'hasHomework': true, 'hasEvent': false},
    {'day': 'Fri', 'date': 16, 'isToday': false, 'hasClasses': true, 'hasHomework': true, 'hasEvent': false},
    {'day': 'Sat', 'date': 17, 'isToday': false, 'hasClasses': false, 'hasHomework': false, 'hasEvent': true},
    {'day': 'Sun', 'date': 18, 'isToday': false, 'hasClasses': false, 'hasHomework': false, 'hasEvent': true},
    {'day': 'Mon', 'date': 19, 'isToday': false, 'hasClasses': true, 'hasHomework': false, 'hasEvent': false},
    {'day': 'Tue', 'date': 20, 'isToday': false, 'hasClasses': true, 'hasHomework': false, 'hasEvent': false},
    {'day': 'Wed', 'date': 21, 'isToday': false, 'hasClasses': true, 'hasHomework': true, 'hasEvent': false},
    {'day': 'Thu', 'date': 22, 'isToday': false, 'hasClasses': true, 'hasHomework': false, 'hasEvent': false},
    {'day': 'Fri', 'date': 23, 'isToday': false, 'hasClasses': true, 'hasHomework': false, 'hasEvent': false},
    {'day': 'Sat', 'date': 24, 'isToday': false, 'hasClasses': false, 'hasHomework': false, 'hasEvent': true},
    {'day': 'Sun', 'date': 25, 'isToday': false, 'hasClasses': false, 'hasHomework': false, 'hasEvent': true},
    {'day': 'Wed', 'date': 28, 'isToday': false, 'hasClasses': false, 'hasHomework': false, 'hasEvent': true},
  ];

  // Dynamic day-by-day schedule database
  final Map<int, Map<String, dynamic>> _scheduleMap = {
    12: {
      'dateStr': 'Monday, 12 Oct 2026',
      'labelHindi': 'आज (Today)',
      'isToday': true,
      'classes': [
        {
          'subject': 'Mathematics',
          'time': '08:30 - 09:30 AM',
          'room': 'Room 102, 1st Floor',
          'teacher': 'Smt. Sunita Sharma',
          'topic': 'Quadratic Equations & Roots of Equation',
          'color': 0xFF2563EB,
        },
        {
          'subject': 'Physics',
          'time': '09:35 - 10:30 AM',
          'room': 'Physics Lab 2',
          'teacher': 'Dr. V. K. Mishra',
          'topic': 'Ray Optics & Mirror Formula Derivation',
          'color': 0xFF7C3AED,
        },
        {
          'subject': 'English Literature',
          'time': '10:45 - 11:40 AM',
          'room': 'Room 102, 1st Floor',
          'teacher': 'Ms. Anjali Sen',
          'topic': 'First Flight: A Letter to God Analysis',
          'color': 0xFF0D9488,
        },
        {
          'subject': 'Hindi Course-A',
          'time': '11:45 - 12:40 PM',
          'room': 'Room 102, 1st Floor',
          'teacher': 'Sh. R. K. Gupta',
          'topic': 'Kshitij Chapter 4: Netaji ka Chashma',
          'color': 0xFFD97706,
        },
      ],
      'homework': [
        {
          'subject': 'English Literature',
          'title': 'Lencho Character Sketch Submission',
          'dueTime': 'Today by 05:00 PM',
          'status': 'DUE_TODAY',
        },
      ],
      'events': [],
    },
    13: {
      'dateStr': 'Tuesday, 13 Oct 2026',
      'labelHindi': 'कल (Tomorrow)',
      'isToday': false,
      'classes': [
        {
          'subject': 'Chemistry',
          'time': '08:30 - 09:30 AM',
          'room': 'Chemistry Lab 1',
          'teacher': 'Dr. R. P. Singh',
          'topic': 'Acids, Bases & Salts Practical Titration',
          'color': 0xFF059669,
        },
        {
          'subject': 'Social Studies (History)',
          'time': '09:35 - 10:30 AM',
          'room': 'Room 102, 1st Floor',
          'teacher': 'Smt. Vandana Saxena',
          'topic': 'The Rise of Nationalism in Europe',
          'color': 0xFFEA580C,
        },
        {
          'subject': 'Mathematics',
          'time': '10:45 - 11:40 AM',
          'room': 'Room 102, 1st Floor',
          'teacher': 'Smt. Sunita Sharma',
          'topic': 'Completing the Square Method',
          'color': 0xFF2563EB,
        },
        {
          'subject': 'Computer Science / AI',
          'time': '11:45 - 12:40 PM',
          'room': 'IT Lab 1',
          'teacher': 'Er. Aman Jain',
          'topic': 'Python Loops and Data Structures',
          'color': 0xFF0284C7,
        },
      ],
      'homework': [],
      'events': [
        {
          'title': 'Inter-House Debate Competition',
          'time': '02:00 - 03:30 PM',
          'venue': 'School Auditorium',
          'category': 'CO-CURRICULAR',
        },
      ],
    },
    14: {
      'dateStr': 'Wednesday, 14 Oct 2026',
      'labelHindi': 'बुधवार (Wednesday)',
      'isToday': false,
      'classes': [
        {
          'subject': 'Physics',
          'time': '08:30 - 09:30 AM',
          'room': 'Physics Lab 2',
          'teacher': 'Dr. V. K. Mishra',
          'topic': 'Mirror Formula NCERT Numericals Solving',
          'color': 0xFF7C3AED,
        },
        {
          'subject': 'Biology',
          'time': '09:35 - 10:30 AM',
          'room': 'Biology Lab',
          'teacher': 'Dr. Sunita Rao',
          'topic': 'Life Processes: Nutrition & Respiration',
          'color': 0xFF16A34A,
        },
        {
          'subject': 'Mathematics',
          'time': '10:45 - 11:40 AM',
          'room': 'Room 102',
          'teacher': 'Smt. Sunita Sharma',
          'topic': 'Quadratic Formula NCERT Ex 4.3',
          'color': 0xFF2563EB,
        },
      ],
      'homework': [
        {
          'subject': 'Physics',
          'title': 'Ray Optics & Mirror Formula Numerical (Ex 10 Q1-15)',
          'dueTime': 'Due 14 Oct 2026 (Today)',
          'status': 'DUE_TODAY',
        },
      ],
      'events': [],
    },
    15: {
      'dateStr': 'Thursday, 15 Oct 2026',
      'labelHindi': 'गुरुवार (Thursday)',
      'isToday': false,
      'classes': [
        {
          'subject': 'Mathematics',
          'time': '08:30 - 09:30 AM',
          'room': 'Room 102',
          'teacher': 'Smt. Sunita Sharma',
          'topic': 'Speed, Distance & Word Problems',
          'color': 0xFF2563EB,
        },
        {
          'subject': 'Chemistry',
          'time': '09:35 - 10:30 AM',
          'room': 'Room 102',
          'teacher': 'Dr. R. P. Singh',
          'topic': 'Chemical Equations Balancing',
          'color': 0xFF059669,
        },
        {
          'subject': 'Physical Education',
          'time': '11:45 - 12:40 PM',
          'room': 'Sports Complex',
          'teacher': 'Coach Baljit Singh',
          'topic': 'Athletics & Track Drill Training',
          'color': 0xFF0284C7,
        },
      ],
      'homework': [
        {
          'subject': 'Mathematics',
          'title': 'Quadratic Equations Exercise 4.3 Word Problems',
          'dueTime': 'Due 15 Oct 2026 (Today)',
          'status': 'DUE_TODAY',
        },
      ],
      'events': [],
    },
    16: {
      'dateStr': 'Friday, 16 Oct 2026',
      'labelHindi': 'शुक्रवार (Friday)',
      'isToday': false,
      'classes': [
        {
          'subject': 'Social Studies (Geography)',
          'time': '08:30 - 09:30 AM',
          'room': 'Room 102',
          'teacher': 'Smt. Vandana Saxena',
          'topic': 'Resources and Development Map Work',
          'color': 0xFFEA580C,
        },
        {
          'subject': 'Computer Science & AI',
          'time': '09:35 - 11:00 AM',
          'room': 'Computer Lab 1',
          'teacher': 'Er. Aman Jain',
          'topic': 'Practical AI Project Submission',
          'color': 0xFF0284C7,
        },
      ],
      'homework': [
        {
          'subject': 'English Literature',
          'title': 'Letter to God Long Question Answers',
          'dueTime': 'Due 16 Oct 2026 (Today)',
          'status': 'DUE_TODAY',
        },
      ],
      'events': [
        {
          'title': 'Pre-PTM Progress Review with Class Teacher',
          'time': '02:00 - 03:00 PM',
          'venue': 'Senior Academic Hall',
          'category': 'ACADEMIC',
        },
      ],
    },
    17: {
      'dateStr': 'Saturday, 17 Oct 2026',
      'labelHindi': 'शनिवार (Saturday)',
      'isToday': false,
      'classes': [],
      'homework': [],
      'events': [
        {
          'title': 'Parent Teacher Meeting (PTM) - Term 1 Progress',
          'time': '09:00 AM - 01:00 PM',
          'venue': 'Classroom 10-A (Sector 14 Campus)',
          'category': 'PTM',
        },
      ],
    },
    18: {
      'dateStr': 'Sunday, 18 Oct 2026',
      'labelHindi': 'रविवार (Sunday - अवकाश)',
      'isToday': false,
      'classes': [],
      'homework': [],
      'events': [
        {
          'title': 'Weekly School Holiday (Sunday)',
          'time': 'All Day',
          'venue': 'School Closed',
          'category': 'HOLIDAY',
        },
      ],
    },
    24: {
      'dateStr': 'Saturday, 24 Oct 2026',
      'labelHindi': 'शनिवार (Saturday)',
      'isToday': false,
      'classes': [],
      'homework': [],
      'events': [
        {
          'title': 'Quarterly PTM & Report Card Verification',
          'time': '09:00 AM - 01:00 PM',
          'venue': 'Main Academic Block',
          'category': 'PTM',
        },
      ],
    },
    25: {
      'dateStr': 'Sunday, 25 Oct 2026',
      'labelHindi': 'रविवार (Sunday - खेल दिवस)',
      'isToday': false,
      'classes': [],
      'homework': [],
      'events': [
        {
          'title': 'Annual Sports Meet 2026 (वार्षिक खेल उत्सव)',
          'time': '08:00 AM - 04:00 PM',
          'venue': 'Delhi Public Academy Sports Stadium',
          'category': 'EVENT',
        },
      ],
    },
    28: {
      'dateStr': 'Wednesday, 28 Oct 2026',
      'labelHindi': 'बुधवार (दीपावली अवकाश)',
      'isToday': false,
      'classes': [],
      'homework': [],
      'events': [
        {
          'title': 'Diwali Vacation & Festive Break Begins (28 Oct - 3 Nov)',
          'time': 'All Day (School Closed)',
          'venue': 'School Closed',
          'category': 'HOLIDAY',
        },
      ],
    },
  };

  @override
  Widget build(BuildContext context) {
    final h = widget.isHindi;
    final currentSchedule = _scheduleMap[_selectedDate] ?? {
      'dateStr': '$_selectedDate Oct 2026',
      'labelHindi': 'दैनिक कार्यक्रम',
      'isToday': false,
      'classes': [],
      'homework': [],
      'events': [],
    };

    final classes = currentSchedule['classes'] as List<dynamic>? ?? [];
    final homework = currentSchedule['homework'] as List<dynamic>? ?? [];
    final events = currentSchedule['events'] as List<dynamic>? ?? [];
    final hasNoItems = classes.isEmpty && homework.isEmpty && events.isEmpty;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Curved Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: _navyColor,
              borderRadius: BorderRadius.circular(22),
              boxShadow: [
                BoxShadow(
                  color: _navyColor.withAlpha(50),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back, color: Colors.white),
                  onPressed: widget.onBack,
                ),
                Text(
                  h ? 'कैलेंडर एवं समय-सारणी' : 'Calendar & Schedule',
                  style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Colors.white),
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

          // Month Title & Active Indicator
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                h ? 'अक्टूबर 2026 (October 2026)' : 'October 2026',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFEEF2FF),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '${_calendarDates.length} Dates Available',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: _navyColor),
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Horizontal Date Selector Ribbon with Indicator Dots
          SizedBox(
            height: 80,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _calendarDates.length,
              itemBuilder: (context, index) {
                final item = _calendarDates[index];
                final isSel = item['date'] == _selectedDate;
                final isToday = item['isToday'] == true;

                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: InkWell(
                    onTap: () => setState(() => _selectedDate = item['date'] as int),
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      width: 58,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      decoration: BoxDecoration(
                        color: isSel
                            ? _navyColor
                            : isToday
                                ? const Color(0xFFEFF6FF)
                                : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSel
                              ? _navyColor
                              : isToday
                                  ? const Color(0xFF60A5FA)
                                  : const Color(0xFFE2E8F0),
                          width: isToday && !isSel ? 1.5 : 1,
                        ),
                        boxShadow: isSel
                            ? [
                                BoxShadow(
                                  color: _navyColor.withAlpha(40),
                                  blurRadius: 8,
                                  offset: const Offset(0, 4),
                                )
                              ]
                            : null,
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            '${item['day']}',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: isSel
                                  ? Colors.white70
                                  : isToday
                                      ? const Color(0xFF2563EB)
                                      : const Color(0xFF64748B),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${item['date']}',
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.bold,
                              color: isSel
                                  ? Colors.white
                                  : isToday
                                      ? const Color(0xFF1D4ED8)
                                      : const Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 4),
                          // Dots for Classes / Homework / Event
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              if (item['hasClasses'] == true)
                                Container(
                                  width: 4,
                                  height: 4,
                                  margin: const EdgeInsets.symmetric(horizontal: 1),
                                  decoration: BoxDecoration(
                                    color: isSel ? Colors.white : const Color(0xFF3B82F6),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              if (item['hasHomework'] == true)
                                Container(
                                  width: 4,
                                  height: 4,
                                  margin: const EdgeInsets.symmetric(horizontal: 1),
                                  decoration: BoxDecoration(
                                    color: isSel ? const Color(0xFFFDE68A) : const Color(0xFFF59E0B),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              if (item['hasEvent'] == true)
                                Container(
                                  width: 4,
                                  height: 4,
                                  margin: const EdgeInsets.symmetric(horizontal: 1),
                                  decoration: BoxDecoration(
                                    color: isSel ? const Color(0xFFFCA5A5) : const Color(0xFFEF4444),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 18),

          // Selected Date Header Card
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: const Color(0xFFEEF2FF),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFC7D2FE)),
            ),
            child: Row(
              children: [
                const Icon(Icons.event, color: Color(0xFF474A74), size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    currentSchedule['dateStr'] ?? '$_selectedDate Oct 2026',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B)),
                  ),
                ),
                if (currentSchedule['isToday'] == true)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Text('TODAY', style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                  ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // 1. School Events / Holidays / PTM Section
          if (events.isNotEmpty) ...[
            Text(
              h ? 'विशेष कार्यक्रम एवं अवकाश (Events & Holidays)' : 'Events & Holidays',
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 8),
            ...events.map((ev) {
              final isHoliday = ev['category'] == 'HOLIDAY';
              final isPtm = ev['category'] == 'PTM';
              final cardColor = isHoliday
                  ? const Color(0xFFF97316)
                  : isPtm
                      ? const Color(0xFF0F766E)
                      : const Color(0xFF8B5CF6);

              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: cardColor,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: cardColor.withAlpha(40),
                      blurRadius: 8,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Icon(
                      isHoliday
                          ? Icons.beach_access
                          : isPtm
                              ? Icons.group
                              : Icons.emoji_events,
                      color: Colors.white,
                      size: 24,
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            ev['title'] ?? '',
                            style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${ev['time']} • ${ev['venue']}',
                            style: const TextStyle(color: Colors.white70, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            }),
            const SizedBox(height: 12),
          ],

          // 2. Homework Due on this date Section
          if (homework.isNotEmpty) ...[
            Text(
              h ? 'इस तिथि को जमा करने योग्य गृहकार्य (Assignments Due)' : 'Assignments Due On This Date',
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 8),
            ...homework.map((hw) => Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFFDE68A)),
                  ),
                  child: Row(
                    children: [
                      const CircleAvatar(
                        radius: 18,
                        backgroundColor: Color(0xFFF59E0B),
                        child: Icon(Icons.assignment_late, color: Colors.white, size: 18),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              hw['subject'] ?? 'Subject',
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFB45309)),
                            ),
                            Text(
                              hw['title'] ?? '',
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              hw['dueTime'] ?? '',
                              style: const TextStyle(fontSize: 11, color: Color(0xFF92400E), fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF59E0B),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text('DUE', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                )),
            const SizedBox(height: 12),
          ],

          // 3. Classes Scheduled on this date
          if (classes.isNotEmpty) ...[
            Text(
              h ? 'कक्षा समय-सारणी (Class Periods & Timetable)' : 'Class Periods & Timetable',
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 10),
            ...classes.map((cls) => Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        decoration: BoxDecoration(
                          color: Color(cls['color'] as int).withAlpha(25),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          children: [
                            Icon(Icons.access_time, size: 16, color: Color(cls['color'] as int)),
                            const SizedBox(height: 4),
                            Text(
                              (cls['time'] as String).split(' - ')[0],
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: Color(cls['color'] as int),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  cls['subject'] as String,
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF1E293B)),
                                ),
                                const Spacer(),
                                Text(
                                  cls['time'] as String,
                                  style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                                ),
                              ],
                            ),
                            const SizedBox(height: 3),
                            Text(
                              cls['topic'] as String,
                              style: const TextStyle(fontSize: 12, color: Color(0xFF475569)),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                const Icon(Icons.location_on_outlined, size: 12, color: Colors.grey),
                                const SizedBox(width: 2),
                                Text(cls['room'] as String, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                                const SizedBox(width: 10),
                                const Icon(Icons.person_outline, size: 12, color: Colors.grey),
                                const SizedBox(width: 2),
                                Text(cls['teacher'] as String, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                )),
          ],

          // If no classes or items on this date
          if (hasNoItems)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
              alignment: Alignment.center,
              child: Column(
                children: [
                  Icon(Icons.wb_sunny_outlined, size: 48, color: Colors.amber.shade400),
                  const SizedBox(height: 12),
                  Text(
                    h ? 'इस तिथि के लिए कोई निर्धारित कक्षा नहीं है' : 'No scheduled classes for this date',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF64748B)),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    h ? 'विद्यार्थी स्वाध्याय या गृहकार्य पूरा कर सकते हैं।' : 'Students may complete self-study or pending homework.',
                    style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
