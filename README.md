🤖 BLACK-CODE-AI

WhatsApp AI Bot

Welcome to BLACK-CODE-AI! Follow these steps carefully to install and connect your bot to WhatsApp.

STEP 1: Install Termux Requirements

Open Termux and type this command:

pkg update && pkg upgrade -y

Press ENTER and wait until it finishes.

Now type:

pkg install nodejs git nano -y

Press ENTER and wait for installation.

STEP 2: Download BLACK-CODE-AI

Copy and paste this command into Termux:

git clone https://github.com/mkuhilikelvin/BLACK-CODE-AI.git

Press ENTER.

Now enter the bot folder:

cd BLACK-CODE-AI

STEP 3: Install Bot Packages

Type:

npm install

Press ENTER and wait until all packages are installed.

STEP 4: Get Your OpenAI API Key

The bot needs an OpenAI API key to answer messages using AI.

1. Open this website:
   
   https://platform.openai.com/

2. Sign in or create an account with the help of a parent or guardian if needed.

3. Open the API Keys page:
   
   https://platform.openai.com/api-keys

4. Create a new secret key.

5. Give your key a name, for example "BLACK-CODE-AI".

6. Generate the key.

7. Copy and save it somewhere private.

IMPORTANT: Never share your API key with anyone or upload it to GitHub. API usage may require separate billing.

STEP 5: Add Your API Key to the Bot

Go back to Termux.

Make sure you are inside the BLACK-CODE-AI folder.

Type:

nano .env

Press ENTER.

Now type this line:

OPENAI_API_KEY=PASTE_YOUR_API_KEY_HERE

Replace "PASTE_YOUR_API_KEY_HERE" with your own API key.

To save the file:

1. Press CTRL + O.
2. Press ENTER.
3. Press CTRL + X.

Your API key is now saved in your private ".env" file.

STEP 6: Connect Your WhatsApp

Start the bot:

npm start

Follow the connection instructions displayed in Termux.

If a pairing code is displayed, follow the WhatsApp linked-devices instructions to connect your own WhatsApp account.

STEP 7: Control Your AI

After connecting, use these commands:

Command| Function
"ai on"| Turn AI ON
"ai off"| Turn AI OFF
"status"| Check AI status

🔐 SECURITY RULES

- Use your own WhatsApp account or one you have permission to connect.
- Use your own API key.
- Never share your ".env" file.
- Never share your WhatsApp session files.
- Do not use the bot for spam or unwanted messages.

👨‍💻 DEVELOPER

BLACK-CODE-AI

GitHub:
https://github.com/mkuhilikelvin/BLACK-CODE-AI

Thank you for choosing BLACK-CODE-AI! 🚀
