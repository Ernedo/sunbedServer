const axios = require('axios')
var fetch = require('node-fetch');
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

exports.createOrder = async (amount) => {
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
                            name: 'Sunbed Reserved',
                            description: 'Sunbed Description',
                            quantity: 1,
                            unit_amount: {
                                currency_code: 'USD',
                                value: amount
                            }
                        }
                    ],

                    amount: {
                        currency_code: 'USD',
                        value: amount,
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: amount
                            }
                        }
                    }
                }
            ],

            application_context: {
                return_url: 'http://localhost:5000' + '/complete-order',
                cancel_url: 'http://localhost:5000' + '/cancel-order',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                brand_name: 'manfra.io'
            }
        })
    })

    return response.data.links.find(link => link.rel === 'approve').href
}

exports.capturePayment = async (orderId) => {
    const accessToken = await generateAccessToken()
    
    // const response = await axios({
    //     url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
    //     method: 'post',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + accessToken
    //     }
    // })
    const response = await fetch('https://api-m.sandbox.paypal.com' + `/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
    }
});

    return response.data
}