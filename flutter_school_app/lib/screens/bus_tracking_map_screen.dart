import 'dart:async';
import 'package:flutter/material.dart';
import '../models/user_session.dart';
import '../services/api_service.dart';

class BusTrackingMapScreen extends StatefulWidget {
  final UserSession session;
  final bool isHindi;

  const BusTrackingMapScreen({
    super.key,
    required this.session,
    required this.isHindi,
  });

  @override
  State<BusTrackingMapScreen> createState() => _BusTrackingMapScreenState();
}

class _BusTrackingMapScreenState extends State<BusTrackingMapScreen> with SingleTickerProviderStateMixin {
  final TransformationController _transformController = TransformationController();
  late AnimationController _pulseController;
  Timer? _liveTimer;

  double _busProgress = 0.65; // Progress between stop 3 and stop 4
  int _currentSpeed = 34; // km/h
  bool _isLiveSimulating = true;

  final List<Map<String, dynamic>> _stops = [
    {
      "name": "Rohini Sec 14 School Gate",
      "time": "07:15 AM",
      "status": "PASSED",
      "offset": const Offset(60, 80),
    },
    {
      "name": "Madhuban Chowk Metro",
      "time": "07:35 AM",
      "status": "PASSED",
      "offset": const Offset(140, 160),
    },
    {
      "name": "Pitampura Club",
      "time": "07:50 AM",
      "status": "PASSED",
      "offset": const Offset(230, 220),
    },
    {
      "name": "Dhaula Kuan Junction",
      "time": "08:05 AM",
      "status": "CURRENT",
      "offset": const Offset(320, 310),
    },
    {
      "name": "Vasant Vihar H-Block (Ward Stop)",
      "time": "08:18 AM",
      "status": "UPCOMING",
      "offset": const Offset(420, 390),
    },
    {
      "name": "Delhi Public Academy Campus",
      "time": "08:30 AM",
      "status": "UPCOMING",
      "offset": const Offset(510, 470),
    },
  ];

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);

    // Initial center on the current bus location
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _centerOnBus();
      _startLiveTelemetry();
    });
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _liveTimer?.cancel();
    _transformController.dispose();
    super.dispose();
  }

  void _centerOnBus() {
    final busPos = _calculateBusPosition();
    const viewportWidth = 380.0;
    const viewportHeight = 420.0;
    final tx = viewportWidth / 2 - busPos.dx;
    final ty = viewportHeight / 2 - busPos.dy;
    _transformController.value = Matrix4.identity()
      ..setTranslationRaw(tx.clamp(-200.0, 50.0), ty.clamp(-200.0, 50.0), 0.0);
  }

  void _startLiveTelemetry() {
    _liveTimer?.cancel();
    _liveTimer = Timer.periodic(const Duration(seconds: 4), (timer) {
      if (!_isLiveSimulating || !mounted) return;
      setState(() {
        _busProgress += 0.04;
        if (_busProgress > 0.95) {
          _busProgress = 0.2;
        }
        // Small speed variation
        _currentSpeed = 30 + ((_busProgress * 100).toInt() % 12);
      });
      // Send location update to backend in background
      ApiService.updateBusLocation(
        widget.session.token,
        "rt-dpa-12",
        28.5912 + (_busProgress * 0.05),
        77.1624 + (_busProgress * 0.05),
        "ON_ROUTE",
      );
    });
  }

  Offset _calculateBusPosition() {
    // Interpolate along route path
    final totalStops = _stops.length;
    final segmentFloat = _busProgress * (totalStops - 1);
    final segIdx = segmentFloat.floor().clamp(0, totalStops - 2);
    final t = segmentFloat - segIdx;

    final p1 = _stops[segIdx]["offset"] as Offset;
    final p2 = _stops[segIdx + 1]["offset"] as Offset;

    return Offset(
      p1.dx + (p2.dx - p1.dx) * t,
      p1.dy + (p2.dy - p1.dy) * t,
    );
  }

  @override
  Widget build(BuildContext context) {
    final h = widget.isHindi;
    final busPos = _calculateBusPosition();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF474A74),
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              h ? 'लाइव स्कूल बस ट्रैकिंग' : 'Live Bus GPS Tracking',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white),
            ),
            Text(
              h ? 'मार्ग 12 • DL-1PB-4521' : 'Route #12 • DL-1PB-4521',
              style: const TextStyle(fontSize: 12, color: Color(0xFFD1D5DB)),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(
              _isLiveSimulating ? Icons.pause_circle_filled : Icons.play_circle_fill,
              color: const Color(0xFF6EE7B7),
            ),
            tooltip: h ? 'सिमुलेशन टॉगल करें' : 'Toggle Live GPS Sim',
            onPressed: () {
              setState(() => _isLiveSimulating = !_isLiveSimulating);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    _isLiveSimulating
                      ? (h ? 'लाइव GPS ट्रैकिंग सक्रिय' : 'Live GPS tracking active')
                      : (h ? 'GPS ट्रैकिंग रुकी' : 'GPS simulation paused'),
                  ),
                  duration: const Duration(seconds: 2),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.my_location, color: Colors.white),
            tooltip: h ? 'बस पर केंद्रित करें' : 'Center on Bus',
            onPressed: _centerOnBus,
          ),
        ],
      ),
      body: Column(
        children: [
          // 1. Live Telematics Status Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            color: const Color(0xFF373A60),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 5),
                          Text(
                            h ? 'सक्रिय' : 'LIVE',
                            style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 10),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          h ? 'गति: $_currentSpeed किमी/घंटा' : 'Speed: $_currentSpeed km/h',
                          style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          h ? 'वसंत विहार स्टॉप से 1.2 किमी दूर' : '1.2 km from Vasant Vihar stop',
                          style: const TextStyle(color: Color(0xFF9CA3AF), fontSize: 11),
                        ),
                      ],
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white24),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        h ? 'आगमन समय (ETA)' : 'ETA to Ward Stop',
                        style: const TextStyle(color: Color(0xFF9CA3AF), fontSize: 10),
                      ),
                      const Text(
                        '08 Mins (08:18 AM)',
                        style: TextStyle(color: Color(0xFFFDE047), fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // 2. Interactive Map Canvas (Pan & Zoom)
          Expanded(
            child: Stack(
              children: [
                InteractiveViewer(
                  transformationController: _transformController,
                  minScale: 0.6,
                  maxScale: 2.5,
                  boundaryMargin: const EdgeInsets.all(300),
                  child: SizedBox(
                    width: 620,
                    height: 560,
                    child: CustomPaint(
                      painter: _MapCanvasPainter(
                        stops: _stops,
                        busPosition: busPos,
                        pulseValue: _pulseController.value,
                      ),
                    ),
                  ),
                ),

                // Floating Map Legend & Recenter Control
                PositionAtMapTop(
                  h: h,
                  onRecenter: _centerOnBus,
                ),

                // Floating Driver Card at Bottom
                Positioned(
                  left: 16,
                  right: 16,
                  bottom: 16,
                  child: _buildDriverCard(context, h),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDriverCard(BuildContext context, bool h) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.12),
            blurRadius: 18,
            offset: const Offset(0, 6),
          ),
        ],
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: const Color(0xFFEEF2FF),
                child: const Icon(Icons.person, color: Color(0xFF474A74)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      h ? 'चालक: मुकेश कुमार' : 'Driver: Mukesh Kumar',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)),
                    ),
                    Text(
                      h ? 'वाहन: DL-1PB-4521 (सत्यापित स्कूल बस)' : 'Vehicle: DL-1PB-4521 (School Bus #12)',
                      style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                    ),
                  ],
                ),
              ),
              ElevatedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(h ? 'चालक को कॉल कर रहे हैं (+91 98712 34567)...' : 'Calling Driver (+91 98712 34567)...'),
                      backgroundColor: const Color(0xFF10B981),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                icon: const Icon(Icons.phone, size: 16),
                label: Text(h ? 'कॉल करें' : 'Call', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const Divider(height: 18),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.pin_drop, size: 16, color: Color(0xFFEF4444)),
                  const SizedBox(width: 4),
                  Text(
                    h ? 'अगला स्टॉप: धौला कुआँ' : 'Next Stop: Dhaula Kuan',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF334155)),
                  ),
                ],
              ),
              TextButton(
                onPressed: () => _showRouteTimelineModal(context, h),
                style: TextButton.styleFrom(
                  padding: EdgeInsets.zero,
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: Text(
                  h ? 'सभी स्टॉप देखें' : 'View All Stops',
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF474A74)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showRouteTimelineModal(BuildContext context, bool h) {
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
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  h ? 'मार्ग स्टॉप अनुसूची (Route #12)' : 'Route #12 Stops Schedule',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                ),
                IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
              ],
            ),
            const SizedBox(height: 10),
            Expanded(
              child: ListView.separated(
                itemCount: _stops.length,
                separatorBuilder: (context, index) => const Divider(height: 1),
                itemBuilder: (ctx, idx) {
                  final s = _stops[idx];
                  final isPassed = s["status"] == "PASSED";
                  final isCurrent = s["status"] == "CURRENT";

                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: CircleAvatar(
                      radius: 14,
                      backgroundColor: isCurrent
                        ? const Color(0xFF10B981)
                        : isPassed
                            ? const Color(0xFF94A3B8)
                            : const Color(0xFFE2E8F0),
                      child: Text(
                        '${idx + 1}',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: (isCurrent || isPassed) ? Colors.white : const Color(0xFF475569),
                        ),
                      ),
                    ),
                    title: Text(
                      s["name"],
                      style: TextStyle(
                        fontWeight: isCurrent ? FontWeight.bold : FontWeight.w500,
                        color: isCurrent ? const Color(0xFF065F46) : const Color(0xFF1E293B),
                        fontSize: 13,
                      ),
                    ),
                    trailing: Text(
                      s["time"],
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isCurrent ? const Color(0xFF10B981) : const Color(0xFF64748B),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class PositionAtMapTop extends StatelessWidget {
  final bool h;
  final VoidCallback onRecenter;

  const PositionAtMapTop({super.key, required this.h, required this.onRecenter});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: 14,
      left: 14,
      right: 14,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 8),
              ],
            ),
            child: Row(
              children: [
                const Icon(Icons.map, size: 14, color: Color(0xFF474A74)),
                const SizedBox(width: 6),
                Text(
                  h ? 'रोहिणी • वसंत विहार मार्ग' : 'Rohini • Vasant Vihar Route',
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
                ),
              ],
            ),
          ),
          FloatingActionButton.small(
            onPressed: onRecenter,
            backgroundColor: Colors.white,
            foregroundColor: const Color(0xFF474A74),
            elevation: 3,
            child: const Icon(Icons.gps_fixed),
          ),
        ],
      ),
    );
  }
}

