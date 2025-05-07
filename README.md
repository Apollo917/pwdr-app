<div align="center">

# pwdr app

Generate strong, repeatable passwords using a secret phrase and key — all offline, with zero tracking

![pwdr app logo](.readme/logo-w-bg.png)

</div>

## ✨ Main features

### 🔑 Deterministic Password Generation

Generate the same strong password every time using a combination of your secret phrase and key

### 🔒 Encrypted Local Storage

Your secret phrases are encrypted and securely stored on your device

### 🧠 Convenient Access

Unlock your secret phrase vault with a PIN — no need to retype your secret phrase each time

### 🚫 No Servers, No Tracking

Everything happens locally on your device. No data is sent or stored externally

## 🛠 How It Works

- Set a PIN to protect your encrypted secret phrase vault
- Unlock your vault using the PIN
- Add a secret phrase — it's encrypted and stored locally on your device
- Enter a secret key to generate a consistent, strong password
- Copy the generated password — ready to use

## 📦 Under the Hood

This app is powered by [pwdr](https://www.npmjs.com/package/pwdr), a lightweight and secure npm package that enables
deterministic password generation based on a secret phrase and key combination

- [pwdr npm package](https://www.npmjs.com/package/pwdr)
- [pwdr GitHub repository](https://github.com/Apollo917/pwdr)

## 🚧 Limitations

Data is stored only in your browser's local storage. Clearing browser data will remove your encrypted secret phrase.

**Make sure to remember your password and secret phrase — there is no recovery method**
