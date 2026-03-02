<div align="center">

# pwdr app

Generate, don't store!

![pwdr app logo](.readme/logo-w-bg.png)

</div>

## 🔑 pwdr app

**The Stateless Password Generator. Your brain is the database**

`pwdr` is a hybrid password generator designed for those who want to move away from cloud-synced vaults and physical notebooks. Instead of storing passwords, you **calculate** them using a Master Secret and a logical Key system

## 🌍 Anywhere You Are

`pwdr` is designed to be available wherever you need a password

- 🌐 **Web:** [Use it as a standalone Web App](https://pwdr.telegram.apollo.pub/)
- **🧩 Chrome Extension:** [Generate and copy passwords directly from your browser toolbar](https://chromewebstore.google.com/detail/oajipmekhnmmmhhhhlngdnjnfkmeodha?utm_source=item-share-cb)
- **🤖 Telegram Mini App:** [Access your "vault" on the go through Telegram](https://t.me/pwdrAppBot)

## 💡 The Philosophy: Mental Composition

The core idea is to eliminate the need to "save" anything. By using a **mental system** for your keys, you carry your entire password vault in your head without actually memorizing hundreds of strings

1. **The Secret Phrase:** One strong, complex phrase you never forget
2. **The Key System:** A logical rule you create for yourself to generate keys on the fly
   - _Example:_ `[Service Name] + [Year of Account] + [A Personal Keyword]`
   - _Resulting Keys:_ `github2024coffee`, `gmail2018coffee`, `netflix2021coffee`
3. **The Output:** `pwdr` processes these to generate high-entropy, unique passwords for every service

## ✨ Main Features

- 🧠 **100% Deterministic:** Same inputs, same output. Every single time
- 🛡️ **Identity Signature:** Every Secret Phrase produces a **unique visual/textual signature.** This allows you to instantly verify you haven't made a typo in your master phrase before generating passwords
- ⚙️ **Tunable Local Security:** Choose how heavily to encrypt your Secret Phrase locally. Higher strength increases protection against brute-force attacks on your device's storage at the cost of a slightly longer generation time
- 🔒 **Encrypted Local Vault:** For convenience, your Secret Phrase can be AES-encrypted and stored in your browser's local storage
- ⚡ **PIN Quick-Unlock:** Use a simple PIN to unlock your vault so you don't have to type your long Secret Phrase for every new password
- 🚫 **Offline & Private:** No servers, no tracking, and no data collection. It works entirely in your browser

## 🛠 How It Works

1. **Initialize:** Set a master PIN to lock the app interface
2. **Enter Secret:** Input your "Master Secret Phrase"
3. **Verify Signature:** Check the Signature on screen. If it matches your "usual" signature, you know your input is 100% correct.
4. **Compose Key:** Use your personal mental logic to enter a Key for the service you need.
5. **Copy & Go:** Use the generated password. No saving required.

## 📦 Under the Hood

As a tool built by a developer for users who value architectural transparency, the engine is fully open-source

- **Engine:**
  - [pwdr npm package](https://www.npmjs.com/package/pwdr)
  - [pwdr GitHub repository](https://github.com/Apollo917/pwdr)
- **Security:** Uses cryptographic hashing to ensure that even a tiny change in the Key results in a completely different password

## ⚠️ Important Considerations

- **Statelessness:** No data is synced. If you change your Master Secret, all passwords change
- **Persistence:** Data is kept in local storage. If you clear your browser data, you will need to re-input your Master Secret Phrase
- **Total Responsibility:** There is no "Recovery" or "Forgot Password" link. **Your memory is the only backup**