class _MapCanvasPainter extends CustomPainter {
  final List<Map<String, dynamic>> stops;
  final Offset busPosition;
  final double pulseValue;

  _MapCanvasPainter({
    required this.stops,
    required this.busPosition,
    required this.pulseValue,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // 1. Map Background (Light modern map tone)
    final bgPaint = Paint()..color = const Color(0xFFF1F5F9);
    canvas.drawRect(Offset.zero & size, bgPaint);

    // 2. City Landscape: Water body / River simulation
    final riverPaint = Paint()
      ..color = const Color(0xFFE0F2FE)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 28;
    final riverPath = Path()
      ..moveTo(0, 360)
      ..quadraticBezierTo(200, 390, 400, 340)
      ..quadraticBezierTo(520, 310, size.width, 350);
    canvas.drawPath(riverPath, riverPaint);

    // 3. Green City Park zones
    final parkPaint = Paint()..color = const Color(0xFFDCFCE7);
    canvas.drawRRect(
      RRect.fromRectAndRadius(const Rect.fromLTWH(40, 190, 110, 80), const Radius.circular(16)),
      parkPaint,
    );
    canvas.drawRRect(
      RRect.fromRectAndRadius(const Rect.fromLTWH(340, 110, 140, 90), const Radius.circular(16)),
      parkPaint,
    );

    // 4. Secondary Road Network Grid
    final gridPaint = Paint()
      ..color = const Color(0xFFE2E8F0)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3;

    // Draw grid roads
    for (double y = 40; y < size.height; y += 70) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }
    for (double x = 40; x < size.width; x += 80) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
    }

