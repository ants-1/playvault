import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from './components/ui/provider.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import SignUp from './pages/SignUp.tsx'
import AuthLayout from './layouts/AuthLayout.tsx'
import MainLayout from './layouts/MainLayout.tsx'
import Products from './pages/Products.tsx'
import ProductDetails from './pages/ProductDetails.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<App />} />
            <Route path="shop" element={<Products />} />
            <Route path="/shop/:id" element={<ProductDetails />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
