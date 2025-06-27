# 🚀 Store Whatever - Universal File Import & Filecoin Storage dApp

**Store anything, from anywhere, on Filecoin.** A revolutionary decentralized application that breaks down barriers between data sources, enabling seamless file uploads from multiple platforms directly to Filecoin's decentralized storage network.

---

## 🎯 What Makes Store Whatever Special?

**Store Whatever** isn't just another file upload tool - it's a **universal data bridge** that connects your favorite platforms to decentralized storage. Whether your files live on Google Drive, GitHub, YouTube, or your local device, we make it effortless to store them permanently on Filecoin.

### ✨ Key Features

🌐 **Multi-Source Import**
- 📁 **Local Upload:** Drag-and-drop or select files from your device
- ☁️ **Google Drive:** Import files directly from public Google Drive links
- 🐙 **GitHub Repositories:** Download and store entire repos or specific files
- 🎥 **YouTube Videos:** Archive your favorite videos to decentralized storage

🎨 **Professional UX**
- Clean, intuitive tabbed interface for easy navigation
- Real-time progress indicators and status updates
- Comprehensive error handling with helpful feedback
- Modern design built with React and Tailwind CSS

🔒 **Decentralized & Secure**
- Powered by Filecoin's robust decentralized storage network
- Smart contract integration via Synapse protocol
- Web3 wallet connection with RainbowKit
- Pay with USDFC tokens for transparent storage costs

## 🎬 See It In Action

**🎥 Demo Video:** [Watch the full walkthrough](https://youtu.be/MCuw1eY4RxY)

**🌟 Live Demo:** [Try it now at store-whatever.vercel.app](https://store-whatever.vercel.app/)

**📋 Implementation Details:** [View the comprehensive PR](https://github.com/aliveevie/store_whatever/pull/1)

---

## 🏗️ Architecture & Technology

### Frontend Stack
- **React 18** with **Next.js 14** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for responsive design
- **RainbowKit** for Web3 wallet integration

### Backend Infrastructure
- **Next.js API Routes** for CORS-compliant proxy services
- **JSZip** for GitHub repository extraction
- **Synapse SDK** for Filecoin integration

### Blockchain Integration
- **Filecoin Mainnet & Calibration** networks
- **USDFC** token for storage payments
- **Smart contracts** via Synapse protocol

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Web3 wallet (MetaMask recommended)
- Get testnet tokens:
  - [Filecoin Calibration tFIL](https://faucet.calibnet.chainsafe-fil.io/funds.html)
  - [USDFC tokens](https://forest-explorer.chainsafe.dev/faucet/calibnet_usdfc)

### Installation

```bash
# Clone the repository
git clone https://github.com/aliveevie/store_whatever.git
cd store_whatever

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the magic happen! ✨

---

## 📖 How It Works

### 1. **Connect Your Wallet**
- Support for multiple wallet providers via RainbowKit
- Automatic network switching between Filecoin Mainnet and Calibration

### 2. **Choose Your Source**
Navigate through our intuitive tabs:
- **📱 Device:** Direct file upload with drag-and-drop
- **☁️ Google Drive:** Paste public file links for instant import
- **🐙 GitHub:** Import repositories as zip files
- **🎥 YouTube:** Archive videos for permanent storage

### 3. **Upload & Store**
- Files are processed through our secure proxy service
- Automatic upload to Filecoin via Synapse protocol
- Real-time progress tracking and status updates

### 4. **Manage Storage**
- View all your stored files and proof sets
- Monitor storage usage and remaining balance
- Easy file retrieval and sharing options

---

## 🛠️ Advanced Features

### CORS-Free File Fetching
Our backend proxy service (`/api/proxy-download`) ensures seamless file imports from external sources without browser restrictions.

### Smart Storage Management
- Automatic 10GB storage allocation for 30 days
- Intelligent balance monitoring and payment reminders
- Transparent pricing with USDFC tokens

### Extensible Architecture
Built with modularity in mind - easily add new import sources or customize the upload flow to fit your needs.

---

## 🤝 Contributing

We welcome contributions! Whether it's:
- 🐛 Bug fixes and improvements
- ✨ New import source integrations
- 📚 Documentation enhancements
- 🎨 UI/UX improvements

Please feel free to submit a Pull Request or open an issue.

---

## 📚 Technical Documentation

- [Filecoin Synapse SDK](https://github.com/FilOzone/synapse-sdk)
- [USDFC Token Documentation](https://docs.secured.finance/usdfc-stablecoin/getting-started)
- [RainbowKit Documentation](https://www.rainbowkit.com)
- [Next.js App Router](https://nextjs.org/docs)

---

## 🎯 Roadmap

- [ ] **Dropbox Integration:** Expand cloud storage support
- [ ] **Multiple File Selection:** Choose specific files from GitHub repos
- [ ] **Video Processing:** Enhanced YouTube import with format options
- [ ] **Mobile App:** React Native implementation
- [ ] **API Access:** Developer API for programmatic uploads

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the decentralized web**

*Store Whatever - Because your data deserves freedom.*
