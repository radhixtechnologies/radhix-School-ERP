import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'services/theme_service.dart';

void main() {
  runApp(const RadhixErpApp());
}

class RadhixErpApp extends StatefulWidget {
  const RadhixErpApp({super.key});

  @override
  State<RadhixErpApp> createState() => _RadhixErpAppState();
}

class _RadhixErpAppState extends State<RadhixErpApp> {
  bool _isHindi = false;

  void _toggleLanguage() {
    setState(() {
      _isHindi = !_isHindi;
    });
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: AppThemeController.instance,
      builder: (context, _) {
        return MaterialApp(
          title: 'Radhix Technology ERP',
          debugShowCheckedModeBanner: false,
          theme: AppThemeController.instance.themeData,
          home: LoginScreen(
            isHindi: _isHindi,
            onToggleLanguage: _toggleLanguage,
          ),
        );
      },
    );
  }
}
