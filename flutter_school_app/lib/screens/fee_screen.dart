import 'package:flutter/material.dart';
import '../models/user_session.dart';
import '../services/api_service.dart';

class FeeScreen extends StatefulWidget {
  final UserSession session;
  final bool isHindi;

  const FeeScreen({
    super.key,
    required this.session,
    required this.isHindi,
  });

  @override
  State<FeeScreen> createState() => _FeeScreenState();
}

class _FeeScreenState extends State<FeeScreen> {
  bool _isLoading = true;
  Map<String, dynamic>? _feeData;

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  void _fetch() async {
    try {
      final res = await ApiService.getMyFees(widget.session.token);
      if (mounted) {
        setState(() {
          _feeData = res;
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showPayDialog(Map<String, dynamic> alloc) {
    final due = (alloc['net_amount'] as num) - (alloc['paid_amount'] as num);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Pay Online via UPI / Gateway'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              alloc['fee_head'] ?? 'Academic Fee',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              'Due Amount: ₹$due',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF4F46E5),
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Row(
                children: [
                  Icon(Icons.shield_outlined, size: 20, color: Color(0xFF10B981)),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Secured via Razorpay / UPI Gateway',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              foregroundColor: Colors.white,
            ),
            onPressed: () async {
              Navigator.pop(ctx);
              _processPayment(alloc['id'], due.toDouble());
            },
            child: Text('Pay ₹$due'),
          ),
        ],
      ),
    );
  }

  void _processPayment(String allocId, double amount) async {
    setState(() => _isLoading = true);
    try {
      final res = await ApiService.payOnline(widget.session.token, allocId, amount);
      _fetch();
      if (!mounted) return;
      _showReceiptDialog(res['receiptNumber']);
    } catch (_) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showReceiptDialog(String receiptNumber) async {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(child: CircularProgressIndicator()),
    );

    try {
      final receipt = await ApiService.downloadReceipt(widget.session.token, receiptNumber);
      if (!mounted) return;
      Navigator.pop(context); // close loader

      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        builder: (_) => Container(
          height: MediaQuery.of(context).size.height * 0.75,
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Official Fee Receipt (3-Copies)',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const Divider(),
              Expanded(
                child: ListView(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFCBD5E1)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Center(
                            child: Text(
                              receipt['institute']?['name'] ?? 'Delhi Public Academy',
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text('Receipt No: ${receipt['receiptNumber']}'),
                          Text('Student: ${receipt['student']?['name']}'),
                          Text('Admission No: ${receipt['student']?['admissionNumber']}'),
                          Text('Fee Head: ${receipt['feeDetails']?['feeHead']}'),
                          Text('Mode: ${receipt['paymentMode']}'),
                          const Divider(),
                          Text(
                            'Amount Paid: ₹${receipt['amountPaid']}',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF059669),
                            ),
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            'Copies Generated:\n1. STUDENT COPY\n2. INSTITUTE OFFICE COPY\n3. BANK ACCOUNTS COPY',
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF4F46E5),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                onPressed: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Downloading 3-Copy Thermal Receipt PDF...')),
                  );
                },
                icon: const Icon(Icons.download),
                label: const Text('Download Multi-Copy PDF'),
              ),
            ],
          ),
        ),
      );
    } catch (_) {
      if (mounted) Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final summary = _feeData?['summary'] ?? {};
    final allocations = _feeData?['allocations'] as List<dynamic>? ?? [];
    final payments = _feeData?['payments'] as List<dynamic>? ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Fee Portal & Online Pay'),
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Top Summary Card
                Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Expanded(
                          child: Column(
                            children: [
                              Text(
                                '₹${summary['totalDue'] ?? 5000}',
                                style: const TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFFEF4444),
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                'Pending Dues',
                                style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                              ),
                            ],
                          ),
                        ),
                        Container(height: 40, width: 1, color: Colors.grey.shade300),
                        Expanded(
                          child: Column(
                            children: [
                              Text(
                                '₹${summary['totalPaid'] ?? 15000}',
                                style: const TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF10B981),
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                'Total Paid',
                                style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),
                const Text(
                  'Fee Dues Breakdown',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),

                ...allocations.map((a) {
                  final due = (a['net_amount'] as num) - (a['paid_amount'] as num);
                  final isPaid = a['status'] == 'PAID';

                  return Card(
                    margin: const EdgeInsets.only(bottom: 10),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  a['fee_head'] ?? 'Fee Head',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Total: ₹${a['net_amount']} • Paid: ₹${a['paid_amount']}',
                                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                                ),
                                if (due > 0)
                                  Text(
                                    'Balance Due: ₹$due',
                                    style: const TextStyle(
                                      color: Color(0xFFEF4444),
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                    ),
                                  ),
                              ],
                            ),
                          ),
                          if (!isPaid)
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF4F46E5),
                                foregroundColor: Colors.white,
                              ),
                              onPressed: () => _showPayDialog(a),
                              child: const Text('Pay Now'),
                            )
                          else
                            const Chip(
                              label: Text('PAID', style: TextStyle(color: Color(0xFF059669), fontWeight: FontWeight.bold, fontSize: 11)),
                              backgroundColor: Color(0xFFECFDF5),
                            ),
                        ],
                      ),
                    ),
                  );
                }),

                const SizedBox(height: 24),
                const Text(
                  'Payment Receipts History',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),

                ...payments.map((p) => Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        leading: const CircleAvatar(
                          backgroundColor: Color(0xFFECFDF5),
                          child: Icon(Icons.receipt, color: Color(0xFF10B981)),
                        ),
                        title: Text(
                          p['receipt_number'] ?? '',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text('Mode: ${p['payment_mode']} • ₹${p['amount_paid']}'),
                        trailing: IconButton(
                          icon: const Icon(Icons.print, color: Color(0xFF4F46E5)),
                          onPressed: () => _showReceiptDialog(p['receipt_number']),
                        ),
                      ),
                    )),
              ],
            ),
    );
  }
}
