# Scaffold-ETH 2 Architecture

## Overview

Scaffold-ETH 2 is a full-stack dApp development toolkit that provides a modern, type-safe development environment for building Ethereum applications. The project uses a monorepo structure managed by Yarn workspaces.

## Directory Structure

./
├── packages/
│ ├── nextjs/ # Frontend application
│ │ ├── app/ # Next.js app directory
│ │ ├── components/ # Reusable React components
│ │ ├── contracts/ # Generated contract types
│ │ ├── hooks/ # Custom React hooks
│ │ ├── services/ # Web3 and other services
│ │ ├── styles/ # Global styles
│ │ └── utils/ # Utility functions
│ │
│ └── hardhat/ # Smart contract development
│ ├── contracts/ # Solidity smart contracts
│ ├── deploy/ # Deployment scripts
│ ├── test/ # Contract test files
│ └── scripts/ # Utility scripts
├── .github/ # GitHub workflows and templates
└── packages.json # Root package.json for workspace

## Key Technical Points

### Frontend (packages/nextjs)

1. **Framework**: 
   - Next.js 14 with App Router
   - React 18
   - TypeScript

2. **Web3 Integration**:
   - RainbowKit for wallet connection
   - Wagmi for contract interactions
   - Viem for Ethereum interactions

3. **Key Features**:
   - Hot reloading for contract changes
   - Type-safe contract interactions
   - Built-in block explorer
   - Debug interface for contracts
   - Burner wallet integration
   - Faucet functionality

### Smart Contracts (packages/hardhat)

1. **Development Environment**:
   - Hardhat
   - TypeScript
   - Ethers.js v6

2. **Features**:
   - Automated contract type generation
   - Multiple network support
   - Contract verification
   - Test environment
   - Local chain deployment

### Development Workflow

1. **Local Development**:
   - Local hardhat network (`yarn chain`)
   - Contract deployment (`yarn deploy`)
   - Frontend development (`yarn start`)

2. **Testing**:
   - Contract tests (`yarn test`)
   - TypeScript type checking
   - Linting and formatting

3. **Deployment**:
   - Multi-network deployment support
   - Environment configuration
   - Vercel deployment ready

## Key Files

1. **Configuration**:
   - `scaffold.config.ts`: Main configuration file
   - `hardhat.config.ts`: Hardhat configuration
   - `tailwind.config.js`: UI styling configuration

2. **Contract Integration**:
   - `deployedContracts.ts`: Auto-generated contract info
   - `wagmiConfig.ts`: Web3 configuration
   - `contracts/`: Generated contract types

3. **Core Components**:
   - Debug interface
   - Block explorer
   - Contract components
   - Web3 hooks

## Development Features

1. **Developer Experience**:
   - Hot reloading
   - Type safety
   - Built-in debugging tools
   - Comprehensive documentation

2. **Built-in Components**:
   - Address display
   - Balance display
   - Contract interaction forms
   - Transaction displays

3. **Security**:
   - Environment variable management
   - Secure wallet integration
   - Type-safe contract interactions

## Extension Points

1. **Frontend**:
   - Custom hooks can be added in `hooks/`
   - New components in `components/`
   - Additional pages in `app/`

2. **Smart Contracts**:
   - New contracts in `contracts/`
   - Custom deployment scripts in `deploy/`
   - Test files in `test/`

3. **Configuration**:
   - Network configuration
   - Contract verification settings
   - UI customization