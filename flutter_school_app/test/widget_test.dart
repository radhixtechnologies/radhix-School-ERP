import 'package:flutter_test/flutter_test.dart';
import 'package:radhix_school_app/main.dart';

void main() {
  testWidgets('Renders Radhix Technology ERP Login screen', (WidgetTester tester) async {
    await tester.pumpWidget(const RadhixErpApp());
    expect(find.textContaining('Radhix Technology ERP'), findsOneWidget);
    expect(find.textContaining('Sign In'), findsOneWidget);
  });
}
