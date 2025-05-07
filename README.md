<div align="center">

# pwdr app

Generate strong, repeatable passwords using a secret phrase and a secret key — all offline, with zero tracking

![pwdr app logo](.readme/logo-w-bg.png)

</div>

## ✨ Features

### 🔑 Deterministic Password Generation

Uses a combination of your secret phrase and secret key to generate the same strong password every time

### 🔒 Encrypted Local Storage

Your secret phrase is encrypted and securely stored on your device, so you only need to remember your password and
secret key

### 🧠 Convenient Access

The app requires a password to unlock your saved secret phrase. No need to retype it every time

### 🚫 No Servers, No Tracking

Everything happens locally in your browser. This app doesn’t send or store any data externally

## 🛠 How It Works

- Set a PIN code to protect your encrypted secret phrase
- Unlock the pwdr app by entering the PIN from the previous step
- Add a secret phrase — it’s encrypted and saved in your browser's local storage
- Input a secret key when needed to generate consistent, strong passwords
- Copy your generated password — ready to use

## 📦 Under the Hood

This app is powered by [pwdr](https://www.npmjs.com/package/pwdr), a lightweight and secure npm package that enables
deterministic password generation based on a secret phrase and key combination

- [pwdr npm package](https://www.npmjs.com/package/pwdr)
- [pwdr GitHub repository](https://github.com/Apollo917/pwdr)

## 🚧 Limitations

Data is stored only in your browser's local storage. Clearing browser data will remove your encrypted secret phrase.

**Make sure to remember your password and secret phrase — there is no recovery method**
