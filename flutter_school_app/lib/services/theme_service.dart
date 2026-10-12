import 'package:flutter/material.dart';

class ThemePreset {
  final String key;
  final String nameEn;
  final String nameHi;
  final Color primaryColor;
  final Color accentColor;
  final Color backgroundColor;
  final Color cardColor;
  final List<Color> gradientColors;
  final Color badgeBg;
  final Color badgeText;

  const ThemePreset({
    required this.key,
    required this.nameEn,
    required this.nameHi,
    required this.primaryColor,
    required this.accentColor,
    required this.backgroundColor,
    required this.cardColor,
    required this.gradientColors,
    required this.badgeBg,
    required this.badgeText,
  });
}

class AppThemeController extends ChangeNotifier {
  static final AppThemeController instance = AppThemeController._internal();
  AppThemeController._internal();

  static const List<ThemePreset> availableThemes = [
    ThemePreset(
      key: 'indigo',
      nameEn: 'Royal Indigo & Navy',
      nameHi: 'रॉयल इंडिगो (नेवी)',
      primaryColor: Color(0xFF474A74),
      accentColor: Color(0xFF4F46E5),
      backgroundColor: Color(0xFFF8FAFC),
      cardColor: Colors.white,
      gradientColors: [Color(0xFF474A74), Color(0xFF312E81)],
      badgeBg: Color(0xFFEEF2FF),
      badgeText: Color(0xFF4338CA),
    ),
    ThemePreset(
      key: 'emerald',
      nameEn: 'Emerald School Green',
      nameHi: 'एमराल्ड ग्रीन (हरा)',
      primaryColor: Color(0xFF065F46),
      accentColor: Color(0xFF10B981),
      backgroundColor: Color(0xFFF0FDF4),
      cardColor: Colors.white,
      gradientColors: [Color(0xFF065F46), Color(0xFF047857)],
      badgeBg: Color(0xFFDCFCE7),
      badgeText: Color(0xFF15803D),
    ),
    ThemePreset(
      key: 'purple',
      nameEn: 'Royal Amethyst Purple',
      nameHi: 'रॉयल पर्पल (बैंगनी)',
      primaryColor: Color(0xFF6D28D9),
      accentColor: Color(0xFF8B5CF6),
      backgroundColor: Color(0xFFFAF5FF),
      cardColor: Colors.white,
      gradientColors: [Color(0xFF6D28D9), Color(0xFF4C1D95)],
      badgeBg: Color(0xFFEDE9FE),
      badgeText: Color(0xFF6D28D9),
    ),
    ThemePreset(
      key: 'crimson',
      nameEn: 'Crimson Ruby Red',
      nameHi: 'क्रिमसन रूबी (लाल)',
      primaryColor: Color(0xFF991B1B),
      accentColor: Color(0xFFDC2626),
      backgroundColor: Color(0xFFFFF1F2),
      cardColor: Colors.white,
      gradientColors: [Color(0xFF991B1B), Color(0xFF7F1D1D)],
      badgeBg: Color(0xFFFFE4E6),
      badgeText: Color(0xFF9F1239),
    ),
    ThemePreset(
      key: 'amber',
      nameEn: 'Sunset Warm Amber',
      nameHi: 'सनसेट एम्बर (स्वर्ण)',
      primaryColor: Color(0xFF92400E),
      accentColor: Color(0xFFD97706),
      backgroundColor: Color(0xFFFFFBEB),
      cardColor: Colors.white,
      gradientColors: [Color(0xFF92400E), Color(0xFFB45309)],
      badgeBg: Color(0xFFFEF3C7),
      badgeText: Color(0xFF92400E),
    ),
    ThemePreset(
      key: 'midnight',
      nameEn: 'Midnight Slate Dark',
      nameHi: 'मिडनाइट डार्क (डार्क मोड)',
      primaryColor: Color(0xFF0F172A),
      accentColor: Color(0xFF334155),
      backgroundColor: Color(0xFF0B0F19),
      cardColor: Color(0xFF1E293B),
      gradientColors: [Color(0xFF0F172A), Color(0xFF1E293B)],
      badgeBg: Color(0xFF1E293B),
      badgeText: Color(0xFF94A3B8),
    ),
  ];

