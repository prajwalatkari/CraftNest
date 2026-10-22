const assert = require('assert');

const API_BASE = 'http://localhost:5000/api/v1';

async function testSuite() {
  console.log('----------------------------------------------------');
  console.log('CraftNest Backend & Business Rules Verification Suite');
  console.log('----------------------------------------------------');

  let buyerToken = '';
  let sellerToken = '';
  let adminToken = '';
  let testProductId = '';
  let initialStock = 0;
  let testOrderId = '';

  // 1. Health check
  console.log('\n[1] Testing API Health Check...');
  const healthRes = await fetch(`${API_BASE}/health`).then(r => r.json());
  assert.strictEqual(healthRes.success, true, 'Health check should be true');
  console.log('✓ Health check passed');

  // 2. Login Buyer (Priya)
  console.log('\n[2] Testing Buyer Authentication...');
  const buyerLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'priya@example.com', password: 'Buyer@123' })
  }).then(r => r.json());
  assert.strictEqual(buyerLoginRes.success, true, 'Buyer login should succeed');
  assert.strictEqual(buyerLoginRes.user.role, 'buyer');
  buyerToken = buyerLoginRes.token;
  console.log('✓ Buyer login successful. Name:', buyerLoginRes.user.name);

  // 3. Login Seller (Aarohi)
  console.log('\n[3] Testing Seller Authentication...');
  const sellerLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'aarohi@craftnest.in', password: 'Seller@123' })
  }).then(r => r.json());
  assert.strictEqual(sellerLoginRes.success, true, 'Seller login should succeed');
  assert.strictEqual(sellerLoginRes.user.role, 'seller');
  sellerToken = sellerLoginRes.token;
  console.log('✓ Seller login successful. Shop:', sellerLoginRes.user.sellerProfile?.shopName);

  // 4. Login Admin
  console.log('\n[4] Testing Admin Authentication...');
  const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@craftnest.in', password: 'Admin@123' })
  }).then(r => r.json());
  assert.strictEqual(adminLoginRes.success, true, 'Admin login should succeed');
  assert.strictEqual(adminLoginRes.user.role, 'admin');
  adminToken = adminLoginRes.token;
  console.log('✓ Admin login successful');

  // 5. Product Fetch & Filtering
  console.log('\n[5] Testing Product Listing & Category Filter...');
  const prodRes = await fetch(`${API_BASE}/products?category=Handmade%20Candles`).then(r => r.json());
  assert.strictEqual(prodRes.success, true);
  assert(prodRes.products.length > 0, 'Should have candles in list');
  const targetProduct = prodRes.products[0];
  testProductId = targetProduct._id;
  initialStock = targetProduct.stock;
  console.log(`✓ Fetched candle: "${targetProduct.name}", Price: ₹${targetProduct.price}, Current Stock: ${initialStock}`);

  // 6. Cart Management
  console.log('\n[6] Testing Cart Addition & Total Recalculation...');
  const cartRes = await fetch(`${API_BASE}/cart/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${buyerToken}`
    },
    body: JSON.stringify({ productId: testProductId, quantity: 1 })
  }).then(r => r.json());
  assert.strictEqual(cartRes.success, true, 'Add to cart should succeed');
  console.log(`✓ Added to cart. Cart subtotal: ₹${cartRes.cart.subtotal}, Delivery Fee: ₹${cartRes.cart.shippingFee}`);

  // 7. Atomic Order Creation & Stock Decrement
  console.log('\n[7] Testing Order Creation & Stock Protection...');
  const orderRes = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${buyerToken}`
    },
    body: JSON.stringify({
      items: [{ productId: testProductId, quantity: 1, name: targetProduct.name }],
      shippingAddress: {
        fullName: 'Priya Sundaram',
        phone: '+91 98111 44556',
        street: '402 Lotus Meadows, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India'
      },
      paymentMethod: 'TestCard',
      notes: 'Automated test verification order'
    })
  }).then(r => r.json());

  assert.strictEqual(orderRes.success, true, 'Order creation should succeed');
  testOrderId = orderRes.order._id;
  console.log(`✓ Order placed successfully! Order Number: ${orderRes.order.orderNumber}, Total: ₹${orderRes.order.total}`);

  // Verify stock was reduced by 1
  const refreshedProduct = await fetch(`${API_BASE}/products/${testProductId}`).then(r => r.json());
  assert.strictEqual(refreshedProduct.product.stock, initialStock - 1, 'Stock must decrement by 1');
  console.log(`✓ Stock decrement verified! New stock: ${refreshedProduct.product.stock} (was ${initialStock})`);

  // 8. Seller Dashboard & Authorization
  console.log('\n[8] Testing Seller Dashboard & Multi-seller Item Management...');
  const sellerDashRes = await fetch(`${API_BASE}/seller/dashboard`, {
    headers: { 'Authorization': `Bearer ${sellerToken}` }
  }).then(r => r.json());
  assert.strictEqual(sellerDashRes.success, true, 'Seller dashboard must be accessible');
  assert(sellerDashRes.stats.grossSales >= 0, 'Gross sales should be a valid number');
  console.log(`✓ Seller metrics verified: Gross Sales: ₹${sellerDashRes.stats.grossSales}, Net Earnings: ₹${sellerDashRes.stats.netEarnings}, Commission: ₹${sellerDashRes.stats.platformCommission}`);

  // 9. Admin Security Enforcement
  console.log('\n[9] Testing Admin Authorization Enforcement...');
  // Attempt to access admin routes with buyer token (must fail with 403)
  const forbiddenRes = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${buyerToken}` }
  });
  assert.strictEqual(forbiddenRes.status, 403, 'Buyer should be forbidden from admin routes');
  console.log('✓ Security check passed: Non-admin users strictly forbidden from admin routes (403)');

  // Access admin with admin token
  const adminDashRes = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }).then(r => r.json());
  assert.strictEqual(adminDashRes.success, true);
  console.log(`✓ Admin access verified: Total Platform GMV: ₹${adminDashRes.stats.totalPlatformRevenue}, Total Users: ${adminDashRes.stats.totalUsers}`);

  console.log('\n====================================================');
  console.log('ALL 9 BACKEND & BUSINESS RULE TESTS PASSED FLAWLESSLY!');
  console.log('====================================================\n');
}

testSuite().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
