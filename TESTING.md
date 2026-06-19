# CreditView — Manual de Pruebas Manuales

## Credenciales Demo

| Campo    | Valor                 |
| -------- | --------------------- |
| Email    | demo@creditview.app   |
| Password | password123           |

URL: `http://localhost:3000`

---

## Setup Inicial

```sh
pnpm install
pnpm --filter @creditview/database exec prisma db seed
pnpm dev
```

---

## 1. Autenticación

### 1.1 Login
1. Ir a `/login`
2. Ingresar `demo@creditview.app` / `password123`
3. Click "SIGN IN"
4. ✓ Redirige a `/dashboard`
5. ✓ Sidebar muestra nombre "Demo User" y "SIGN OUT"

### 1.2 Logout
1. Click "SIGN OUT" en sidebar
2. ✓ Redirige a `/login`
3. ✓ No se puede acceder a `/dashboard` directamente (redirige a login)

### 1.3 Protección de rutas
1. Cerrar sesión
2. Intentar navegar a `/cards`, `/transactions`, `/budgets`, `/reports`, `/settings`
3. ✓ Redirige a `/login`

---

## 2. Dashboard (`/dashboard`)

1. ✓ Hero saluda "Good morning/afternoon, Demo User"
2. ✓ 3 metric cards: TOTAL LIMIT, USED BALANCE, AVAILABLE (suman valores reales de DB)
3. ✓ Recent Transactions: últimas 5-8 transacciones con DATE, MERCHANT, CARD, AMOUNT
4. ✓ Spending Breakdown: 4 categorías con barras de progreso
5. ✓ Datos actualizados en tiempo real (refrescar página)

---

## 3. Cards (`/cards`)

### 3.1 Listado
1. Ir a `/cards`
2. ✓ Muestra 3 cards en grilla: Visa Platinum, Amex Gold, Mastercard Black
3. ✓ Cada card tiene gradient visual, nombre, barra de utilización
4. ✓ Monthly Utilization muestra barras por mes
5. ✓ Quick Actions visibles

### 3.2 Crear Card
1. Click "ADD NEW CARD"
2. Llenar: Name "Test Card", Bank "Test Bank", Total Limit 3000, Currency USD, Cutoff 15, Payment 5, Interest 25
3. ✓ Card creada, redirige a `/cards`
4. ✓ Nueva card aparece en la grilla

### 3.3 Editar Card
1. Click en una card → `/cards/[id]`
2. Click "Edit Card"
3. Cambiar nombre, guardar
4. ✓ Nombre actualizado

### 3.4 Eliminar Card
1. En detalle de card, click "DELETE"
2. Confirmar en dialog
3. ✓ Card eliminada, redirige a `/cards`

---

## 4. Transactions (`/transactions`)

1. ✓ Tabla de 6 columnas: DATE, MERCHANT, CARD, CATEGORY, AMOUNT, STATUS
2. ✓ Filtros: SELECT CARD, DATE RANGE, search por merchant/categoría
3. ✓ Paginación si hay más de 10 transacciones
4. ✓ Export CSV descarga archivo
5. ✓ Montos negativos en rojo, positivos en verde
6. ✓ Categorías derivadas de la descripción

---

## 5. Statements (`/statements`)

1. ✓ Breadcrumb "FINANCE > STATEMENTS"
2. ✓ Meses agrupados (ej. June 2026)
3. ✓ Cards por mes con: OPENING BALANCE, PURCHASES, PAYMENTS, CLOSING BALANCE
4. ✓ Barra de LIMIT UTILIZATION
5. ✓ Payments en color #77A5BE

---

## 6. Budgets (`/budgets`)

### 6.1 Listado
1. ✓ Título "Budgets" + subtítulo
2. ✓ Si no hay budgets: empty state con botón "ADD BUDGET"
3. ✓ Grilla de cards con categoría, card asociada, badge MONTHLY/YEARLY, monto gastado/total, barra de progreso

### 6.2 Crear Budget
1. Click "ADD BUDGET"
2. Llenar: Category "Groceries", Amount 500, Period MONTHLY, fecha hoy
3. ✓ Budget creado, aparece en grilla

### 6.3 Eliminar Budget
1. Click "DELETE" en un budget card
2. Confirmar
3. ✓ Budget eliminado

---

## 7. Reports (`/reports`)

1. ✓ Título "Reports" + subtítulo
2. ✓ Portfolio Overview: cards por moneda (USD, EUR, etc.) con total limit, total used, utilization
3. ✓ Monthly Spending Trend: barras por mes (últimos 6 meses)
4. ✓ Category Breakdown: tabla con categorías, montos, porcentaje, transacciones
5. ✓ "DOWNLOAD REPORT" button

---

## 8. Settings (`/settings`)

### 8.1 Perfil
1. ✓ Muestra nombre "Demo User" y email "demo@creditview.app"
2. ✓ Información de solo lectura

### 8.2 Eliminar cuenta — PRECAUCIÓN
1. Click "DELETE ACCOUNT"
2. Confirmar en dialog
3. **⚠️ La cuenta demo (`demo@creditview.app`) está protegida. Muestra error:**
   > "The demo account cannot be deleted. Create a new account to test deletion."
4. Para probar la eliminación real: registrarse con otro email, luego eliminar esa cuenta
5. ✓ Tras eliminar una cuenta no-demo: redirige a login, credenciales ya no funcionan

### 8.3 Cambiar Password
1. Click "CHANGE PASSWORD"
2. ✓ Redirige a `/forgot-password` (formulario de reset)

---

## 9. Probar Eliminación Real (cuenta no-demo)

```sh
# 1. Registrar nuevo usuario via UI en /register
# 2. Iniciar sesión con el nuevo usuario
# 3. Ir a /settings
# 4. Click "DELETE ACCOUNT"
# 5. Confirmar
# 6. ✓ Redirige a /login
# 7. Intentar login con esas credenciales → falla
# 8. En DB: SELECT * FROM "User" WHERE email='nuevo@email.com' → vacío
```

---

## 10. Reset de Datos

Para restaurar los datos demo:

```sh
pnpm --filter @creditview/database exec prisma db seed
```

Esto elimina todos los datos existentes y recrea:
- 3 tarjetas (Visa Platinum, Amex Gold, Mastercard Black)
- ~14 transacciones
- 9 currencies

---

## Notas Técnicas

- **Prisma**: Usar `pnpm --filter @creditview/database exec prisma`, NO `npx prisma`
- **Seed**: Corre `prisma db:seed` automáticamente con `tsx prisma/seed.ts`
- **Cascada**: Eliminar un usuario elimina todas sus cards, transacciones, budgets, alerts, auditLogs
- **Demo protegida**: La cuenta `demo@creditview.app` no puede eliminarse desde Settings
