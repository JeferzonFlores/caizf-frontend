# Frontend CAIZF - Next.js & React con shadcn/ui
SISTEMA DE CERTIFICADO DE ABASTECIMIENTO INTERNO PARA ZONAS FRONTERIZAS

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.52-FF4154?style=flat-square&logo=react-query)
![Shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-0.8-gray?style=flat-square)

[Backend CAIZF](http://gitlab.produccion.gob.bo/betholaqp/caizf-backend.git) creado con
NestJS.

## 🚀 Características

- ⚡️ **Next.js 14.2** con App Router para un rendimiento óptimo
- 💎 **Shadcn/ui** para componentes UI elegantes, accesibles y personalizables
- 🎨 Diseño rápido y responsivo con **Tailwind CSS 3.4**
- 🔄 Gestión de estado del servidor y caché con **TanStack Query 5.52**
- 🔒 Sistema de autenticación robusto con **Casbin** para control de acceso basado en roles
- 📝 Gestión de formularios eficiente con **React Hook Form** y validación con **Zod**
- 🌐 Cliente HTTP Axios para comunicación con el backend
- 📊 Visualización de datos con **Recharts**
- 📚 **Storybook** para documentación de componentes
- 🧪 Configuración de pruebas con Jest

## 🛠️ Tecnologías principales

- [Next.js 14.2](https://nextjs.org)
- [React 18.3](https://reactjs.org)
- [TypeScript 5.5](https://www.typescriptlang.org)
- [Tailwind CSS 3.4](https://tailwindcss.com)
- [TanStack Query 5.52](https://tanstack.com/query/latest)
- [Shadcn/ui](https://ui.shadcn.com)
- [React Hook Form 7.52](https://react-hook-form.com)
- [Zod 3.23](https://github.com/colinhacks/zod)
- [Axios 1.7](https://axios-http.com)
- [Casbin 5.30](https://casbin.org/)
- [Recharts 2.13 (alpha)](https://recharts.org/)
- [Storybook](https://storybook.js.org)

## 💡 Aspectos destacados

### Componentes UI con shadcn/ui

Este proyecto utiliza [shadcn/ui](https://ui.shadcn.com), una colección de componentes de UI reutilizables construidos
con Radix UI y Tailwind CSS. Estos componentes son altamente personalizables y accesibles, proporcionando una base
sólida para construir interfaces de usuario robustas y atractivas.

Ejemplo de uso de un componente shadcn/ui:

```tsx
import { Button } from "@/components/ui/button"

export function MyComponent() {
  return (
    <Button variant="outline">Click me</Button>
  )
}
```

### Gestión de Estado y Caché con TanStack Query

Este proyecto utiliza TanStack Query (anteriormente React Query) para manejar el estado del servidor, proporcionar
caching y optimizar las solicitudes de datos. Ejemplo de uso:

```tsx
import { useQuery } from '@tanstack/react-query'

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error al cargar usuarios</div>

  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

### Visualización de Datos con Recharts

El proyecto incluye Recharts para crear visualizaciones de datos atractivas y responsivas:

```tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

function DataVisualization({ data }) {
  return (
    <BarChart width={600} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  )
}
```

### Autenticación y Autorización

El proyecto incluye un sistema de autenticación robusto utilizando JWT y Casbin para el control de acceso basado en
roles. El `AuthProvider` maneja la lógica de autenticación, renovación de tokens y verificación de permisos.

Ejemplo de uso del hook `useAuth`:

```tsx
import { useAuth } from '@/contexts/AuthProvider'

function ProtectedComponent() {
  const { user, checkPermission } = useAuth()

  if (!user) return <div>Please log in</div>

  return (
    <div>
      {checkPermission('users', 'read') && <UserList />}
    </div>
  )
}
```

## 📁 Estructura del proyecto

```
src/
├── app/                    # Rutas y componentes de página (Next.js 14 App Router)
├── components/             # Componentes reutilizables
│   ├── ui/                 # Componentes de shadcn/ui
│   └── ...                 # Otros componentes personalizados
├── contexts/               # Contextos de React (Auth, Loading, etc.)
├── lib/                    # Utilidades y helpers
└── styles/                 # Estilos globales y configuración de Tailwind
```

## 🚀 Inicio rápido

1. Clona el repositorio:
   ```bash
   git clone http://gitlab.produccion.gob.bo/betholaqp/caizf-frontend.git caizf-frontend
   cd caizf-frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre [http://localhost:8080](http://localhost:8080) en tu navegador.

## 🎨 Personalización del diseño

Modifica `tailwind.config.ts` para personalizar el tema de Tailwind y, por extensión, el aspecto de los componentes de
shadcn/ui:

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          // ... otros tonos
        },
        // ... otros colores personalizados
      }
    }
  }
}
```

## 📚 Documentación de componentes

Genera la documentación de componentes con Storybook:

```bash
npm run storybook
```

## 🧪 Pruebas

Ejecuta las pruebas con:

```bash
npm run test
```

## 📦 Compilación para producción

```bash
npm run build
```

## 🔖 Versionado

Para generar una nueva versión:

1. Actualiza `package.json`
2. Ejecuta:
   ```bash
   npm run release -- --release-as minor
   ```
3. Pública los tags:
   ```bash
   git push --follow-tags origin main
   ```
