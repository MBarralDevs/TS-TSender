# TSender 🐎

![TSender Banner](public/T-Sender.svg)

> The most gas-efficient airdrop contract on Earth, built in Huff

TSender is a hyper-optimized bulk ERC20 token transfer application that allows you to distribute tokens to multiple recipients in a single transaction. Built with cutting-edge Web3 technologies and optimized smart contracts written in Huff, TSender minimizes gas costs while maximizing efficiency.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://your-vercel-url.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

- **⚡ Hyper Gas-Optimized**: Smart contracts written in Huff for maximum efficiency
- **🔄 Bulk Transfers**: Send tokens to multiple addresses in a single transaction
- **🌐 Multi-Chain Support**: Works on Ethereum, Optimism, Arbitrum, Base, zkSync, and more
- **💼 RainbowKit Integration**: Beautiful wallet connection experience
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🔍 Real-Time Validation**: Input validation and transaction preview
- **💾 Local Storage**: Preserves form data between sessions
- **🎨 Modern UI**: Clean, professional interface built with Tailwind CSS

## 🚀 Live Demo

Check out the live application: [TSender on Vercel](https://your-vercel-url.vercel.app)

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **RainbowKit** - Wallet connection UI
- **Wagmi** - React hooks for Ethereum
- **Viem** - Lightweight Ethereum library
- **TanStack Query** - Data fetching and caching

### Smart Contracts

- **Huff** - Low-level EVM language for gas optimization
- **Solidity** - Smart contract development

### Testing

- **Vitest** - Unit testing framework
- **Playwright** - E2E testing (configured)
- **Synpress** - Web3 E2E testing (configured)

### Development Tools

- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting
- **Anvil** - Local Ethereum node for testing

## 📋 Supported Networks

- **Ethereum Mainnet** (Chain ID: 1)
- **Optimism** (Chain ID: 10)
- **Arbitrum** (Chain ID: 42161)
- **Base** (Chain ID: 8453)
- **zkSync Era** (Chain ID: 324)
- **Sepolia Testnet** (Chain ID: 11155111)
- **Anvil Local** (Chain ID: 31337)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ and pnpm installed
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- Some ETH for gas fees

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MBarralDevs/TS-TSender.git
   cd TS-TSender
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

   Get your WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Performing an Airdrop

1. **Connect Your Wallet**

   - Click the "Connect Wallet" button in the header
   - Select your preferred wallet and approve the connection

2. **Enter Token Details**

   - **Token Address**: Enter the ERC20 token contract address
   - **Recipient Addresses**: Enter recipient addresses (comma or newline separated)
   - **Amounts**: Enter amounts to send (must match recipient count, in wei)

3. **Review Transaction**

   - The right panel shows a preview of your transaction
   - Verify token name, symbol, total amount, and recipient count

4. **Submit Airdrop**
   - Click "Submit Airdrop"
   - Approve the token spending in your wallet (if needed)
   - Confirm the airdrop transaction
   - Wait for blockchain confirmation

### Example Input Format

**Recipients:**

```
0xAddress1...
0xAddress2...
0xAddress3...
```

**Amounts (in wei):**

```
1000000000000000000
2000000000000000000
1500000000000000000
```

## 🧪 Testing

### Run Unit Tests

```bash
pnpm test
```

### Run Tests with UI

```bash
pnpm test:ui
```

### Run Tests with Coverage

```bash
pnpm test:coverage
```

### Run E2E Tests (with Playwright)

```bash
pnpm test:e2e
```

## 🔧 Local Development with Anvil

To test with a local blockchain:

1. **Start Anvil with saved state**

   ```bash
   pnpm anvil
   ```

2. **In another terminal, start the dev server**

   ```bash
   pnpm dev
   ```

3. **Connect to Anvil network**
   - Add Anvil network to your wallet (Chain ID: 31337, RPC: http://127.0.0.1:8545)
   - Import test accounts from Anvil

## 📁 Project Structure

```
ts-tsender/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   ├── providers.tsx    # Web3 providers
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── AirdropForm.tsx  # Main form component
│   │   ├── Header.tsx       # App header
│   │   ├── HomeContent.tsx  # Home content wrapper
│   │   ├── TransactionDetails.tsx
│   │   └── ui/              # UI components
│   ├── hooks/               # Custom React hooks
│   │   ├── UseLocalStorage.ts
│   │   └── UseTokenInfo.ts
│   ├── utils/               # Utility functions
│   │   └── calculateTotal/
│   ├── Constants.ts         # Contract addresses and ABIs
│   └── rainbowKitConfig.tsx # RainbowKit configuration
├── test/                    # Test files
│   ├── playwright/          # E2E tests
│   └── wallet-setup/        # Synpress wallet setup
├── public/                  # Static assets
├── playwright.config.ts     # Playwright config
├── next.config.ts           # Next.js config
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

## 🔐 Smart Contract Addresses

### TSender Contract

| Network     | Address                                      |
| ----------- | -------------------------------------------- |
| Ethereum    | `0x3aD9F29AB266E4828450B33df7a9B9D7355Cd821` |
| Optimism    | `0xAaf523DF9455cC7B6ca5637D01624BC00a5e9fAa` |
| Arbitrum    | `0xA2b5aEDF7EEF6469AB9cBD99DE24a6881702Eb19` |
| Base        | `0x31801c3e09708549c1b2c9E1CFbF001399a1B9fa` |
| zkSync Era  | `0x7e645Ea4386deb2E9e510D805461aA12db83fb5E` |
| Sepolia     | `0xa27c5C77DA713f410F9b15d4B0c52CAe597a973a` |
| Anvil Local | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Wallet integration powered by [RainbowKit](https://www.rainbowkit.com/)
- Smart contracts optimized with [Huff](https://huff.sh/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📬 Contact

For questions, suggestions, or issues, please open an issue on GitHub or reach out via:

- GitHub: [@MBarralDevs](https://github.com/MBarralDevs)
- Project Link: [https://github.com/MBarralDevs/TS-TSender](https://github.com/MBarralDevs/TS-TSender)

---

<p align="center">Made with ❤️ by the TSender team</p>
<p align="center">⭐ Star this repo if you find it useful!</p>
