const functions = require('firebase-functions');
const admin = require('firebase-admin');
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

// 1. Welcome Email Trigger
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const email = user.email;
  const displayName = user.displayName || 'Bird Parent';
  
  console.log(`Sending welcome email to ${email}`);
  
  await db.collection('mail').add({
    to: email,
    message: {
      subject: 'Welcome to Avelyn! 🦜',
      html: `<h1>Welcome to the Flock, ${displayName}!</h1>
             <p>We are thrilled to support your bird-care journey with structured care checklists, diagnostics, and vet insights.</p>
             <p>Log in today to check on your companion mascot!</p>`
    }
  });
});

// 2. Referral Success & Discount Earned Trigger
exports.handleReferralApplied = functions.firestore
  .document('referrals/{referralId}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    const { referrerUid, referredUid } = data;
    
    const referrerSnap = await db.collection('users').doc(referrerUid).get();
    const referredSnap = await db.collection('users').doc(referredUid).get();
    
    if (referrerSnap.exists && referredSnap.exists) {
      const referrer = referrerSnap.data();
      const referred = referredSnap.data();
      
      console.log(`Referral Success: ${referred.email} referred by ${referrer.email}`);
      
      // Send email to Referrer (A) - Reward Credit Earned
      await db.collection('mail').add({
        to: referrer.email,
        message: {
          subject: 'Your referral was successful! 🎉',
          html: `<h3>Referral Success!</h3>
                 <p>Your friend just signed up using your code. You have earned a <b>10% reward credit</b> on your account!</p>
                 <p>Total Savings Claimed: ${referrer.totalReferralRewards || 0}%</p>`
        }
      });
      
      // Send email to Referred (B) - Discount applied
      await db.collection('mail').add({
        to: referred.email,
        message: {
          subject: 'Welcome to Avelyn - 5% Discount Applied! 🎁',
          html: `<h3>Discount Earned!</h3>
                 <p>You received a <b>5% welcome discount</b> for signing up through ${referrer.email}'s referral link.</p>
                 <p>Enjoy your bird companion journey!</p>`
        }
      });
    }
  });

// 3. Order Confirmation Trigger
exports.handleOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snapshot, context) => {
    const order = snapshot.data();
    const orderId = context.params.orderId;
    
    const userSnap = await db.collection('users').doc(order.userId).get();
    if (userSnap.exists) {
      const user = userSnap.data();
      
      console.log(`Order Confirmation: Order ${orderId} created by ${user.email}`);
      
      await db.collection('mail').add({
        to: user.email,
        message: {
          subject: `Avelyn Order Confirmation - #${orderId.slice(0, 8)}`,
          html: `<h3>Thank you for your order!</h3>
                 <p>Order ID: ${orderId}</p>
                 <p>Total Price: $${order.totalPrice}</p>
                 <p>We are preparing your premium flock supplies for shipment.</p>`
        }
      });
    }
  });

// 4. Shipping Status Updates Trigger
exports.handleShippingUpdate = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const oldOrder = change.before.data();
    const newOrder = change.after.data();
    const orderId = context.params.orderId;
    
    if (oldOrder.status !== newOrder.status) {
      const userSnap = await db.collection('users').doc(newOrder.userId).get();
      if (userSnap.exists) {
        const user = userSnap.data();
        
        console.log(`Shipping Update: Order ${orderId} is now ${newOrder.status}`);
        
        await db.collection('mail').add({
          to: user.email,
          message: {
            subject: `Shipping Update for Order #${orderId.slice(0, 8)}: ${newOrder.status.toUpperCase()}`,
            html: `<h3>Your order status has changed!</h3>
                   <p>Your order <b>#${orderId}</b> is now: <b>${newOrder.status}</b></p>
                   <p>Thank you for choosing Avelyn.</p>`
          }
        });
      }
    }
  });
