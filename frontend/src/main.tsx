import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as ChakraProvider } from './components/ui/provider.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store.ts'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import SignUp from './pages/SignUp.tsx'
import AuthLayout from './layouts/AuthLayout.tsx'
import MainLayout from './layouts/MainLayout.tsx'
import Products from './pages/Products.tsx'
import ProductDetails from './pages/ProductDetails.tsx'
import Cart from './pages/Cart.tsx'
import Checkout from './pages/Checkout.tsx'
import HomeLayout from './layouts/HomeLayout.tsx'
import AboutUs from './pages/AboutUs.tsx'
import GoogleCallback from './pages/GoogleCallback.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider>
      <ReduxProvider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeLayout><App /></HomeLayout>} />

            <Route path="/" element={<MainLayout />}>
              <Route path="shop" element={<Products />} />
              <Route path="shop/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="aboutus" element={<AboutUs />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/google/callback" element={<GoogleCallback />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ReduxProvider>
    </ChakraProvider>
  </StrictMode>
)
