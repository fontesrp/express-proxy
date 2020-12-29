# express-proxy

A simple proxy implementation using Express.

When running this project locally, I can connect my computer to a VPN and point the requests made by an app running on my phone to my computer's local IP. That way, I get to access restricted domais without needing to configure a VPN on my phone.

This project was created with:

```bash
npx express-generator --no-view express-proxy
```

# How to

Run the following command, replacing the URL with the restricted domain you want to access from your phone:

```bash
URL=https://my.proxied.url.com yarn start
```

# Limitations

- Only tested requests with `application/json` and `multipart/form-data` for content types
- The script on [`config.js`](./config.js) lor logging the computer's IP will only work on macOS

# License

This project is available under the MIT License. For more information, check the [LICENSE](./LICENSE) file.
