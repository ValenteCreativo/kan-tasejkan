// Stablecoin contract addresses for EVM chains
export const USDC_ADDRESSES: Record<number, string> = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',     // Ethereum Mainnet
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',  // Base
  137: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',   // Polygon
  42161: '0xaf88d065e77c8cc2239327c5edb3a432268e5831', // Arbitrum One
  // Testnets
  84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia
  11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia
};

export const USDT_ADDRESSES: Record<number, string> = {
  1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',     // Ethereum Mainnet
  137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',   // Polygon
  42161: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // Arbitrum One
};

// Chain names for display
export const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  8453: 'Base',
  137: 'Polygon',
  42161: 'Arbitrum',
  84532: 'Base Sepolia',
  11155111: 'Sepolia',
};

// Block explorer URLs
export const BLOCK_EXPLORERS: Record<number, string> = {
  1: 'https://etherscan.io',
  8453: 'https://basescan.org',
  137: 'https://polygonscan.com',
  42161: 'https://arbiscan.io',
  84532: 'https://sepolia.basescan.org',
  11155111: 'https://sepolia.etherscan.io',
};

// ERC20 ABI for transfer
export const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
] as const;

// Helper to get token address
export function getTokenAddress(chainId: number, token: 'USDC' | 'USDT'): string | null {
  if (token === 'USDC') {
    return USDC_ADDRESSES[chainId] || null;
  }
  return USDT_ADDRESSES[chainId] || null;
}

// Helper to get explorer URL for transaction
export function getTxExplorerUrl(chainId: number, txHash: string): string {
  const explorer = BLOCK_EXPLORERS[chainId] || 'https://etherscan.io';
  return `${explorer}/tx/${txHash}`;
}

// Helper to get explorer URL for address
export function getAddressExplorerUrl(chainId: number, address: string): string {
  const explorer = BLOCK_EXPLORERS[chainId] || 'https://etherscan.io';
  return `${explorer}/address/${address}`;
}

// Format address for display (0x1234...5678)
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Parse stablecoin amount (6 decimals for USDC/USDT)
export function parseStablecoinAmount(amount: number): bigint {
  return BigInt(Math.round(amount * 1_000_000));
}

// Format stablecoin amount from wei
export function formatStablecoinAmount(amount: bigint): number {
  return Number(amount) / 1_000_000;
}

// Supported chains for the app
export const SUPPORTED_CHAIN_IDS = [8453, 137, 42161, 1] as const;
export type SupportedChainId = typeof SUPPORTED_CHAIN_IDS[number];

// Default chain (Base - lowest fees)
export const DEFAULT_CHAIN_ID = 8453;

// Whitelisted admin email
export const ADMIN_EMAIL = 'martinagorozo1@proton.me';

// Check if email is whitelisted for admin
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