  String _currentThemeKey = 'indigo';

  String get currentThemeKey => _currentThemeKey;

  ThemePreset get currentTheme =>
      availableThemes.firstWhere((t) => t.key == _currentThemeKey,
          orElse: () => availableThemes[0]);

  Color get primaryColor => currentTheme.primaryColor;
  Color get accentColor => currentTheme.accentColor;
  Color get backgroundColor => currentTheme.backgroundColor;
  Color get cardColor => currentTheme.cardColor;
  List<Color> get gradientColors => currentTheme.gradientColors;

  void setTheme(String key) {
    if (_currentThemeKey != key) {
      _currentThemeKey = key;
      notifyListeners();
    }
  }

  ThemeData get themeData {
    final t = currentTheme;
    final isDark = t.key == 'midnight';
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: t.primaryColor,
        primary: t.primaryColor,
        secondary: t.accentColor,
        brightness: isDark ? Brightness.dark : Brightness.light,
      ),
      scaffoldBackgroundColor: t.backgroundColor,
      appBarTheme: AppBarTheme(
        backgroundColor: t.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
    );
  }

  static void showThemePickerDialog(BuildContext context, bool isHindi) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          final activeKey = instance.currentThemeKey;

          return Container(
            padding: const EdgeInsets.all(22),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 44,
                    height: 4,
                    decoration: BoxDecoration(
                      color: const Color(0xFFCBD5E1),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 18),
                Row(
                  children: [
                    const Icon(Icons.palette_outlined, size: 22, color: Color(0xFF0F172A)),
                    const SizedBox(width: 8),
                    Text(
                      isHindi ? 'ऐप थीम चुनें (Select App Theme)' : 'Select App Theme',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  isHindi
                      ? 'अपनी पसंदीदा रंग थीम चुनें। यह पूरे ऐप और एडमिन में तुरंत लागू हो जाएगी।'
                      : 'Choose your desired color scheme. Changes apply instantly across the whole ERP interface.',
                  style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 18),
                ...availableThemes.map((preset) {
                  final isSelected = preset.key == activeKey;

                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    decoration: BoxDecoration(
                      color: isSelected ? preset.badgeBg : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isSelected ? preset.primaryColor : const Color(0xFFE2E8F0),
                        width: isSelected ? 2 : 1,
                      ),
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                      leading: Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(colors: preset.gradientColors),
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: preset.primaryColor.withAlpha(60),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                      ),
                      title: Text(
                        isHindi ? preset.nameHi : preset.nameEn,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: isSelected ? preset.primaryColor : const Color(0xFF1E293B),
                        ),
                      ),
                      subtitle: Text(
                        isHindi ? 'प्राथमिक रंग व ग्रेडिएंट' : 'Primary UI Color & Header Gradient',
                        style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                      ),
                      trailing: isSelected
                          ? Icon(Icons.check_circle, color: preset.primaryColor, size: 22)
                          : const Icon(Icons.circle_outlined, color: Color(0xFFCBD5E1), size: 22),
                      onTap: () {
                        instance.setTheme(preset.key);
                        setModalState(() {});
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              isHindi
                                  ? '${preset.nameHi} थीम सफलतापूर्वक लागू हो गई!'
                                  : '${preset.nameEn} theme applied across the app!',
                            ),
                            backgroundColor: preset.primaryColor,
                            duration: const Duration(seconds: 2),
                          ),
                        );
                      },
                    ),
                  );
                }),
                const SizedBox(height: 10),
              ],
            ),
          );
        },
      ),
    );
  }
}
