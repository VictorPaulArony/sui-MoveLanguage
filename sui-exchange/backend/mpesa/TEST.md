# M-Pesa Test
## Mpesa STKPush test

### **Curl Command Example**

```bash
curl -X POST http://localhost:3000/api/pay \
  -H "Content-Type: application/json" \
  -d '{"phone": "254768744700", "amount": 1}'
```

---

### Explanation:

| Part                                           | Description                                                 |
| ---------------------------------------------- | ----------------------------------------------------------- |
| `http://localhost:3000/api/pay`                | This is your Express server endpoint for initiating payment |
| `-H "Content-Type: application/json"`          | Tells the server you're sending JSON data                   |
| `-d '{"phone": "254768744700", "amount": 1}'` | JSON body with the phone number and amount                  |

> **Note**: Use a valid phone number in the format `2547XXXXXXXX` and make sure you're using the Safaricom test number (`254768744700`) when in sandbox.

---

### Sample Output (Success Response):

If everything is working correctly, you should get a JSON response like this (simplified):

```json
{
  "MerchantRequestID": "29115-34620561-1",
  "CheckoutRequestID": "ws_CO_123456789",
  "ResponseCode": "0",
  "ResponseDescription": "Success. Request accepted for processing",
  "CustomerMessage": "Success. Request accepted for processing"
}
```

## Mpesa B2C test



```bash
curl -X POST http://localhost:3000/api/b2c/pay \
  -H "Content-Type: application/json" \
  -d '{"phone": "254768744700", "amount": 100}'
```