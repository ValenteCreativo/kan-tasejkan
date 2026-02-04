# Martina Store - Fase 2: Crypto Integration Implementation Plan

**Fecha**: 2026-02-04
**Email Admin Whitelistado**: `martinagorozo1@proton.me`
**Estado**: En Progreso
**Última actualización**: 2026-02-04

---

## Checklist de Implementación

### Fase 1: Cleanup & Preparación
- [x] Eliminar `/supabase-schema.sql`
- [x] Eliminar `/.env.example` (obsoleto)
- [x] Renombrar `/src/lib/supabase.ts` → `/src/lib/services.ts`
- [x] Crear nuevo `/.env.example` con variables actualizadas
- [x] Actualizar whitelist email a `martinagorozo1@proton.me`

### Fase 2: Dependencias
- [x] Instalar `@privy-io/react-auth`
- [x] Instalar `@privy-io/server-auth` (deprecated - considerar @privy-io/node para producción)
- [x] Instalar `viem`
- [x] Instalar `wagmi`
- [x] Instalar `@tanstack/react-query`
- [x] Remover `next-auth` del package.json (opcional - no se usa)

### Fase 3: Database Schema
- [x] Agregar tabla `wallet_users` en `/src/db/schema.ts`
- [x] Agregar tabla `shipping_addresses` en `/src/db/schema.ts`
- [x] Agregar tabla `crypto_orders` en `/src/db/schema.ts`
- [x] Exportar tipos TypeScript
- [x] Ejecutar `npm run db:generate`
- [x] Ejecutar `npm run db:push`

### Fase 4: Privy Authentication
- [x] Crear `/src/app/providers.tsx` con PrivyProvider
- [x] Actualizar `/src/app/layout.tsx` para usar Providers
- [x] Crear `/src/hooks/useWallet.ts` (custom hook)
- [x] Crear `/src/app/api/auth/wallet/route.ts`
- [x] Crear `/src/lib/crypto.ts` (utils y constantes)

### Fase 5: UI Components
- [x] Crear `/src/components/ui/ConnectWallet.tsx`
- [x] Actualizar `/src/components/ui/Navigation.tsx` con ConnectWallet
- [x] Mejorar `/src/components/HorizontalScroll.tsx` (click effect)
- [x] Crear `/src/components/checkout/PaymentSelector.tsx`
- [x] Crear `/src/components/checkout/CryptoPayment.tsx`
- [x] Crear `/src/components/checkout/ShippingForm.tsx`

### Fase 6: API Routes
- [x] Crear `/src/app/api/checkout-crypto/route.ts`
- [x] Crear `/src/app/api/verify-tx/route.ts`
- [x] Crear `/src/app/api/shipping/route.ts`
- [x] Crear `/src/app/api/auth/wallet/route.ts` (ya hecho en Fase 4)

### Fase 7: Crypto Utils (YA COMPLETADO EN FASE 4)
- [x] Crear `/src/lib/crypto.ts` (addresses, utils)
- [x] Agregar constantes de contratos USDC/USDT

### Fase 8: Integration Updates
- [x] Actualizar `/src/app/portfolio/[id]/page.tsx` con payment selector
- [x] Actualizar `/src/app/success/page.tsx` para crypto
- [ ] Actualizar `/src/actions/index.ts` con nuevas server actions (opcional)
- [x] Actualizar `/src/lib/auth.ts` con whitelist correcto

### Fase 9: Testing & Verificación
- [ ] Verificar conexión wallet funciona
- [ ] Verificar whitelist admin (`martinagorozo1@proton.me`)
- [ ] Verificar flujo de pago crypto (testnet)
- [ ] Verificar formulario shipping
- [ ] Verificar efecto click en horizontal scroll

---

## Detalles Técnicos

### Email Admin Whitelistado
```typescript
const WHITELIST_EMAIL = 'martinagorozo1@proton.me';
```

### Variables de Entorno Requeridas
```env
# Database (ya configurado)
DATABASE_URL=...

# Privy (NUEVO)
NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_SECRET=

# Wallet para recibir pagos (NUEVO)
MARTINA_WALLET_ADDRESS=

# MercadoPago (existente)
MERCADO_PAGO_ACCESS_TOKEN=
```

### Dependencias a Instalar
```bash
npm install @privy-io/react-auth @privy-io/server-auth viem wagmi @tanstack/react-query
```

### Schema de Base de Datos (Nuevas Tablas)

#### wallet_users
```sql
CREATE TABLE wallet_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  privy_id VARCHAR(255) UNIQUE NOT NULL,
  wallet_address VARCHAR(42),
  email VARCHAR(255),
  is_whitelisted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### shipping_addresses
```sql
CREATE TABLE shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES wallet_users(id),
  full_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255),
  postal_code VARCHAR(50) NOT NULL,
  country VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### crypto_orders
```sql
CREATE TABLE crypto_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id UUID REFERENCES artworks(id),
  buyer_id UUID REFERENCES wallet_users(id),
  shipping_address_id UUID REFERENCES shipping_addresses(id),
  tx_hash VARCHAR(66),
  chain_id INTEGER NOT NULL,
  token_address VARCHAR(42) NOT NULL,
  amount DECIMAL(18,6) NOT NULL,
  amount_usd DECIMAL(10,2) NOT NULL,
  nft_token_id VARCHAR(78),
  nft_contract_address VARCHAR(42),
  nft_tx_hash VARCHAR(66),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Contratos Stablecoin (Mainnet)
```typescript
const USDC_ADDRESSES: Record<number, string> = {
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',  // Base
  137: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',   // Polygon
  42161: '0xaf88d065e77c8cc2239327c5edb3a432268e5831', // Arbitrum
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',     // Ethereum
};

const USDT_ADDRESSES: Record<number, string> = {
  137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',   // Polygon
  42161: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // Arbitrum
  1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',     // Ethereum
};
```

### Estructura de Archivos Final

```
/src
├── /app
│   ├── /api
│   │   ├── /auth/wallet/route.ts       [NUEVO]
│   │   ├── /checkout-crypto/route.ts   [NUEVO]
│   │   ├── /verify-tx/route.ts         [NUEVO]
│   │   └── /shipping/route.ts          [NUEVO]
│   ├── providers.tsx                    [NUEVO]
│   └── layout.tsx                       [MODIFICAR]
├── /components
│   ├── /checkout
│   │   ├── PaymentSelector.tsx         [NUEVO]
│   │   ├── CryptoPayment.tsx           [NUEVO]
│   │   └── ShippingForm.tsx            [NUEVO]
│   ├── /ui
│   │   ├── ConnectWallet.tsx           [NUEVO]
│   │   └── Navigation.tsx              [MODIFICAR]
│   └── HorizontalScroll.tsx            [MODIFICAR]
├── /hooks
│   └── useWallet.ts                    [NUEVO]
├── /lib
│   ├── services.ts                     [RENOMBRAR de supabase.ts]
│   ├── crypto.ts                       [NUEVO]
│   └── auth.ts                         [MODIFICAR whitelist]
└── /db
    └── schema.ts                       [MODIFICAR - agregar tablas]
```

---

## Notas para Continuar

Si el proceso se interrumpe, revisar este checklist y continuar desde el primer item sin marcar.

**Comando para ver estado actual**:
```bash
git status
```

**Comando para ver dependencias instaladas**:
```bash
npm list @privy-io/react-auth viem wagmi
```

**Verificar schema de DB**:
```bash
npm run db:studio
```
