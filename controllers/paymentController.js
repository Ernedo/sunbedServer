const paypal = require('paypal-rest-sdk');
const axios = require('axios')
var fetch = require('node-fetch')
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AY5SmpGleeoJQm0YD31OXdPtrE9J0PEypJpKAtJAMK2HLlV1ZLcad_1RnlSlERiCWw-6U8HtkCI7rZBY',
  'client_secret': 'EPQpN_IUVB7Yf734cRDJdf7d8BS86-UaOncvgHXAChG1b6HJx_FhxxyAXbF5UGyr4BXj9f1hfcxQ7Swz'
});

async function paypalPayment(params) {
  const accessToken = await generateAccessToken()

  const response = await axios({
    url: 'https://api-m.sandbox.paypal.com' + '/v2/checkout/orders',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    data: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          items: [
            {
              name: 'Node.js Complete Course',
              description: 'Node.js Complete Course with Express and MongoDB',
              quantity: 1,
              unit_amount: {
                currency_code: 'USD',
                value: '100.00'
              }
            }
          ],

          amount: {
            currency_code: 'USD',
            value: '100.00',
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: '100.00'
              }
            }
          }
        }
      ],

      application_context: {
        return_url: 'http://localhost:5000' + '/success',
        cancel_url: 'http://localhost:5000' + '/cancel',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      }
    })
  })

  return response.data.links.find(link => link.rel === 'approve').href
}
async function generateAccessToken() {
  const response = await axios({
    url: 'https://api-m.sandbox.paypal.com' + '/v1/oauth2/token',
    method: 'post',
    data: 'grant_type=client_credentials',
    auth: {
      username: "AY5SmpGleeoJQm0YD31OXdPtrE9J0PEypJpKAtJAMK2HLlV1ZLcad_1RnlSlERiCWw-6U8HtkCI7rZBY",
      password: "EPQpN_IUVB7Yf734cRDJdf7d8BS86-UaOncvgHXAChG1b6HJx_FhxxyAXbF5UGyr4BXj9f1hfcxQ7Swz"
    }
  })

  return response.data.access_token
}
async function capturePayment(orderId) {
  const accessToken = await generateAccessToken()
 
  try {
    // const response = await axios({
    //   url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
    //   method: 'post',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + accessToken
    //   },

    // })
    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type':"application/x-www-form-urlencoded",
        'Authorization': 'Bearer ' + accessToken
      }
    })
    console.log(response);

  } catch (error) {
    console.log(error);
  }

}
module.exports = { paypalPayment, capturePayment };