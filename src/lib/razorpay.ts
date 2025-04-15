import Razorpay from 'razorpay';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Create a payment order
export const createOrder = async (amount: number, currency: string = 'INR') => {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Verify payment signature
export const verifyPayment = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) => {
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(body.toString())
    .digest('hex');

  return expectedSignature === razorpaySignature;
};

// Create a payment link for escrow
export const createEscrowPaymentLink = async (
  amount: number,
  description: string,
  customerName: string,
  customerEmail: string,
  customerContact: string
) => {
  try {
    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      description,
      customer: {
        name: customerName,
        email: customerEmail,
        contact: customerContact,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      callback_url: `${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify`,
      callback_method: 'get',
    });

    return paymentLink;
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw error;
  }
};

export default razorpay; 