    // 5. Main Route Highway Road
    final routeUnderlayPaint = Paint()
      ..color = const Color(0xFFCBD5E1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 14
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final routeForegroundPaint = Paint()
      ..color = const Color(0xFF474A74)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 8
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final routePath = Path();
    for (int i = 0; i < stops.length; i++) {
      final pt = stops[i]["offset"] as Offset;
      if (i == 0) {
        routePath.moveTo(pt.dx, pt.dy);
      } else {
        routePath.lineTo(pt.dx, pt.dy);
      }
    }
    canvas.drawPath(routePath, routeUnderlayPaint);
    canvas.drawPath(routePath, routeForegroundPaint);

    // 6. Draw Stops
    for (int i = 0; i < stops.length; i++) {
      final s = stops[i];
      final pt = s["offset"] as Offset;
      final isCurrent = s["status"] == "CURRENT";

      // Stop Outer Shadow
      canvas.drawCircle(pt, isCurrent ? 12 : 9, Paint()..color = Colors.black26);

      // Stop Inner Pin
      final pinPaint = Paint()
        ..color = isCurrent ? const Color(0xFF10B981) : const Color(0xFF3B82F6);
      canvas.drawCircle(pt, isCurrent ? 10 : 7, pinPaint);
      canvas.drawCircle(pt, isCurrent ? 4 : 3, Paint()..color = Colors.white);

      // Stop Label Text
      final textSpan = TextSpan(
        text: s["name"],
        style: const TextStyle(
          color: Color(0xFF1E293B),
          fontSize: 10,
          fontWeight: FontWeight.bold,
          backgroundColor: Colors.white70,
        ),
      );
      final textPainter = TextPainter(
        text: textSpan,
        textDirection: TextDirection.ltr,
      )..layout();
      textPainter.paint(canvas, Offset(pt.dx + 12, pt.dy - 6));
    }

    // 7. Bus Animated GPS Radar Halo
    final haloRadius = 18 + (pulseValue * 14);
    final haloPaint = Paint()
      ..color = const Color(0xFF10B981).withValues(alpha: 0.25 * (1 - pulseValue))
      ..style = PaintingStyle.fill;
    canvas.drawCircle(busPosition, haloRadius, haloPaint);

    // 8. Bus Marker Icon Container
    final busCirclePaint = Paint()..color = const Color(0xFF10B981);
    final busBorderPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3;

    canvas.drawCircle(busPosition, 18, Paint()..color = Colors.black38);
    canvas.drawCircle(busPosition, 16, busCirclePaint);
    canvas.drawCircle(busPosition, 16, busBorderPaint);

    // Bus Icon glyph
    final busGlyph = TextSpan(
      text: "🚌",
      style: const TextStyle(fontSize: 16),
    );
    final busPainter = TextPainter(
      text: busGlyph,
      textDirection: TextDirection.ltr,
    )..layout();
    busPainter.paint(canvas, Offset(busPosition.dx - 8, busPosition.dy - 10));
  }

  @override
  bool shouldRepaint(covariant _MapCanvasPainter oldDelegate) {
    return oldDelegate.busPosition != busPosition || oldDelegate.pulseValue != pulseValue;
  }
}
